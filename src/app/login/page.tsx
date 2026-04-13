"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/app/dashboard";
  const [state, action, pending] = useActionState(loginAction, null as { error?: string } | null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Email</label>
        <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:border-amber-400" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Contraseña</label>
        <input name="password" type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:border-amber-400" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} type="submit" className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md glass-panel p-10 rounded-[2rem] border border-white/60">
        <Link href="/" className="flex items-center gap-3 mb-8">
          <span className="text-2xl" aria-hidden>🍪</span>
          <span className="text-lg font-medium text-slate-900 tracking-tight uppercase">CookieBoy</span>
        </Link>
        <h1 className="text-3xl font-medium text-slate-900 tracking-tight mb-2">Accede a tu cuenta</h1>
        <p className="text-sm text-slate-500 font-light mb-8">Gestiona tus licencias y facturación.</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-sm text-slate-500 text-center font-light">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-amber-600 hover:underline">Crear cuenta</Link>
        </p>
      </div>
    </main>
  );
}
