import type { Browser } from "playwright";

let browserPromise: Promise<Browser> | null = null;

async function launchBrowser(): Promise<Browser> {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-features=TranslateUI,IsolateOrigins,site-per-process",
    ],
  });
  // Si el proceso de Chromium muere, resetear el singleton para que el siguiente getBrowser() relance
  browser.on("disconnected", () => {
    console.warn("[scanner-browser] chromium disconnected, reseteando singleton");
    browserPromise = null;
  });
  return browser;
}

export async function getBrowser(): Promise<Browser> {
  if (browserPromise) {
    try {
      const b = await browserPromise;
      if (b.isConnected()) return b;
      browserPromise = null;
    } catch {
      browserPromise = null;
    }
  }
  browserPromise = launchBrowser().catch((err: unknown) => {
    browserPromise = null;
    throw err;
  });
  return browserPromise;
}

export async function closeBrowser(): Promise<void> {
  if (browserPromise) {
    try {
      const b = await browserPromise;
      await b.close();
    } catch {}
    browserPromise = null;
  }
}
