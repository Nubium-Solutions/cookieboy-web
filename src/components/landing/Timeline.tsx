"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

type Phase = {
  number: string;
  title: string;
  description: string;
  icon: string;
  side: "left" | "right";
  delay?: string;
};

const phases: Phase[] = [
  {
    number: "Paso 01",
    title: "Instala el plugin",
    description:
      "Descarga CookieBoy desde tu área de cliente y súbelo a WordPress. 200 KB, sin dependencias.",
    icon: "solar:download-square-linear",
    side: "left",
  },
  {
    number: "Paso 02",
    title: "Configura en 5 minutos",
    description:
      "Personaliza el banner, elige el idioma automático y activa Google Consent Mode v2 con un clic.",
    icon: "solar:settings-linear",
    side: "right",
    delay: "1.5s",
  },
  {
    number: "Paso 03",
    title: "Cumple automáticamente",
    description:
      "CookieBoy detecta, clasifica y bloquea cookies de terceros sin consentimiento. Tú no haces nada más.",
    icon: "solar:shield-check-linear",
    side: "left",
    delay: "3s",
  },
];

export function Timeline() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const steps = Array.from(section.querySelectorAll<HTMLElement>(".tl-step"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === section) {
            section.classList.add("is-inview");
            return;
          }
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = Math.min(steps.indexOf(el) * 120, 360) + "ms";
          el.classList.add("is-inview");
          io.unobserve(el);
        });
      },
      { threshold: 0.28, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(section);
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="liquid-timeline"
      className="py-20 md:py-48 relative border-t border-slate-200/40 bg-slate-50/50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 text-center mb-12 md:mb-24 tl-title">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200/70 backdrop-blur-md text-[10px] font-normal tracking-widest uppercase text-slate-500 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Flujo
        </div>
        <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-medium text-slate-900 tracking-tight leading-tight">
          De 0 a cumplimiento total en 3 pasos.
        </h2>
        <p className="mt-4 text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
          Sin código, sin configuraciones complejas, sin mantenimiento. CookieBoy
          hace todo el trabajo pesado.
        </p>
      </div>

      <div
        className="tl-spine"
        aria-hidden="true"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 30%, black 100%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 30%, black 100%, transparent)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col gap-12 md:gap-40">
        {phases.map((p) => (
          <div key={p.number} className="tl-step group relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="absolute left-1/2 top-[3.5rem] -translate-x-1/2 hidden md:flex items-center justify-center z-20">
              <div className="tl-halo absolute w-24 h-24 border border-slate-200/50 rounded-full pointer-events-none" />
              <div
                className="tl-node w-14 h-14 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center animate-breathe group-hover:scale-105 transition-transform"
                style={p.delay ? { animationDelay: p.delay } : undefined}
              >
                <Icon icon={p.icon} width={20} height={20} className="text-slate-400" />
              </div>
            </div>

            {p.side === "right" && <div className="hidden md:block" />}

            <div
              className={`mt-8 md:mt-0 ${
                p.side === "left" ? "md:text-right md:pr-24" : "md:text-left md:pl-24"
              }`}
            >
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-skeuo border border-slate-100/80 transition-transform group-hover:-translate-y-2">
                <div className="text-xs font-normal tracking-[0.25em] text-slate-400 uppercase mb-4">
                  {p.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-normal text-slate-800 mb-4 tracking-tight">{p.title}</h3>
                <p className="text-slate-500 leading-relaxed text-base md:text-lg font-light">{p.description}</p>
              </div>
            </div>

            {p.side === "left" && <div className="hidden md:block" />}
          </div>
        ))}
      </div>
    </section>
  );
}
