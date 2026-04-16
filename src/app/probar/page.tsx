"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProbarPage() {
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
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
          body: JSON.stringify({ email, domain }),
        }
      );
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ ok: false, error: "connection_error", message: "No se pudo conectar con el servidor. Inténtalo de nuevo." });
    } finally {
      setLoading(false);
    }
  }

  const errorMessages: Record<string, string> = {
    invalid_email: "Introduce un email válido.",
    invalid_domain: "Introduce un dominio válido (ej: mitienda.es).",
    trial_already_used: "Este dominio ya ha tenido un periodo de prueba.",
    rate_limit_exceeded: "Demasiados intentos. Espera unos minutos.",
    connection_error: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900"
        >
          ← Volver a inicio
        </Link>

        {result?.ok ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-semibold text-emerald-900 mb-3">
              ¡Tu prueba gratuita está activa!
            </h1>
            <p className="text-emerald-800 mb-6">
              Revisa tu email <strong>{email}</strong> — te hemos enviado tu
              clave de licencia e instrucciones para instalar el plugin.
            </p>
            <div className="rounded-xl bg-emerald-100 border border-emerald-300 p-4 font-mono text-lg tracking-widest text-emerald-900 mb-6">
              {result.license_key}
            </div>
            <div className="space-y-3 text-sm text-emerald-700">
              <p>
                <strong>Siguiente paso:</strong> descarga e instala el plugin
                en tu WordPress.
              </p>
              <a
                href="https://licencias.nubiumsolutions.com/cliente"
                className="inline-block mt-4 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white hover:bg-amber-600"
              >
                Ir a mi panel de cliente →
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🍪</div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Probar CookieBoy gratis
              </h1>
              <p className="text-slate-500 mt-2">
                14 días con todas las funcionalidades. Sin tarjeta de crédito.
              </p>
            </div>

            {result && !result.ok && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {errorMessages[result.error ?? ""] ??
                  result.message ??
                  "Error inesperado."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dominio de tu WordPress
                </label>
                <input
                  type="text"
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="mitienda.es"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Procesando..." : "Empezar prueba gratuita →"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Al registrarte aceptas nuestros{" "}
              <Link href="/terminos" className="underline">
                términos
              </Link>{" "}
              y{" "}
              <Link href="/privacidad" className="underline">
                política de privacidad
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
