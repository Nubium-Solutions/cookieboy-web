"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "../login/actions";

export default function RegistroPage() {
  const [state, action, pending] = useActionState(registerAction, null as { error?: string } | null);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md glass-panel p-10 rounded-[2rem] border border-white/60">
        <Link href="/" className="flex items-center gap-3 mb-8">
          <span className="text-2xl" aria-hidden>🍪</span>
          <span className="text-lg font-medium text-slate-900 tracking-tight uppercase">CookieBoy</span>
        </Link>
        <h1 className="text-3xl font-medium text-slate-900 tracking-tight mb-2">Crear cuenta</h1>
        <p className="text-sm text-slate-500 font-light mb-8">14 días de prueba gratis, sin tarjeta.</p>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Nombre</label>
            <input name="full_name" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Empresa</label>
            <input name="company" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Contraseña</label>
            <input name="password" type="password" required minLength={8} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:border-amber-400" />
          </div>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button disabled={pending} type="submit" className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
            {pending ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500 text-center font-light">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-amber-600 hover:underline">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
