"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function ProbarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    license_key?: string;
    error?: string;
    message?: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        "https://licencias.nubiumsolutions.com/api/trial/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        ok: false,
        error: "connection_error",
        message: "No se pudo conectar con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  }

  const errorMessages: Record<string, string> = {
    invalid_email: "Introduce un email válido.",
    too_many_trials: "Has alcanzado el máximo de pruebas gratuitas.",
    rate_limit_exceeded: "Demasiados intentos. Espera unos minutos.",
    connection_error: "No se pudo conectar. Inténtalo de nuevo.",
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,.06),transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-10"
        >
          <Icon icon="solar:arrow-left-linear" width={16} />
          cookieboy.es
        </Link>

        {result?.ok ? (
          /* ─── Success state ─── */
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center mb-6">
              <Icon icon="solar:check-read-linear" width={24} className="text-emerald-600" />
            </div>

            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
              Revisa tu email
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-8">
              Hemos enviado a <strong className="text-slate-700">{email}</strong> tu
              clave de licencia e instrucciones de instalación.
            </p>

            {/* Steps */}
            <div className="space-y-0 mb-8">
              {[
                { n: "1", text: "Abre el email y copia tu clave de licencia" },
                { n: "2", text: "Descarga el plugin desde tu panel de cliente" },
                { n: "3", text: "Sube el .zip en WordPress → Plugins → Añadir nuevo" },
                { n: "4", text: "Ve a CookieBoy → Licencia y pega la clave" },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 py-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0 mt-px">
                    {step.n}
                  </div>
                  <p className="text-[14px] text-slate-600 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <a
                href="https://licencias.nubiumsolutions.com/cliente"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Ir a mi panel de cliente
                <Icon icon="solar:arrow-right-linear" width={16} />
              </a>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  ¿No te ha llegado?{" "}
                  <a
                    href="mailto:soporte@cookieboy.es"
                    className="text-amber-600 hover:text-amber-700"
                  >
                    Contactar soporte
                  </a>
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ─── Form state ─── */
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mb-6">
              <Icon icon="solar:shield-check-linear" width={24} className="text-amber-600" />
            </div>

            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
              Prueba CookieBoy gratis
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-8">
              14 días con todas las funcionalidades. Sin tarjeta.
            </p>

            {/* Error */}
            {result && !result.ok && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200/60 mb-6">
                <Icon icon="solar:danger-circle-linear" width={18} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">
                  {errorMessages[result.error ?? ""] ?? result.message ?? "Error inesperado."}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Email de trabajo
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  autoFocus
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 text-[15px] placeholder:text-slate-300 focus:border-slate-400 focus:ring-0 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando tu prueba...
                  </>
                ) : (
                  "Empezar prueba gratuita"
                )}
              </button>
            </form>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
              {[
                { icon: "solar:clock-circle-linear", text: "14 días completos, sin limitaciones" },
                { icon: "solar:card-recive-linear", text: "Sin tarjeta de crédito" },
                { icon: "solar:magic-stick-3-linear", text: "Escaneo automático de tu web" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Icon icon={f.icon} width={16} className="text-slate-400 shrink-0" />
                  <span className="text-[13px] text-slate-500">{f.text}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-[11px] text-slate-300 leading-relaxed">
              Al registrarte aceptas nuestros{" "}
              <Link href="/terminos" className="underline hover:text-slate-400">
                términos
              </Link>{" "}
              y{" "}
              <Link href="/privacidad" className="underline hover:text-slate-400">
                política de privacidad
              </Link>
              . ¿Problemas?{" "}
              <a href="mailto:soporte@cookieboy.es" className="underline hover:text-slate-400">
                soporte@cookieboy.es
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
