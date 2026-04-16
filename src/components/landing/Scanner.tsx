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
    category?: string;
    provider?: string;
    purpose?: string;
  }[];
  trackers: { name: string; provider: string; category: string }[];
  gdpr_checks: GdprCheck[];
  gdpr_summary: { passed: number; failed: number; warnings: number; total: number };
  score: number;
};

type Progress = { visited: number; queue: number; cookies: number; trackers: number };

const CAT_DOT: Record<string, string> = {
  analytics: "bg-blue-500",
  marketing: "bg-rose-500",
  preferences: "bg-violet-500",
  necessary: "bg-emerald-500",
};
const CAT_LABEL: Record<string, string> = {
  analytics: "Analítica",
  marketing: "Marketing",
  preferences: "Preferencias",
  necessary: "Necesaria",
};

function ScoreRing({ score }: { score: number }) {
  const r = 54, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tracking-tight text-slate-900 tabular-nums">{score}</span>
        <span className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">de 100</span>
      </div>
    </div>
  );
}

export function Scanner({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [showAllCookies, setShowAllCookies] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(null);
    setShowAllCookies(false);
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
          try {
            const evt = JSON.parse(line);
            if (evt.type === "progress") setProgress(evt);
            else if (evt.type === "done") setResult(evt);
            else if (evt.type === "error") setError(evt.message ?? "Error desconocido.");
          } catch { /* skip */ }
        }
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  const httpCookies = result?.cookies.filter(c => c.source === "http") ?? [];
  const inferredCookies = result?.cookies.filter(c => c.source === "inferred") ?? [];

  return (
    <section id="escaner" className={`max-w-5xl mx-auto px-4 sm:px-6 ${compact ? "pt-16 md:pt-20 pb-24 md:pb-32" : "pt-20 md:pt-32 pb-28 md:pb-40"}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-6">
          <Icon icon="solar:magnifer-linear" width={14} height={14} />
          Auditoría GDPR gratuita
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-medium text-slate-900 tracking-tighter mb-6 leading-[1.1]">
          ¿Tu web cumple con GDPR?
        </h2>
        <p className="text-base md:text-lg text-slate-500 font-light max-w-2xl mx-auto">
          Analizamos cookies, trackers y consentimiento de tu sitio. Sin registro.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="glass-panel p-3 rounded-full border border-white/60 flex items-center gap-2 max-w-2xl mx-auto mb-16">
        <Icon icon="solar:global-linear" className="text-slate-400 ml-4 shrink-0" width={20} height={20} />
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

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-sm text-center mb-8">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block w-10 h-10 border-[3px] border-amber-300 border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-slate-500 font-light mb-1">Rastreando <span className="text-slate-900 font-medium">{url}</span></p>
          <p className="text-slate-400 text-xs mb-10">El análisis depende del tamaño del sitio</p>
          <div className="grid grid-cols-4 gap-px bg-slate-200/60 rounded-2xl overflow-hidden max-w-lg mx-auto">
            {[
              { v: progress?.visited ?? 0, l: "Páginas" },
              { v: progress?.queue ?? 0, l: "En cola" },
              { v: progress?.cookies ?? 0, l: "Cookies" },
              { v: progress?.trackers ?? 0, l: "Trackers" },
            ].map(d => (
              <div key={d.l} className="bg-white py-5 px-3">
                <div className="text-2xl font-semibold text-slate-900 tabular-nums">{d.v}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{d.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Summary row */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Score */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-8 flex items-center gap-8">
              <ScoreRing score={result.score} />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{result.host}</h3>
                <p className="text-sm text-slate-500 mb-3">{result.urls_scanned} páginas analizadas{result.timed_out ? "+" : ""}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-slate-600"><strong className="text-slate-900">{result.cookies.length}</strong> cookies</span>
                  <span className="text-slate-600"><strong className="text-slate-900">{result.trackers.length}</strong> trackers</span>
                </div>
              </div>
            </div>
            {/* GDPR summary pills */}
            <div className="flex flex-row md:flex-col gap-3 md:w-56">
              <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Icon icon="solar:check-circle-linear" width={20} />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900 tabular-nums leading-none">{result.gdpr_summary.passed}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Correctos</div>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                  <Icon icon="solar:close-circle-linear" width={20} />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900 tabular-nums leading-none">{result.gdpr_summary.failed}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Fallos</div>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <Icon icon="solar:danger-triangle-linear" width={20} />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900 tabular-nums leading-none">{result.gdpr_summary.warnings}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Avisos</div>
                </div>
              </div>
            </div>
          </div>

          {/* GDPR Checks */}
          {result.gdpr_checks.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Informe de cumplimiento</h3>
                <p className="text-xs text-slate-400 mt-1">Verificación basada en RGPD, ePrivacy, AEPD y CNIL</p>
              </div>
              <div className="divide-y divide-slate-100">
                {result.gdpr_checks.map((check) => {
                  const icon = check.status === "pass"
                    ? { name: "solar:check-circle-bold", cls: "text-emerald-500" }
                    : check.status === "fail"
                    ? { name: "solar:close-circle-bold", cls: "text-red-500" }
                    : { name: "solar:danger-triangle-bold", cls: "text-amber-500" };
                  return (
                    <div key={check.id} className="px-8 py-5 flex items-start gap-4">
                      <Icon icon={icon.name} width={20} className={`${icon.cls} mt-0.5 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-slate-900">{check.name}</span>
                          {check.severity === "critical" && (
                            <span className="text-[9px] font-semibold px-1.5 py-px rounded bg-red-100 text-red-600 uppercase tracking-wider">Crítico</span>
                          )}
                        </div>
                        <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">{check.detail}</p>
                        <p className="text-[11px] text-slate-300 mt-1">{check.reference}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trackers + cookies side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Trackers */}
            {result.trackers.length > 0 && (
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900">Trackers</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {result.trackers.map((t) => (
                    <div key={t.name} className="px-6 py-3.5 flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{t.name}</div>
                        <div className="text-[11px] text-slate-400">{t.provider}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${CAT_DOT[t.category] ?? "bg-slate-400"}`} />
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{CAT_LABEL[t.category] ?? t.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cookies */}
            {result.cookies.length > 0 && (
              <div className={`${result.trackers.length > 0 ? "lg:col-span-3" : "lg:col-span-5"} bg-white rounded-2xl border border-slate-200/80 overflow-hidden`}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Cookies <span className="font-normal text-slate-400">({result.cookies.length})</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {httpCookies.length} detectadas · {inferredCookies.length} inferidas de scripts
                    </p>
                  </div>
                  {result.cookies.length > 8 && (
                    <button
                      onClick={() => setShowAllCookies(!showAllCookies)}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      {showAllCookies ? "Colapsar" : `Ver todas (${result.cookies.length})`}
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-6 font-medium">Nombre</th>
                        <th className="py-3 px-3 font-medium">Dominio</th>
                        <th className="py-3 px-3 font-medium">Duración</th>
                        <th className="py-3 px-6 font-medium">Tipo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(showAllCookies ? result.cookies : result.cookies.slice(0, 8)).map((c, i) => (
                        <tr key={`${c.name}-${i}`} className="align-top group">
                          <td className="py-3 px-6">
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${CAT_DOT[c.category ?? ""] ?? "bg-slate-300"}`} />
                              <span className="font-mono text-slate-900 text-xs">{c.name}</span>
                            </div>
                            {c.purpose && (
                              <p className="text-[11px] text-slate-400 mt-1 ml-3.5 leading-snug max-w-xs">{c.purpose}</p>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-500 text-xs max-w-[140px] truncate">{c.domain}</td>
                          <td className="py-3 px-3 text-slate-400 text-xs whitespace-nowrap">{c.expires ?? "Sesión"}</td>
                          <td className="py-3 px-6">
                            {c.source === "inferred" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600">
                                <span className="w-1 h-1 rounded-full bg-amber-400" />
                                Inferida
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                HTTP
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!showAllCookies && result.cookies.length > 8 && (
                  <div className="px-6 py-3 border-t border-slate-100">
                    <button
                      onClick={() => setShowAllCookies(true)}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      + {result.cookies.length - 8} cookies más
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center py-10 px-8 bg-slate-900 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,.12),transparent_70%)]" />
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-3">
                Soluciona estos problemas en 5 minutos
              </h3>
              <p className="text-slate-400 text-sm mb-8 max-w-lg mx-auto">
                CookieBoy instala el banner, bloquea cookies sin consentimiento, genera la política y activa Consent Mode v2 automáticamente.
              </p>
              <Link
                href="/probar"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-colors"
              >
                Probar gratis 14 días
                <Icon icon="solar:arrow-right-linear" width={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
