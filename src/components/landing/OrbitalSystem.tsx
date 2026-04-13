import { Icon } from "@iconify/react";

const integrations = [
  {
    icon: "solar:graph-up-linear",
    title: "Analytics",
    subtitle: "Google Analytics, GTM",
  },
  {
    icon: "solar:widget-linear",
    title: "Marketing",
    subtitle: "Meta Pixel, TikTok, LinkedIn",
  },
  {
    icon: "solar:chat-round-linear",
    title: "Comportamiento",
    subtitle: "Hotjar, Clarity, Mixpanel",
  },
  {
    icon: "solar:cart-large-minimalistic-linear",
    title: "Plugins WP",
    subtitle: "WooCommerce, Elementor",
  },
];

const positionClasses = [
  "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
];

export function OrbitalSystem() {
  return (
    <section className="bg-slate-50/30 py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-slate-900 tracking-tight mb-4">
          Compatible con tu stack
        </h2>
        <p className="text-base md:text-lg text-slate-500 font-light">
          CookieBoy reconoce automáticamente las cookies de las herramientas que ya usas.
        </p>
      </div>

      {/* MOBILE: grid simple con logo arriba */}
      <div className="md:hidden max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-28 h-28 rounded-full bg-[#fef3c7] border border-white/80 shadow-xl flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-white/40 blur-xl scale-110 pointer-events-none" />
            <div className="relative w-20 h-20 rounded-full border border-amber-300/40 bg-gradient-to-br from-white to-amber-100 shadow-md flex items-center justify-center animate-logo-pulse">
              <span className="text-4xl" aria-hidden>🍪</span>
            </div>
          </div>
          <span className="mt-4 text-[10px] uppercase tracking-[0.35em] text-slate-500 font-normal">COOKIEBOY</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {integrations.map((it) => (
            <div
              key={it.title}
              className="bg-white/70 backdrop-blur-xl border border-white/60 p-4 rounded-2xl shadow-sm flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Icon icon={it.icon} width={20} height={20} className="text-amber-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-slate-800 tracking-tight">{it.title}</h3>
                <p className="text-xs text-slate-500 font-normal truncate">{it.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP: sistema orbital */}
      <div className="hidden md:flex relative items-center justify-center min-h-[700px]">
        <div className="lg:scale-100 md:scale-75 flex w-[800px] h-[800px] relative items-center justify-center">
          <div className="relative z-10 w-40 h-40 rounded-full bg-[#fef3c7] border border-white/80 shadow-xl flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-white/40 blur-xl scale-110 pointer-events-none" />
            <div className="relative w-[112px] h-[112px] rounded-full border border-amber-300/40 bg-gradient-to-br from-white to-amber-100 shadow-md flex items-center justify-center animate-logo-pulse">
              <span className="text-6xl" aria-hidden>🍪</span>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center">
              <span className="text-xs uppercase tracking-[0.35em] text-slate-500 font-normal">COOKIEBOY</span>
            </div>
          </div>

          <div className="absolute inset-0 rounded-full border border-slate-900/[0.03] animate-orbit-track">
            {integrations.map((it, i) => (
              <div
                key={it.title}
                className={`absolute ${positionClasses[i]} w-64 h-24 flex items-center justify-center`}
              >
                <div className="animate-orbit-card w-full">
                  <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-default group flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon icon={it.icon} width={20} height={20} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-800 tracking-tight">{it.title}</h3>
                      <p className="text-xs text-slate-500 font-normal">{it.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-[180px] border border-slate-900/[0.02] rounded-full pointer-events-none" />
          <div className="absolute inset-[280px] border border-slate-900/[0.015] rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
