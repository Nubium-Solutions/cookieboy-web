import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CookieBoy — Cumplimiento GDPR automático para WordPress",
  description:
    "Banner de cookies, detección automática, política autogenerada y Google Consent Mode v2. Todo desde un único plugin de WordPress ligero y en 7 idiomas.",
  keywords: [
    "GDPR",
    "LOPDGDD",
    "ePrivacy",
    "cookies",
    "banner cookies",
    "consentimiento",
    "WordPress",
    "Google Consent Mode v2",
    "política de cookies",
  ],
  authors: [{ name: "Nubium Solutions" }],
  openGraph: {
    title: "CookieBoy — Cumplimiento GDPR automático para WordPress",
    description:
      "Plugin GDPR con detección automática de cookies, banner en 7 idiomas, política autogenerada y Google Consent Mode v2.",
    url: "https://cookieboy.es",
    siteName: "CookieBoy",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://api.iconify.design" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.iconify.design" />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased overflow-x-hidden selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
