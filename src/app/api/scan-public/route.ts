import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import type { BrowserContext, Page } from "playwright";
import { getBrowser } from "@/lib/scanner-browser";

export const maxDuration = 300;
export const runtime = "nodejs";

// Precalentar el browser al cargar el módulo (elimina cold-start en el primer escaneo)
void getBrowser().catch((e: unknown) => console.error("[scan-public] browser preheat failed", e));

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

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX_PER_IP = 5;
const rateStore = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (rateStore.get(ip) ?? []).filter((t) => t > now - RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX_PER_IP) {
    rateStore.set(ip, hits);
    return false;
  }
  hits.push(now);
  rateStore.set(ip, hits);
  if (rateStore.size > 5000) {
    for (const [k, v] of rateStore) {
      const alive = v.filter((t) => t > now - RATE_WINDOW_MS);
      if (alive.length === 0) rateStore.delete(k);
      else rateStore.set(k, alive);
    }
  }
  return true;
}

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
  kind: "tracker" | "plugin";
};

type DetectorKind = "tracker" | "plugin";

type Detector = {
  pattern: RegExp;
  name: string;
  provider: string;
  category: DetectedTracker["category"];
  kind: DetectorKind;
  family?: string;
  priority?: number;
};

const TRACKERS: Detector[] = [
  // Analytics & ads (visible en UI como "Servicios de tracking")
  { pattern: /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i, name: "Google Tag Manager", provider: "Google", category: "analytics", kind: "tracker" },
  { pattern: /google-analytics\.com|gtag\(|G-[A-Z0-9]{8,}|UA-\d+/i, name: "Google Analytics", provider: "Google", category: "analytics", kind: "tracker" },
  { pattern: /connect\.facebook\.net|fbq\(/i, name: "Meta Pixel", provider: "Meta", category: "marketing", kind: "tracker" },
  { pattern: /static\.hotjar\.com|hj\(/i, name: "Hotjar", provider: "Hotjar", category: "analytics", kind: "tracker" },
  { pattern: /clarity\.ms/i, name: "Microsoft Clarity", provider: "Microsoft", category: "analytics", kind: "tracker" },
  { pattern: /doubleclick\.net/i, name: "Google Ads", provider: "Google", category: "marketing", kind: "tracker" },
  { pattern: /linkedin\.com\/insight|_linkedin_/i, name: "LinkedIn Insight", provider: "LinkedIn", category: "marketing", kind: "tracker" },
  { pattern: /tiktok\.com\/i18n\/pixel|ttq\(/i, name: "TikTok Pixel", provider: "TikTok", category: "marketing", kind: "tracker" },
  { pattern: /snap\.licdn\.com|snaptr\(/i, name: "Snap Pixel", provider: "Snapchat", category: "marketing", kind: "tracker" },
  { pattern: /youtube\.com\/embed|youtube-nocookie/i, name: "YouTube Embed", provider: "Google", category: "marketing", kind: "tracker" },
  { pattern: /platform\.twitter\.com/i, name: "Twitter Widget", provider: "X", category: "marketing", kind: "tracker" },
  { pattern: /stripe\.com\/v3/i, name: "Stripe", provider: "Stripe", category: "necessary", kind: "tracker" },
  { pattern: /recaptcha|gstatic\.com\/recaptcha/i, name: "reCAPTCHA", provider: "Google", category: "necessary", kind: "tracker" },
  { pattern: /widget\.intercom\.io|intercomcdn\.com/i, name: "Intercom", provider: "Intercom", category: "preferences", kind: "tracker" },
  { pattern: /js\.hs-scripts\.com|js\.hubspot\.com/i, name: "HubSpot", provider: "HubSpot", category: "marketing", kind: "tracker" },
  { pattern: /chimpstatic\.com|list-manage\.com/i, name: "Mailchimp", provider: "Mailchimp", category: "marketing", kind: "tracker" },
  { pattern: /sourcebuster|sbjs\.min\.js|sbjs_(?:current|first|session|udata|migrations)/i, name: "Sourcebuster", provider: "Sourcebuster", category: "analytics", kind: "tracker" },
  // WordPress plugins (contribuyen cookies inferidas pero no "trackean" al usuario)
  { pattern: /wp-content\/plugins\/woocommerce|woocommerce\.min\.js|wc-cart|wc_cart/i, name: "WooCommerce", provider: "WordPress", category: "necessary", kind: "plugin" },
  // Consent managers — mutuamente exclusivos
  { pattern: /wp-content\/plugins\/cookie-law-info|cky-consent|cky-banner|cookieyes\.com/i, name: "CookieYes", provider: "CookieYes", category: "necessary", kind: "plugin", family: "consent_manager", priority: 10 },
  { pattern: /wp-content\/plugins\/cookieboy|wpcce[_-](?:consent|banner)/i, name: "CookieBoy", provider: "CookieBoy", category: "necessary", kind: "plugin", family: "consent_manager", priority: 20 },
  { pattern: /wp-content\/plugins\/complianz|cmplz-/i, name: "Complianz", provider: "Complianz", category: "necessary", kind: "plugin", family: "consent_manager", priority: 10 },
  { pattern: /wp-content\/themes\/wpbingo\b|wpbingo[_-]/i, name: "WPBingo", provider: "WPBingo", category: "preferences", kind: "plugin" },
  { pattern: /wp-content\/plugins\/wpc-smart-wishlist|woosw[-_]/i, name: "WPC Smart Wishlist", provider: "WPClever", category: "preferences", kind: "plugin" },
  { pattern: /wp-content\/plugins\/wp-consent-api|wp-consent-level|wp_has_consent/i, name: "WP Consent API", provider: "WordPress", category: "necessary", kind: "plugin" },
  { pattern: /wp-content\/plugins\/elementor|elementor-frontend/i, name: "Elementor", provider: "Elementor", category: "necessary", kind: "plugin" },
  { pattern: /wp-content\/plugins\/contact-form-7|wpcf7-f[0-9]+/i, name: "Contact Form 7", provider: "WordPress", category: "necessary", kind: "plugin" },
  { pattern: /jetpack-(?:block|comments|lazy)|wp-content\/plugins\/jetpack/i, name: "Jetpack", provider: "Automattic", category: "analytics", kind: "plugin" },
  { pattern: /__cf_bm|cf-ray|cdn-cgi\/challenge-platform/i, name: "Cloudflare", provider: "Cloudflare", category: "necessary", kind: "plugin" },
];

function resolveFamilies(found: Map<string, DetectedTracker>) {
  const byFamily = new Map<string, { name: string; priority: number }>();
  for (const det of TRACKERS) {
    if (!det.family || !found.has(det.name)) continue;
    const cur = byFamily.get(det.family);
    const pr = det.priority ?? 0;
    if (!cur || pr > cur.priority) byFamily.set(det.family, { name: det.name, priority: pr });
  }
  for (const det of TRACKERS) {
    if (!det.family || !found.has(det.name)) continue;
    const winner = byFamily.get(det.family);
    if (winner && winner.name !== det.name) found.delete(det.name);
  }
}

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
  "Sourcebuster": [
    { name: "sbjs_current", domain: "", expires: "6 meses", purpose: "Registra la fuente, medio y campaña de tráfico de la visita actual.", category: "analytics", provider: "Sourcebuster" },
    { name: "sbjs_current_add", domain: "", expires: "6 meses", purpose: "Datos complementarios de la fuente de tráfico actual.", category: "analytics", provider: "Sourcebuster" },
    { name: "sbjs_first", domain: "", expires: "6 meses", purpose: "Registra la primera fuente de tráfico con la que el visitante llegó.", category: "analytics", provider: "Sourcebuster" },
    { name: "sbjs_first_add", domain: "", expires: "6 meses", purpose: "Datos complementarios de la primera visita.", category: "analytics", provider: "Sourcebuster" },
    { name: "sbjs_session", domain: "", expires: "30 minutos", purpose: "Identifica la sesión activa del visitante.", category: "analytics", provider: "Sourcebuster" },
    { name: "sbjs_udata", domain: "", expires: "6 meses", purpose: "Navegador, sistema operativo y resolución del visitante.", category: "analytics", provider: "Sourcebuster" },
    { name: "sbjs_migrations", domain: "", expires: "6 meses", purpose: "Control de migraciones del formato de datos de Sourcebuster.", category: "analytics", provider: "Sourcebuster" },
  ],
  "WooCommerce": [
    { name: "woocommerce_cart_hash", domain: "", expires: "Sesión", purpose: "Verifica si el carrito ha cambiado para actualizar la caché.", category: "necessary", provider: "WooCommerce" },
    { name: "woocommerce_items_in_cart", domain: "", expires: "Sesión", purpose: "Indica que hay productos en el carrito para mostrar el widget.", category: "necessary", provider: "WooCommerce" },
    { name: "wp_woocommerce_session_*", domain: "", expires: "2 días", purpose: "Mantiene el carrito y la sesión del usuario en WooCommerce.", category: "necessary", provider: "WooCommerce" },
  ],
  "CookieYes": [
    { name: "cookieyes-consent", domain: "", expires: "1 año", purpose: "Almacena las preferencias de consentimiento de cookies del visitante.", category: "necessary", provider: "CookieYes" },
  ],
  "CookieBoy": [
    { name: "wpcce_consent", domain: "", expires: "1 año", purpose: "Almacena las categorías de cookies aceptadas o rechazadas.", category: "necessary", provider: "CookieBoy" },
    { name: "wpcce_consent_id", domain: "", expires: "1 año", purpose: "Identificador único del consentimiento para auditoría.", category: "necessary", provider: "CookieBoy" },
    { name: "wpcce_consent_date", domain: "", expires: "1 año", purpose: "Fecha en que se otorgó el consentimiento.", category: "necessary", provider: "CookieBoy" },
  ],
  "WPBingo": [
    { name: "wpbingo_recently_viewed", domain: "", expires: "Sesión", purpose: "Almacena los productos visitados recientemente.", category: "preferences", provider: "WPBingo" },
  ],
  "WPC Smart Wishlist": [
    { name: "woosw_key", domain: "", expires: "Sesión", purpose: "Clave de la lista de deseos del usuario.", category: "preferences", provider: "WPClever" },
    { name: "woosw_key_ori", domain: "", expires: "19 días", purpose: "Identifica la sesión única para la lista de deseos.", category: "preferences", provider: "WPClever" },
  ],
  "WP Consent API": [
    { name: "wp_consent_functional", domain: "", expires: "1 año", purpose: "Registra el consentimiento para cookies funcionales.", category: "necessary", provider: "WordPress" },
    { name: "wp_consent_preferences", domain: "", expires: "1 año", purpose: "Registra el consentimiento para cookies de preferencias.", category: "necessary", provider: "WordPress" },
    { name: "wp_consent_statistics", domain: "", expires: "1 año", purpose: "Registra el consentimiento para cookies estadísticas.", category: "necessary", provider: "WordPress" },
    { name: "wp_consent_statistics-anonymous", domain: "", expires: "1 año", purpose: "Registra el consentimiento para estadísticas anónimas.", category: "necessary", provider: "WordPress" },
    { name: "wp_consent_marketing", domain: "", expires: "1 año", purpose: "Registra el consentimiento para cookies de marketing.", category: "necessary", provider: "WordPress" },
  ],
  "Cloudflare": [
    { name: "__cf_bm", domain: "", expires: "30 minutos", purpose: "Protege el sitio frente a bots automatizados.", category: "necessary", provider: "Cloudflare" },
    { name: "cf_clearance", domain: "", expires: "30 días", purpose: "Valida que el visitante ha pasado los retos anti-bot.", category: "necessary", provider: "Cloudflare" },
  ],
  "Jetpack": [
    { name: "tk_ai", domain: "", expires: "Sesión", purpose: "Identificador anónimo para analítica de Jetpack.", category: "analytics", provider: "Automattic" },
    { name: "tk_lr", domain: "", expires: "1 año", purpose: "Referer inicial del usuario en Jetpack Stats.", category: "analytics", provider: "Automattic" },
    { name: "tk_or", domain: "", expires: "5 años", purpose: "Referer original del usuario en Jetpack Stats.", category: "analytics", provider: "Automattic" },
  ],
  "Elementor": [
    { name: "elementor", domain: "", expires: "Sesión", purpose: "Mantiene el estado del editor de Elementor.", category: "necessary", provider: "Elementor" },
  ],
};

function nameMatchesPattern(name: string, pattern: string): boolean {
  if (!pattern.includes("*")) return name === pattern;
  const re = new RegExp(
    "^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"
  );
  return re.test(name);
}

function mergeInferredCookies(trackerNames: string[], cookies: Map<string, DetectedCookie>, siteHost: string) {
  const existingNames = [...cookies.values()].map((c) => c.name);
  for (const trackerName of trackerNames) {
    const inferred = TRACKER_COOKIES[trackerName];
    if (!inferred) continue;
    for (const c of inferred) {
      const domain = c.domain || siteHost;
      const alreadyHttp = existingNames.some((n) => nameMatchesPattern(n, c.name));
      if (alreadyHttp) continue;
      const key = `${c.name}|${domain}`;
      if (cookies.has(key)) continue;
      cookies.set(key, {
        name: c.name,
        domain,
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

const MAX_TOTAL_MS = 60_000;
const PER_REQ_MS = 7_000;
const HEADLESS_BUDGET = 3;
const HEADLESS_CONCURRENCY = 3;
const FAST_CONCURRENCY = 24;
const FAST_TIMEOUT_MS = 3_500;
const HARD_CAP = 100;
const MAX_BODY_BYTES = 500_000;
const MAX_REDIRECTS = 3;

const CRITICAL_PATTERNS = /\/(politica|privacy|privacidad|cookie|aviso|legal|terminos|terms|checkout|carrito|cart|contacto|contact|login|register|registro|cuenta|account)/i;

function urlPriority(url: string): number {
  if (CRITICAL_PATTERNS.test(url)) return 100;
  try {
    const u = new URL(url);
    const segs = u.pathname.split("/").filter(Boolean);
    if (segs.length === 0) return 90;
    if (segs.length === 1) return 50;
    return Math.max(0, 30 - segs.length * 5);
  } catch { return 0; }
}

function templateKey(url: string): string {
  try {
    const u = new URL(url);
    const segs = u.pathname.split("/").filter(Boolean);
    if (segs.length <= 1) return u.pathname;
    return "/" + segs[0] + "/*";
  } catch { return url; }
}
const SKIP_EXT = /\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|mp4|mp3|avi|mov|wav|woff2?|ttf|eot|json|xml|rss)(\?|$)/i;

function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (/^10\./.test(h)) return true;
  if (/^127\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  if (/^0\./.test(h)) return true;
  if (h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80:")) return true;
  return false;
}

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

function detectTrackers(html: string, found: Map<string, DetectedTracker>) {
  if (found.size === TRACKERS.length) return;
  for (const t of TRACKERS) {
    if (found.has(t.name)) continue;
    if (t.pattern.test(html)) {
      found.set(t.name, { name: t.name, provider: t.provider, category: t.category, kind: t.kind });
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
  // Texto visible / clases DOM de banners server-rendered
  if (/cookie[- ]?consent|cookie[- ]?banner|cookie[- ]?notice|aviso[- ]?de[- ]?cookies|gdpr|cookiebot|onetrust|cookieboy|iubenda|cookieyes|cky-consent|cky-banner|cookie-law-info|complianz|cmplz-|termly|didomi|quantcast|klaro|axeptio|osano/i.test(html)) return true;
  // Scripts de CMPs que inyectan el banner via JS
  if (/\/wp-content\/plugins\/(?:cookie-law-info|cookie-notice|complianz|cookieyes|gdpr-cookie|real-cookie-banner|cookiebot|cookieboy|wp-cookie-consent-eu|iubenda-cookie-law-solution|borlabs-cookie)/i.test(html)) return true;
  if (/(?:consent\.cookiebot\.com|app\.cookieyes\.com|cdn\.iubenda\.com|cdn\.cookielaw\.org|cdn\.termly\.io|sdk\.privacy-center\.org)/i.test(html)) return true;
  return false;
}

function hasConsentManagerFamily(trackers: Map<string, DetectedTracker>): boolean {
  for (const det of TRACKERS) {
    if (det.family === "consent_manager" && trackers.has(det.name)) return true;
  }
  return false;
}

function detectPolicy(html: string): boolean {
  return /pol[ií]tica[- ]?de[- ]?cookies|cookie[- ]?policy|\/cookies["'\/]/i.test(html);
}

type FetchResult = {
  html: string;
  bannerVisible: boolean;
};

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CookieBoy-Scanner/1.0";

const BANNER_SELECTORS = [
  '[id*="cookie" i]',
  '[class*="cookie" i]',
  '[id*="consent" i]',
  '[class*="consent" i]',
  '[id*="gdpr" i]',
  '[class*="gdpr" i]',
  '[id*="cky-" i]',
  '[class*="cky-" i]',
  '#CybotCookiebotDialog',
  '#onetrust-banner-sdk',
  '#onetrust-consent-sdk',
  '.cmplz-cookiebanner',
  '#cookieboy-banner',
  '[class*="cmplz-"]',
  '.cc-window',
  '.cc-banner',
  '.iubenda-cs-container',
  '[aria-label*="cookie" i]',
  '[role="dialog"][aria-label*="consent" i]',
];

async function fetchOne(url: string, baseHost: string, context: BrowserContext): Promise<FetchResult | null> {
  try {
    const u = new URL(url);
    if (isPrivateHost(u.hostname)) return null;
    if (u.hostname !== baseHost) return null;
  } catch {
    return null;
  }

  let page: Page | null = null;
  try {
    page = await context.newPage();
    page.setDefaultNavigationTimeout(PER_REQ_MS);
    page.setDefaultTimeout(PER_REQ_MS);

    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: PER_REQ_MS });
    if (!response || response.status() >= 400) return null;

    // Esperar a que el banner JS tenga tiempo de inyectarse
    await page.waitForTimeout(400);

    const html = await page.content();

    const bannerVisible = await page.evaluate((selectors: string[]) => {
      for (const sel of selectors) {
        try {
          const els = document.querySelectorAll(sel);
          for (const el of Array.from(els)) {
            const he = el as HTMLElement;
            if (!he.offsetParent && getComputedStyle(he).position !== "fixed") continue;
            const style = getComputedStyle(he);
            if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) continue;
            if (he.offsetHeight < 20 || he.offsetWidth < 50) continue;
            const text = (he.innerText || "").toLowerCase();
            if (text.includes("cookie") || text.includes("consent") || text.includes("rgpd") || text.includes("gdpr") || text.includes("privacidad") || text.includes("aceptar") || text.includes("accept")) {
              return true;
            }
          }
        } catch {}
      }
      return false;
    }, BANNER_SELECTORS);

    return { html, bannerVisible };
  } catch {
    return null;
  } finally {
    if (page) await page.close().catch(() => {});
  }
}

async function fetchOneFast(url: string, baseHost: string): Promise<{ html: string } | null> {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), FAST_TIMEOUT_MS);
  try {
    let current = url;
    let res: Response | null = null;
    for (let i = 0; i <= MAX_REDIRECTS; i++) {
      try {
        const u = new URL(current);
        if (isPrivateHost(u.hostname)) return null;
        if (u.hostname !== baseHost) return null;
      } catch { return null; }
      res = await fetch(current, {
        headers: { "User-Agent": UA },
        redirect: "manual",
        signal: ctrl.signal,
      });
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) return null;
        current = new URL(loc, current).toString();
        continue;
      }
      break;
    }
    if (!res || !res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html")) return { html: "" };
    const reader = res.body?.getReader();
    if (!reader) return { html: "" };
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) { try { await reader.cancel(); } catch {} break; }
      chunks.push(value);
    }
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) { merged.set(c, offset); offset += c.byteLength; }
    return { html: new TextDecoder().decode(merged) };
  } catch {
    return null;
  } finally {
    clearTimeout(to);
  }
}

function playwrightCookieExpiry(expires: number): string | undefined {
  if (!expires || expires <= 0) return "Sesión";
  const ms = expires * 1000;
  const now = Date.now();
  if (ms <= now) return undefined;
  const days = Math.round((ms - now) / (24 * 60 * 60 * 1000));
  if (days >= 365) return `${Math.round(days / 365)} año${Math.round(days / 365) > 1 ? "s" : ""}`;
  if (days >= 30) return `${Math.round(days / 30)} mes${Math.round(days / 30) > 1 ? "es" : ""}`;
  if (days >= 1) return `${days} día${days > 1 ? "s" : ""}`;
  return "<1 día";
}

export async function POST(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = (fwd.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "rate_limit", message: `Máximo ${RATE_MAX_PER_IP} escaneos por hora por IP.` }),
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  const cl = parseInt(req.headers.get("content-length") ?? "0", 10);
  if (cl > 2048) {
    return new Response(JSON.stringify({ error: "body_too_large" }), { status: 413 });
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_body" }), { status: 400 });
  }
  if (typeof body.url !== "string" || body.url.length > 2000) {
    return new Response(JSON.stringify({ error: "invalid_url" }), { status: 400 });
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
  if (isPrivateHost(base.hostname)) {
    return new Response(JSON.stringify({ error: "private_host_blocked" }), { status: 400 });
  }
  base.hash = "";
  base.pathname = base.pathname.replace(/\/+$/, "") || "/";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      const start = Date.now();
      const queue: string[] = [base.toString()];
      const queued = new Set<string>([base.toString()]);
      const visited = new Set<string>();
      const cookies = new Map<string, DetectedCookie>();
      const trackers = new Map<string, DetectedTracker>();
      let hasBanner = false;
      let hasPolicy = false;

      send({ type: "start", url: base.toString(), host: base.hostname });

      let context: BrowserContext | null = null;

      const selectNextHeadless = (): string | null => {
        if (queue.length === 0) return null;
        // Prioriza por score de URL y por diversidad de template (1 por template)
        const seenTemplates = new Set<string>();
        for (const v of visited) seenTemplates.add(templateKey(v));
        let bestIdx = -1;
        let bestScore = -Infinity;
        for (let i = 0; i < queue.length; i++) {
          const u = queue[i];
          const tpl = templateKey(u);
          const templateBonus = seenTemplates.has(tpl) ? 0 : 20;
          const score = urlPriority(u) + templateBonus;
          if (score > bestScore) { bestScore = score; bestIdx = i; }
        }
        if (bestIdx < 0) return null;
        return queue.splice(bestIdx, 1)[0];
      };

      const phase1Start = Date.now();
      let phase1Elapsed = 0;

      try {
        const browser = await getBrowser();
        context = await browser.newContext({
          userAgent: UA,
          ignoreHTTPSErrors: true,
          viewport: { width: 1280, height: 800 },
          locale: "es-ES",
          timezoneId: "Europe/Madrid",
        });

        // FASE 1: headless con sampling inteligente (hasta HEADLESS_BUDGET URLs)
        let headlessDone = 0;
        while (queue.length > 0 && headlessDone < HEADLESS_BUDGET && visited.size < HARD_CAP && Date.now() - start < MAX_TOTAL_MS) {
          const batch: string[] = [];
          while (batch.length < HEADLESS_CONCURRENCY && headlessDone + batch.length < HEADLESS_BUDGET) {
            const next = selectNextHeadless();
            if (!next) break;
            if (visited.has(next)) continue;
            batch.push(next);
          }
          if (batch.length === 0) break;
          batch.forEach((u) => visited.add(u));
          headlessDone += batch.length;

          const results = await Promise.all(batch.map((u) => fetchOne(u, base.hostname, context!).then((r) => ({ url: u, r }))));
          for (const { r } of results) {
            if (!r) continue;
            if (r.html) {
              detectTrackers(r.html, trackers);
              if (!hasBanner && (r.bannerVisible || detectBanner(r.html))) hasBanner = true;
              if (!hasPolicy && detectPolicy(r.html)) hasPolicy = true;
              if (visited.size < HARD_CAP) {
                for (const link of extractLinks(r.html, base)) {
                  if (!visited.has(link) && !queued.has(link)) {
                    queue.push(link);
                    queued.add(link);
                  }
                }
              }
            }
          }

          send({
            type: "progress",
            visited: visited.size,
            queue: queue.length,
            cookies: cookies.size,
            trackers: [...trackers.values()].filter((t) => t.kind === "tracker").length,
          });
        }

        // Volcar cookies reales del contexto (solo ahora, que ya hemos navegado lo importante)
        const realCookies = await context.cookies();
        for (const c of realCookies) {
          const key = `${c.name}|${c.domain}`;
          if (cookies.has(key)) continue;
          cookies.set(key, {
            name: c.name,
            domain: c.domain.replace(/^\./, ""),
            expires: playwrightCookieExpiry(c.expires),
            secure: c.secure,
            http_only: c.httpOnly,
            found_on: [],
            source: "http",
          });
        }

        phase1Elapsed = Date.now() - phase1Start;

        // Cerrar contexto ya: no lo necesitamos más
        try { await context.close(); } catch {}
        context = null;

        const phase2Start = Date.now();
        const phase2Budget = 8_000; // máx 8s en fase 2 para cortar sitios lentos

        // FASE 2: fetch rápido para el resto hasta HARD_CAP (solo para contar páginas y descubrir trackers extra)
        while (queue.length > 0 && visited.size < HARD_CAP && Date.now() - start < MAX_TOTAL_MS && Date.now() - phase2Start < phase2Budget) {
          const batch: string[] = [];
          while (batch.length < FAST_CONCURRENCY && queue.length > 0 && visited.size + batch.length < HARD_CAP) {
            const next = queue.shift()!;
            if (visited.has(next)) continue;
            batch.push(next);
          }
          if (batch.length === 0) break;
          batch.forEach((u) => visited.add(u));

          const results = await Promise.all(batch.map((u) => fetchOneFast(u, base.hostname).then((r) => ({ url: u, r }))));
          for (const { r } of results) {
            if (!r || !r.html) continue;
            detectTrackers(r.html, trackers);
            if (!hasBanner && detectBanner(r.html)) hasBanner = true;
            if (!hasPolicy && detectPolicy(r.html)) hasPolicy = true;
            if (visited.size < HARD_CAP) {
              for (const link of extractLinks(r.html, base)) {
                if (!visited.has(link) && !queued.has(link)) {
                  queue.push(link);
                  queued.add(link);
                }
              }
            }
          }

          send({
            type: "progress",
            visited: visited.size,
            queue: queue.length,
            cookies: cookies.size,
            trackers: [...trackers.values()].filter((t) => t.kind === "tracker").length,
          });
        }

        resolveFamilies(trackers);
        if (!hasBanner && hasConsentManagerFamily(trackers)) hasBanner = true;
        mergeInferredCookies([...trackers.keys()], cookies, base.hostname);
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
        const trackersArr = [...trackers.values()].filter((t) => t.kind === "tracker");
        const pluginsArr = [...trackers.values()].filter((t) => t.kind === "plugin");
        const score = computeScore({
          cookies: cookiesArr.length,
          trackers: trackersArr.length,
          hasBanner,
          hasPolicy,
        });
        const elapsed = Date.now() - start;
        const timedOut = elapsed >= MAX_TOTAL_MS && queue.length > 0;

        const phase2Elapsed = Date.now() - phase2Start;
        console.log(`[scan-public] ${base.hostname} | ${visited.size} URLs | ${cookiesArr.length} cookies | ${trackersArr.length} trackers | total=${elapsed}ms phase1=${phase1Elapsed}ms phase2=${phase2Elapsed}ms`);

        send({
          type: "done",
          url: base.toString(),
          host: base.hostname,
          urls_scanned: visited.size,
          queue_remaining: queue.length,
          timed_out: timedOut,
          elapsed_ms: elapsed,
          cookies: cookiesArr,
          trackers: trackersArr,
          plugins: pluginsArr,
          checks: { has_banner: hasBanner, has_policy: hasPolicy },
          score,
        });
      } catch (e) {
        send({ type: "error", message: (e as Error).message });
      } finally {
        if (context) {
          try { await context.close(); } catch {}
        }
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
