import { NextRequest } from "next/server";

export const maxDuration = 300;

type DetectedCookie = {
  name: string;
  domain: string;
  expires?: string;
  secure: boolean;
  http_only: boolean;
  found_on: string[];
};

type DetectedTracker = {
  name: string;
  provider: string;
  category: "analytics" | "marketing" | "preferences" | "necessary";
};

const TRACKERS: { pattern: RegExp; name: string; provider: string; category: DetectedTracker["category"] }[] = [
  { pattern: /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i, name: "Google Tag Manager", provider: "Google", category: "analytics" },
  { pattern: /google-analytics\.com|gtag\(|G-[A-Z0-9]{8,}|UA-\d+/i, name: "Google Analytics", provider: "Google", category: "analytics" },
  { pattern: /connect\.facebook\.net|fbq\(/i, name: "Meta Pixel", provider: "Meta", category: "marketing" },
  { pattern: /static\.hotjar\.com|hj\(/i, name: "Hotjar", provider: "Hotjar", category: "analytics" },
  { pattern: /clarity\.ms/i, name: "Microsoft Clarity", provider: "Microsoft", category: "analytics" },
  { pattern: /doubleclick\.net/i, name: "Google Ads", provider: "Google", category: "marketing" },
  { pattern: /linkedin\.com\/insight|_linkedin_/i, name: "LinkedIn Insight", provider: "LinkedIn", category: "marketing" },
  { pattern: /tiktok\.com\/i18n\/pixel|ttq\(/i, name: "TikTok Pixel", provider: "TikTok", category: "marketing" },
  { pattern: /snap\.licdn\.com|snaptr\(/i, name: "Snap Pixel", provider: "Snapchat", category: "marketing" },
  { pattern: /youtube\.com\/embed|youtube-nocookie/i, name: "YouTube Embed", provider: "Google", category: "marketing" },
  { pattern: /platform\.twitter\.com/i, name: "Twitter Widget", provider: "X", category: "marketing" },
  { pattern: /stripe\.com\/v3/i, name: "Stripe", provider: "Stripe", category: "necessary" },
  { pattern: /recaptcha|gstatic\.com\/recaptcha/i, name: "reCAPTCHA", provider: "Google", category: "necessary" },
  { pattern: /intercom|widget\.intercom\.io/i, name: "Intercom", provider: "Intercom", category: "preferences" },
  { pattern: /hubspot|hs-scripts/i, name: "HubSpot", provider: "HubSpot", category: "marketing" },
  { pattern: /mailchimp|list-manage\.com/i, name: "Mailchimp", provider: "Mailchimp", category: "marketing" },
];

const MAX_TOTAL_MS = 600_000;
const PER_REQ_MS = 6000;
const CONCURRENCY = 8;
const HARD_CAP = 5000;
const SKIP_EXT = /\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|mp4|mp3|avi|mov|wav|woff2?|ttf|eot|json|xml|rss)(\?|$)/i;

function normalizeUrl(raw: string, base: URL): string | null {
  try {
    const u = new URL(raw, base);
    u.hash = "";
    if (u.hostname !== base.hostname) return null;
    if (!/^https?:$/.test(u.protocol)) return null;
    if (SKIP_EXT.test(u.pathname)) return null;
    u.pathname = u.pathname.replace(/\/+$/, "") || "/";
    return u.toString();
  } catch {
    return null;
  }
}

function extractLinks(html: string, base: URL): string[] {
  const out = new Set<string>();
  const re = /<a\b[^>]*\bhref\s*=\s*["']([^"'#]+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const norm = normalizeUrl(m[1], base);
    if (norm) out.add(norm);
  }
  return [...out];
}

function parseSetCookies(headers: Headers, pageHost: string, pageUrl: string, map: Map<string, DetectedCookie>) {
  const h = headers as Headers & { getSetCookie?: () => string[] };
  const raw: string[] = typeof h.getSetCookie === "function" ? h.getSetCookie() : [];
  for (const line of raw) {
    const parts = line.split(";").map((s) => s.trim());
    const [kv, ...attrs] = parts;
    const eq = kv.indexOf("=");
    if (eq < 0) continue;
    const name = kv.slice(0, eq).trim();
    let domain = pageHost;
    let expires: string | undefined;
    let secure = false;
    let httpOnly = false;
    for (const a of attrs) {
      const [k, v] = a.split("=").map((s) => s.trim());
      const kl = (k || "").toLowerCase();
      if (kl === "domain" && v) domain = v.replace(/^\./, "");
      else if (kl === "expires" && v) expires = v;
      else if (kl === "max-age" && v) {
        const secs = parseInt(v, 10);
        if (!Number.isNaN(secs)) expires = new Date(Date.now() + secs * 1000).toUTCString();
      } else if (kl === "secure") secure = true;
      else if (kl === "httponly") httpOnly = true;
    }
    const key = `${name}|${domain}`;
    const existing = map.get(key);
    if (existing) {
      if (existing.found_on.length < 5 && !existing.found_on.includes(pageUrl)) {
        existing.found_on.push(pageUrl);
      }
    } else {
      map.set(key, { name, domain, expires, secure, http_only: httpOnly, found_on: [pageUrl] });
    }
  }
}

function detectTrackers(html: string, found: Map<string, DetectedTracker>) {
  for (const t of TRACKERS) {
    if (!found.has(t.name) && t.pattern.test(html)) {
      found.set(t.name, { name: t.name, provider: t.provider, category: t.category });
    }
  }
}

function computeScore(opts: { cookies: number; trackers: number; hasBanner: boolean; hasPolicy: boolean }) {
  let score = 100;
  if (!opts.hasBanner) score -= 40;
  if (!opts.hasPolicy) score -= 20;
  score -= Math.min(30, opts.trackers * 5);
  score -= Math.min(10, opts.cookies * 1);
  return Math.max(0, score);
}

function detectBanner(html: string): boolean {
  return /cookie[- ]?consent|cookie[- ]?banner|cookie[- ]?notice|aviso[- ]?de[- ]?cookies|gdpr|cookiebot|onetrust|cookieboy|iubenda/i.test(html);
}

function detectPolicy(html: string): boolean {
  return /pol[ií]tica[- ]?de[- ]?cookies|cookie[- ]?policy|\/cookies["'\/]/i.test(html);
}

async function fetchOne(url: string): Promise<{ html: string; headers: Headers } | null> {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), PER_REQ_MS);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "CookieBoy-Scanner/1.0 (+https://cookieboy.es)" },
      redirect: "follow",
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html")) return { html: "", headers: res.headers };
    const html = await res.text();
    return { html, headers: res.headers };
  } catch {
    return null;
  } finally {
    clearTimeout(to);
  }
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_body" }), { status: 400 });
  }
  let input = (body.url ?? "").trim();
  if (!input) return new Response(JSON.stringify({ error: "missing_url" }), { status: 400 });
  if (!/^https?:\/\//i.test(input)) input = "https://" + input;

  let base: URL;
  try {
    base = new URL(input);
  } catch {
    return new Response(JSON.stringify({ error: "invalid_url" }), { status: 400 });
  }
  if (!/^https?:$/.test(base.protocol)) {
    return new Response(JSON.stringify({ error: "invalid_protocol" }), { status: 400 });
  }
  base.hash = "";
  base.pathname = base.pathname.replace(/\/+$/, "") || "/";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      const start = Date.now();
      const queue: string[] = [base.toString()];
      const visited = new Set<string>();
      const cookies = new Map<string, DetectedCookie>();
      const trackers = new Map<string, DetectedTracker>();
      let hasBanner = false;
      let hasPolicy = false;

      send({ type: "start", url: base.toString(), host: base.hostname });

      try {
        while (queue.length > 0 && visited.size < HARD_CAP && Date.now() - start < MAX_TOTAL_MS) {
          const batch: string[] = [];
          while (batch.length < CONCURRENCY && queue.length > 0 && visited.size + batch.length < HARD_CAP) {
            const next = queue.shift()!;
            if (visited.has(next)) continue;
            batch.push(next);
          }
          if (batch.length === 0) break;
          batch.forEach((u) => visited.add(u));

          const results = await Promise.all(batch.map((u) => fetchOne(u).then((r) => ({ url: u, r }))));
          for (const { url, r } of results) {
            if (!r) continue;
            parseSetCookies(r.headers, base.hostname, url, cookies);
            if (r.html) {
              detectTrackers(r.html, trackers);
              if (!hasBanner && detectBanner(r.html)) hasBanner = true;
              if (!hasPolicy && detectPolicy(r.html)) hasPolicy = true;
              if (visited.size < HARD_CAP) {
                for (const link of extractLinks(r.html, base)) {
                  if (!visited.has(link) && !queue.includes(link)) queue.push(link);
                }
              }
            }
          }

          send({
            type: "progress",
            visited: visited.size,
            queue: queue.length,
            cookies: cookies.size,
            trackers: trackers.size,
          });
        }

        const cookiesArr = [...cookies.values()];
        const trackersArr = [...trackers.values()];
        const score = computeScore({
          cookies: cookiesArr.length,
          trackers: trackersArr.length,
          hasBanner,
          hasPolicy,
        });
        const elapsed = Date.now() - start;
        const timedOut = elapsed >= MAX_TOTAL_MS && queue.length > 0;

        send({
          type: "done",
          url: base.toString(),
          host: base.hostname,
          urls_scanned: visited.size,
          queue_remaining: queue.length,
          timed_out: timedOut,
          cookies: cookiesArr,
          trackers: trackersArr,
          checks: { has_banner: hasBanner, has_policy: hasPolicy },
          score,
        });
      } catch (e) {
        send({ type: "error", message: (e as Error).message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
