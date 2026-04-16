"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

type GdprCheck = {
  id: string;
  name: string;
  description: string;
  status: "pass" | "fail" | "warn";
  detail: string;
  severity: "critical" | "high" | "medium";
  reference: string;
};

type ScanResult = {
  url: string;
  host: string;
  urls_scanned: number;
  queue_remaining: number;
  timed_out: boolean;
  cookies: {
    name: string;
    domain: string;
    expires?: string;
    secure: boolean;
    http_only: boolean;
    source: "http" | "inferred";
    inferred_from?: string;
    provider?: string;
    purpose?: string;
  }[];
  trackers: { name: string; provider: string; category: string }[];
  gdpr_checks: GdprCheck[];
  gdpr_summary: { passed: number; failed: number; warnings: number; total: number };
  score: number;
};

type Progress = { visited: number; queue: number; cookies: number; trackers: number };

const categoryStyles: Record<string, string> = {
  analytics: "bg-blue-100 text-blue-700",
  marketing: "bg-rose-100 text-rose-700",
  preferences: "bg-purple-100 text-purple-700",
  necessary: "bg-emerald-100 text-emerald-700",
};

export function Scanner({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(null);
    try {
      const res = await fetch("/api/scan-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "timeout" ? "La web tardó demasiado en responder." : "No se pudo analizar la web.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          let evt: { type: string; [k: string]: unknown };
          try {
            evt = JSON.parse(line);
          } catch {
            continue;
          }
          if (evt.type === "progress") {
            setProgress({
              visited: evt.visited as number,
              queue: evt.queue as number,
              cookies: evt.cookies as number,
              trackers: evt.trackers as number,
            });
          } else if (evt.type === "done") {
            setResult(evt as unknown as ScanResult);
          } else if (evt.type === "error") {
            setError((evt.message as string) ?? "Error desconocido.");
          }
        }
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor =
    result && result.score >= 80
      ? "text-emerald-600"
      : result && result.score >= 50
      ? "text-amber-600"
      : "text-red-600";

  return (
    <section id="escaner" className={`max-w-4xl mx-auto px-4 sm:px-6 ${compact ? "pt-16 md:pt-20 pb-24 md:pb-32" : "pt-20 md:pt-32 pb-28 md:pb-40"}`}>
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-6">
          <Icon icon="solar:magnifer-linear" width={14} height={14} />
          Escáner gratuito
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-medium text-slate-900 tracking-tighter mb-6 leading-[1.1]">
          ¿Tu web cumple con GDPR?
        </h2>
        <p className="text-base md:text-lg text-slate-500 font-light max-w-2xl mx-auto">
          Introduce tu URL y analizamos las cookies, trackers y banners de tu sitio en segundos. Gratis y sin registro.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-3 rounded-full border border-white/60 flex items-center gap-2 max-w-2xl mx-auto mb-4">
        <Icon icon="solar:global-linear" className="text-slate-400 ml-4" width={20} height={20} />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="ejemplo.com"
          required
          disabled={loading}
          className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 text-base py-2 min-w-0"
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Analizando..." : "Analizar"}
        </button>
      </form>
      <p className="text-center text-xs text-slate-500 font-light mb-12">
        Rastreamos todas las páginas internas de tu sitio para mostrarte el plan que mejor encaja.
      </p>

      {error && (
        <div className="glass-panel p-6 rounded-2xl border border-red-200 bg-red-50/60 text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="glass-panel p-12 rounded-[3rem] border border-white/60 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <div className="inline-block w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-slate-500 font-light mb-1">Rastreando {url}...</p>
            <p className="text-slate-500 text-xs font-light mb-8">
              El tamaño de la web determinará la duración del análisis
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl md:text-4xl font-medium text-slate-900 tracking-tighter tabular-nums">
                  {progress?.visited ?? 0}
                </div>
                <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Rastreadas</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-medium text-slate-900 tracking-tighter tabular-nums">
                  {progress?.queue ?? 0}
                </div>
                <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">En cola</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-medium text-amber-600 tracking-tighter tabular-nums">
                  {progress?.cookies ?? 0}
                </div>
                <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Cookies</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-medium text-amber-600 tracking-tighter tabular-nums">
                  {progress?.trackers ?? 0}
                </div>
                <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Trackers</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-[100px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              <div className="text-center md:text-left flex-1">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">CookieBoy Score</div>
                <div className={`text-6xl md:text-7xl font-medium tracking-tighter ${scoreColor}`}>{result.score}</div>
                <div className="text-sm text-slate-500 font-light mt-2">sobre 100</div>
              </div>
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">URL analizada</span>
                  <span className="font-mono text-slate-900 truncate max-w-[60%]">{result.host}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Páginas rastreadas</span>
                  <span className="font-medium text-slate-900">
                    {result.urls_scanned}
                    {result.timed_out && <span className="text-amber-600 ml-1">+</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Cookies detectadas</span>
                  <span className="font-medium text-slate-900">{result.cookies.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Trackers detectados</span>
                  <span className="font-medium text-slate-900">{result.trackers.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Checks GDPR</span>
                  <span className="font-medium text-slate-900">
                    {result.gdpr_summary.passed} ok · {result.gdpr_summary.failed} fallos · {result.gdpr_summary.warnings} avisos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {result.gdpr_checks.length > 0 && (
            <div className="glass-panel p-8 rounded-[2rem] border border-white/60">
              <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-6">Cumplimiento GDPR</h3>
              <div className="space-y-3">
                {result.gdpr_checks.map((check) => (
                  <div key={check.id} className={`p-4 rounded-xl border ${
                    check.status === "pass" ? "bg-emerald-50/60 border-emerald-200/60" :
                    check.status === "fail" ? "bg-red-50/60 border-red-200/60" :
                    "bg-amber-50/60 border-amber-200/60"
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">
                        {check.status === "pass" ? "✅" : check.status === "fail" ? "❌" : "⚠️"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-900">{check.name}</span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            check.severity === "critical" ? "bg-red-100 text-red-700" :
                            check.severity === "high" ? "bg-amber-100 text-amber-700" :
                            "bg-slate-100 text-slate-600"
                          }`}>{check.severity === "critical" ? "Crítico" : check.severity === "high" ? "Alto" : "Medio"}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{check.detail}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-light">{check.reference}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.trackers.length > 0 && (
            <div className="glass-panel p-8 rounded-[2rem] border border-white/60">
              <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-6">Servicios de tracking detectados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.trackers.map((t) => (
                  <div key={t.name} className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-white/80">
                    <div>
                      <div className="font-medium text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500 font-light">{t.provider}</div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider ${categoryStyles[t.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {t.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.cookies.length > 0 && (
            <div className="glass-panel p-8 rounded-[2rem] border border-white/60">
              <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">Cookies detectadas ({result.cookies.length})</h3>
              <p className="text-xs text-slate-500 font-light mb-6 max-w-2xl">
                Las cookies marcadas como <span className="text-amber-700 font-medium">INFERIDA</span> se deducen de los plugins y servicios detectados en el HTML, no de cabeceras HTTP reales. Verifica tu instalación antes de publicarlas en tu política de cookies.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 pr-4">Nombre</th>
                      <th className="py-3 pr-4">Dominio</th>
                      <th className="py-3 pr-4">Expira</th>
                      <th className="py-3">Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.cookies.map((c, i) => (
                      <tr key={`${c.name}-${i}`} className="border-b border-slate-100 last:border-0 align-top">
                        <td className="py-3 pr-4">
                          <div className="font-mono text-slate-900">{c.name}</div>
                          {c.source === "inferred" && (
                            <div className="text-[10px] text-amber-700 font-light mt-1">
                              Inferida de {c.inferred_from}
                            </div>
                          )}
                          {c.purpose && (
                            <div className="text-[11px] text-slate-500 font-light mt-1 max-w-xs">{c.purpose}</div>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">{c.domain}</td>
                        <td className="py-3 pr-4 text-slate-500 text-xs">{c.expires ?? "Sesión"}</td>
                        <td className="py-3 text-xs">
                          {c.source === "inferred" ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium uppercase tracking-wider text-[10px]">
                              Inferida
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium uppercase tracking-wider text-[10px]">
                              Detectada
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="glass-panel p-10 rounded-[2rem] border border-amber-300/60 bg-gradient-to-br from-amber-50/60 to-white/60 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-medium text-slate-900 tracking-tight mb-3">
                Cumple al 100% con CookieBoy
              </h3>
              <p className="text-slate-500 font-light mb-6 max-w-xl mx-auto">
                Instala el plugin en WordPress y gestiona banner, política, consentimientos y Consent Mode v2 en minutos.
              </p>
              <Link
                href="/probar"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
              >
                Probar gratis 14 días
                <Icon icon="solar:arrow-right-linear" width={18} height={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
