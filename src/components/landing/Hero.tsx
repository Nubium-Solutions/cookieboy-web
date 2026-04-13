import { Icon } from "@iconify/react";

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-28 sm:pt-32 pb-16 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 max-w-7xl mx-auto w-full z-10">
        {/* Text Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200/70 backdrop-blur-md text-[10px] font-medium tracking-widest uppercase text-slate-500 shadow-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            GDPR · LOPDGDD · ePrivacy
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-slate-900 leading-[1.05] tracking-tight mb-6">
            Cumple con
            <br />
            las cookies.
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed mb-10 font-light">
            Banner de cookies, detección automática, política autogenerada y
            Google Consent Mode v2. Todo desde un único plugin de WordPress
            ligero, en 7 idiomas y listo en 5 minutos.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="/registro"
              className="cta-btn w-full sm:w-auto px-10 py-4 text-sm font-medium text-slate-900 bg-white/70 border border-white/90 rounded-full backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-all duration-400 hover:-translate-y-1 hover:bg-white/95 relative overflow-hidden inline-flex items-center justify-center"
            >
              Probar gratis
            </a>
            <a
              href="#caracteristicas"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-normal text-slate-700 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white/60 transition-all duration-300 inline-flex items-center justify-center"
            >
              Ver características
            </a>
          </div>
        </div>

        {/* 3D Device Mockup with CookieBoy admin */}
        <div className="relative perspective-1400 flex items-center justify-center mt-8 lg:mt-0 hero-mockup-scale">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[125%] h-[125%] bg-amber-400/10 rounded-full blur-[90px] -z-10 pointer-events-none" />

          <div className="animate-float relative w-[340px] h-[720px] mx-auto transform-gpu transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] transform-style-3d">
            {/* Side buttons */}
            <div className="absolute -left-[9px] top-[122px] w-[9px] h-[28px] bg-[#e2e8f0] rounded-l-lg shadow-[inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(15,23,42,0.15)] border border-white/60 border-r-0 z-0 transition-transform hover:-translate-x-[1px]" />
            <div className="absolute -left-[9px] top-[176px] w-[9px] h-[56px] bg-[#e2e8f0] rounded-l-lg shadow-[inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(15,23,42,0.15)] border border-white/60 border-r-0 z-0 transition-transform hover:-translate-x-[1px]" />
            <div className="absolute -left-[9px] top-[244px] w-[9px] h-[56px] bg-[#e2e8f0] rounded-l-lg shadow-[inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(15,23,42,0.15)] border border-white/60 border-r-0 z-0 transition-transform hover:-translate-x-[1px]" />
            <div className="absolute -right-[9px] top-[190px] w-[9px] h-[78px] bg-[#e2e8f0] rounded-r-lg shadow-[inset_-2px_2px_4px_rgba(255,255,255,0.9),inset_2px_-2px_4px_rgba(15,23,42,0.15)] border border-white/60 border-l-0 z-0 transition-transform hover:translate-x-[1px]" />

            {/* Clay body */}
            <div className="absolute inset-0 bg-[#e2e8f0] rounded-[3.9rem] shadow-[25px_35px_65px_rgba(15,23,42,0.15),inset_-6px_-6px_16px_rgba(15,23,42,0.08),inset_6px_6px_16px_rgba(255,255,255,0.95)] border-[5px] border-[#f1f5f9] z-0" />

            {/* Screen */}
            <div className="absolute inset-x-[10px] top-[10px] bottom-[10px] bg-[#f8f9fb] rounded-[3.25rem] overflow-hidden flex flex-col z-10 shadow-[inset_0_0_20px_rgba(15,23,42,0.06)] border border-slate-200/70">
              {/* Dynamic island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[116px] h-[30px] bg-[#0f172a] rounded-full z-50 shadow-md flex items-center justify-between px-2.5 hover:w-[126px] transition-all duration-500 cursor-pointer">
                <div className="w-3 h-3 bg-[#1e293b] rounded-full flex items-center justify-center border border-white/5">
                  <div className="w-1 h-1 bg-amber-500/50 rounded-full blur-[1px]" />
                </div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.6)] animate-pulse" />
              </div>

              {/* Status bar */}
              <div className="h-14 w-full pt-3 px-6 flex justify-between items-center text-xs font-medium text-slate-800 z-40 bg-gradient-to-b from-[#f8f9fb] to-transparent">
                <span className="ml-1 tracking-tight">9:41</span>
                <div className="flex gap-1.5 items-center opacity-80 mr-1">
                  <Icon icon="solar:celluler-linear" width={14} height={14} />
                  <Icon icon="solar:wi-fi-linear" width={14} height={14} />
                  <Icon icon="solar:battery-charge-linear" width={16} height={16} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-4 pt-2 pb-10 flex flex-col gap-3 overflow-hidden relative z-10 bg-gradient-to-br from-[#f8f9fb] to-[#e2e8f0]/30">
                <div className="flex flex-col mb-1 ml-1 transform-gpu transition-all duration-700 hover:translate-x-1">
                  <h2 className="text-xl font-medium text-slate-800 tracking-tight leading-none">CookieBoy</h2>
                  <p className="text-xs text-slate-500 font-normal mt-1">Todo cumple</p>
                </div>

                {/* Acceptance rate */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm p-4 flex items-center justify-between relative border border-slate-100/80 group transition-all hover:-translate-y-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Aceptación</span>
                    <span className="text-3xl font-medium text-slate-800 tracking-tight mt-1">
                      87<span className="text-sm text-slate-400 font-normal ml-px">%</span>
                    </span>
                  </div>
                  <div className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 transition-transform duration-1000 group-hover:rotate-[360deg]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="264" strokeDashoffset="34" strokeLinecap="round" />
                    </svg>
                    <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100/50 text-amber-500 group-hover:scale-110 transition-transform">
                      <Icon icon="solar:graph-up-linear" width={14} height={14} />
                    </div>
                  </div>
                </div>

                {/* Consent chart */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm p-4 flex flex-col relative overflow-hidden border border-slate-100/80 group transition-all hover:-translate-y-1 h-[168px]">
                  <div className="flex justify-between items-center mb-2 z-10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.4)] animate-pulse" />
                      <span className="text-xs font-medium text-slate-400 tracking-widest uppercase">Consentimientos</span>
                    </div>
                    <div className="text-sm font-medium text-slate-800">
                      1.248<span className="text-slate-400 font-normal text-xs ml-0.5">/mes</span>
                    </div>
                  </div>
                  <div className="flex-1 flex items-end gap-[3px] z-10 w-full pt-2">
                    {[30, 45, 35, 55, 75, 100, 65, 45, 25, 40, 50, 35].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm transition-all ${
                          h === 100 ? "bg-emerald-500/60 relative" : "bg-amber-500/" + (i % 3 === 0 ? "20" : i % 2 === 0 ? "30" : "15")
                        }`}
                        style={{ height: `${h}%` }}
                      >
                        {h === 100 && (
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-sm border border-white" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto-detection */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm p-4 border border-slate-100/80 flex flex-col justify-between relative overflow-hidden min-h-[120px] flex-1 group transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50/80 flex items-center justify-center border border-amber-100/50 group-hover:rotate-12 group-hover:scale-110 transition-transform">
                        <Icon icon="solar:shield-check-linear" width={14} height={14} className="text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-slate-800 tracking-tight">Detección automática</h4>
                        <p className="text-xs text-amber-500 font-normal mt-0.5">Activa · 12 cookies</p>
                      </div>
                    </div>
                    <div className="w-8 h-4 bg-amber-500 rounded-full relative shadow-inner">
                      <div className="absolute right-[2px] top-[2px] w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[124px] h-[4px] bg-slate-900/10 rounded-full z-40 transition-all hover:bg-slate-900/20 hover:scale-x-105 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
