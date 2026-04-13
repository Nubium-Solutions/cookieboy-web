"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

export function FloatingGallery() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-slate-50/50 max-w-[1400px] mx-auto px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto text-center mb-10 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/60 backdrop-blur-md text-xs font-normal tracking-widest uppercase text-slate-500 shadow-sm cursor-default mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Todo en un panel
        </div>
        <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight leading-tight">
          Un único panel.
          <br />
          Cero complicaciones.
        </h2>
        <p className="mt-4 text-lg text-slate-500 font-light max-w-xl mx-auto leading-relaxed">
          Los 4 módulos que incluye CookieBoy, en un solo vistazo.
        </p>
      </div>

      <div
        id="gallery-interaction"
        ref={ref}
        className={`relative z-10 w-full max-w-[1000px] h-[500px] md:h-[600px] mx-auto flex items-center justify-center perspective-1200 ${
          active ? "active" : ""
        }`}
      >
        {/* Center card */}
        <div className="relative z-50 w-[300px] md:w-[360px] bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[32px] p-8 shadow-lg transition-all duration-500">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-normal tracking-[0.2em] uppercase text-slate-400">Panel</span>
            <div className="w-8 h-8 rounded-full bg-amber-100/50 border border-white flex items-center justify-center text-amber-500">
              <Icon icon="solar:monitor-linear" width={16} height={16} />
            </div>
          </div>
          <h3 className="text-2xl font-normal text-slate-900 tracking-tight">CookieBoy Admin</h3>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed font-light">
            Gestiona banner, cookies, consentimientos y políticas desde un único
            lugar dentro de WordPress.
          </p>
          <div className="flex flex-col bg-white/50 w-full h-32 border border-white/60 rounded-2xl mt-8 p-3 shadow-inner gap-2">
            <div className="w-1/2 h-2 bg-amber-200/80 rounded-full" />
            <div className="flex-1 bg-amber-50/50 w-full border border-amber-200/30 rounded-xl relative">
              <div className="absolute top-3 left-3 right-3 h-2 bg-white rounded-full w-2/3 shadow-sm" />
            </div>
          </div>
        </div>

        {/* Scatter cards */}
        <div className="card-scatter-1 absolute w-[260px] md:w-[280px] bg-white/60 backdrop-blur-xl border border-white/60 rounded-[28px] p-6 shadow-md opacity-0 transition-all duration-700 transition-spring z-40 pointer-events-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-normal tracking-[0.2em] uppercase text-slate-400">Detectar</span>
            <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-500">
              <Icon icon="solar:shield-check-linear" width={14} height={14} />
            </div>
          </div>
          <h4 className="text-lg font-medium text-slate-800 tracking-tight">Cookies detectadas</h4>
          <p className="mt-2 text-xs text-slate-500 font-light">Listado con categoría, duración y proveedor.</p>
        </div>

        <div className="card-scatter-2 absolute w-[260px] md:w-[280px] bg-white/60 backdrop-blur-xl border border-white/60 rounded-[28px] p-6 shadow-md opacity-0 transition-all duration-700 transition-spring delay-75 z-30 pointer-events-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-normal tracking-[0.2em] uppercase text-slate-400">Medir</span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-500">
              <Icon icon="solar:graph-linear" width={14} height={14} />
            </div>
          </div>
          <h4 className="text-lg font-medium text-slate-800 tracking-tight">Consentimientos</h4>
          <p className="mt-2 text-xs text-slate-500 font-light">Tasa de aceptación, dispositivo y país.</p>
        </div>

        <div className="card-scatter-3 absolute w-[260px] md:w-[280px] bg-white/60 backdrop-blur-xl border border-white/60 rounded-[28px] p-6 shadow-md opacity-0 transition-all duration-700 transition-spring delay-100 z-20 pointer-events-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-normal tracking-[0.2em] uppercase text-slate-400">Publicar</span>
            <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-100/50 flex items-center justify-center text-orange-500">
              <Icon icon="solar:document-text-linear" width={14} height={14} />
            </div>
          </div>
          <h4 className="text-lg font-medium text-slate-800 tracking-tight">Política de cookies</h4>
          <p className="mt-2 text-xs text-slate-500 font-light">Autogenerada y sincronizada con el diccionario.</p>
        </div>

        <div className="card-scatter-4 absolute w-[260px] md:w-[280px] bg-white/60 backdrop-blur-xl border border-white/60 rounded-[28px] p-6 shadow-md opacity-0 transition-all duration-700 transition-spring delay-150 z-10 pointer-events-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-normal tracking-[0.2em] uppercase text-slate-400">Configurar</span>
            <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-500">
              <Icon icon="solar:settings-linear" width={14} height={14} />
            </div>
          </div>
          <h4 className="text-lg font-medium text-slate-800 tracking-tight">Banner editor</h4>
          <p className="mt-2 text-xs text-slate-500 font-light">Colores, textos, posición y categorías.</p>
        </div>
      </div>
    </section>
  );
}
