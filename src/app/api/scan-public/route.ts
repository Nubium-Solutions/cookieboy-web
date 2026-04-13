import { NextRequest } from "next/server";
import { promises as fs } from "fs";

export const maxDuration = 300;

type DictEntry = {
  cat: "necessary" | "analytics" | "marketing" | "preferences";
  provider: string;
  purpose: string;
  duration: string;
  policy_url?: string;
};
type Dictionary = Record<string, DictEntry>;

const DICT_PATH = process.env.DICTIONARY_PATH ?? "/var/www/api/dictionary.json";
const DICT_TTL_MS = 5 * 60 * 1000;
let dictCache: { data: Dictionary; loaded: number } | null = null;

async function loadDictionary(): Promise<Dictionary> {
  if (dictCache && Date.now() - dictCache.loaded < DICT_TTL_MS) return dictCache.data;
  try {
    const raw = await fs.readFile(DICT_PATH, "utf8");
    const data = JSON.parse(raw) as Dictionary;
    dictCache = { data, loaded: Date.now() };
    return data;
  } catch {
    dictCache = { data: {}, loaded: Date.now() };
    return {};
  }
}

function lookupDict(name: string, dict: Dictionary): DictEntry | null {
  if (dict[name]) return dict[name];
  for (const pattern in dict) {
    if (!pattern.includes("*")) continue;
    const regex = new RegExp("^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
    if (regex.test(name)) return dict[pattern];
  }
  return null;
}

type DetectedCookie = {
  name: string;
  domain: string;
  expires?: string;
  secure: boolean;
  http_only: boolean;
  found_on: string[];
  source: "http" | "inferred";
  inferred_from?: string;
  category?: "analytics" | "marketing" | "preferences" | "necessary";
  provider?: string;
  purpose?: string;
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

type InferredCookie = {
  name: string;
  domain: string;
  expires: string;
  purpose: string;
  category: "analytics" | "marketing" | "preferences" | "necessary";
  provider: string;
};

const TRACKER_COOKIES: Record<string, InferredCookie[]> = {
  "Google Tag Manager": [
    { name: "_ga", domain: "google-analytics", expires: "2 años", purpose: "Identifica usuarios únicos para Google Analytics.", category: "analytics", provider: "Google" },
    { name: "_gid", domain: "google-analytics", expires: "24 horas", purpose: "Identifica usuarios únicos durante 24h.", category: "analytics", provider: "Google" },
    { name: "_gat", domain: "google-analytics", expires: "1 minuto", purpose: "Limita la frecuencia de peticiones a Analytics.", category: "analytics", provider: "Google" },
  ],
  "Google Analytics": [
    { name: "_ga", domain: "google-analytics", expires: "2 años", purpose: "Identifica usuarios únicos para Google Analytics.", category: "analytics", provider: "Google" },
    { name: "_gid", domain: "google-analytics", expires: "24 horas", purpose: "Identifica usuarios únicos durante 24h.", category: "analytics", provider: "Google" },
    { name: "_gat", domain: "google-analytics", expires: "1 minuto", purpose: "Limita la frecuencia de peticiones a Analytics.", category: "analytics", provider: "Google" },
    { name: "_ga_*", domain: "google-analytics", expires: "2 años", purpose: "Mantiene el estado de sesión para Google Analytics 4.", category: "analytics", provider: "Google" },
  ],
  "Meta Pixel": [
    { name: "_fbp", domain: "facebook", expires: "3 meses", purpose: "Identificador de navegador para Meta Ads.", category: "marketing", provider: "Meta" },
    { name: "fr", domain: "facebook.com", expires: "3 meses", purpose: "Publicidad dirigida en Facebook.", category: "marketing", provider: "Meta" },
  ],
  "Hotjar": [
    { name: "_hjSessionUser_*", domain: "hotjar", expires: "1 año", purpose: "Identifica al usuario único para Hotjar.", category: "analytics", provider: "Hotjar" },
    { name: "_hjSession_*", domain: "hotjar", expires: "30 minutos", purpose: "Mantiene la sesión de Hotjar activa.", category: "analytics", provider: "Hotjar" },
  ],
  "Microsoft Clarity": [
    { name: "_clck", domain: "clarity.ms", expires: "1 año", purpose: "Almacena el ID de usuario de Clarity.", category: "analytics", provider: "Microsoft" },
    { name: "_clsk", domain: "clarity.ms", expires: "1 día", purpose: "Vincula múltiples vistas de página a una sesión.", category: "analytics", provider: "Microsoft" },
  ],
  "Google Ads": [
    { name: "IDE", domain: "doubleclick.net", expires: "1 año", purpose: "Publicidad personalizada en la red Google Display.", category: "marketing", provider: "Google" },
    { name: "_gcl_au", domain: "google", expires: "3 meses", purpose: "Atribución de conversiones de Google Ads.", category: "marketing", provider: "Google" },
  ],
  "LinkedIn Insight": [
    { name: "li_sugr", domain: "linkedin.com", expires: "3 meses", purpose: "Identifica al usuario para publicidad en LinkedIn.", category: "marketing", provider: "LinkedIn" },
    { name: "bcookie", domain: "linkedin.com", expires: "1 año", purpose: "ID del navegador para LinkedIn.", category: "marketing", provider: "LinkedIn" },
  ],
  "TikTok Pixel": [
    { name: "_ttp", domain: "tiktok.com", expires: "1 año", purpose: "ID de seguimiento de TikTok Ads.", category: "marketing", provider: "TikTok" },
  ],
  "YouTube Embed": [
    { name: "VISITOR_INFO1_LIVE", domain: "youtube.com", expires: "6 meses", purpose: "Mide el ancho de banda del usuario para reproducir vídeos.", category: "marketing", provider: "Google" },
    { name: "YSC", domain: "youtube.com", expires: "Sesión", purpose: "Cuenta visitas a vídeos de YouTube.", category: "marketing", provider: "Google" },
  ],
  "HubSpot": [
    { name: "__hstc", domain: "hubspot", expires: "6 meses", purpose: "Seguimiento de visitantes para HubSpot.", category: "marketing", provider: "HubSpot" },
    { name: "hubspotutk", domain: "hubspot", expires: "6 meses", purpose: "Identifica al usuario para HubSpot.", category: "marketing", provider: "HubSpot" },
  ],
  "Intercom": [
    { name: "intercom-id-*", domain: "intercom.io", expires: "9 meses", purpose: "ID anónimo del visitante en Intercom.", category: "preferences", provider: "Intercom" },
    { name: "intercom-session-*", domain: "intercom.io", expires: "1 semana", purpose: "Sesión de Intercom Messenger.", category: "preferences", provider: "Intercom" },
  ],
  "Stripe": [
    { name: "__stripe_mid", domain: "stripe.com", expires: "1 año", purpose: "Detección de fraude en pagos.", category: "necessary", provider: "Stripe" },
    { name: "__stripe_sid", domain: "stripe.com", expires: "30 minutos", purpose: "Sesión temporal de pagos Stripe.", category: "necessary", provider: "Stripe" },
  ],
};

function mergeInferredCookies(trackerNames: string[], cookies: Map<string, DetectedCookie>) {
  for (const trackerName of trackerNames) {
    const inferred = TRACKER_COOKIES[trackerName];
    if (!inferred) continue;
    for (const c of inferred) {
      const key = `${c.name}|${c.domain}`;
      if (cookies.has(key)) continue;
      cookies.set(key, {
        name: c.name,
        domain: c.domain,
        expires: c.expires,
        secure: false,
        http_only: false,
        found_on: [],
        source: "inferred",
        inferred_from: trackerName,
        category: c.category,
        provider: c.provider,
        purpose: c.purpose,
      });
    }
  }
}

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
      map.set(key, { name, domain, expires, secure, http_only: httpOnly, found_on: [pageUrl], source: "http" });
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

        mergeInferredCookies([...trackers.keys()], cookies);
        const dict = await loadDictionary();
        for (const c of cookies.values()) {
          const entry = lookupDict(c.name, dict);
          if (!entry) continue;
          c.category = c.category ?? entry.cat;
          c.provider = c.provider ?? entry.provider;
          c.purpose = c.purpose ?? entry.purpose;
          c.expires = c.expires ?? entry.duration;
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
