import type { Browser } from "playwright";

let browserPromise: Promise<Browser> | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    const { chromium } = await import("playwright");
    browserPromise = chromium.launch({
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
    }).catch((err: unknown) => {
      browserPromise = null;
      throw err;
    });
  }
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
