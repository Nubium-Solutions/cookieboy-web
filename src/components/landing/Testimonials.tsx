import { Icon } from "@iconify/react";

const testimonials = [
  {
    quote:
      "Instalamos CookieBoy en 30 minutos y dejamos de preocuparnos por la LOPD. El diccionario en la nube detecta cookies nuevas sin tocar nada.",
    author: "Álvaro Ruiz",
    role: "Director, Agencia Pixel",
    initials: "AR",
    badge: "5.0",
  },
  {
    quote:
      "Es el único plugin GDPR que recomiendo. Auto-actualizaciones del diccionario, banner en 7 idiomas, y sin bloquear scripts por error. Mis clientes están tranquilos.",
    author: "Chema López",
    role: "Consultor LOPD independiente",
    initials: "CL",
    badge: "Recomendado",
  },
  {
    quote:
      "Sustituimos Cookiebot por CookieBoy en 14 webs de clientes. Lighthouse pasó de 76 a 94 de media. Ligero, limpio, profesional.",
    author: "Juanfran Mora",
    role: "SEO técnico, WebForge",
    initials: "JM",
    badge: "Impacto SEO",
  },
];

export function Testimonials() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-32">
      <div className="text-center mb-16">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-slate-200 bg-white/70 text-xs tracking-[0.2em] uppercase text-slate-500 mb-5">
          Testimonios
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight mb-4">
          Quienes ya cumplen con CookieBoy
        </h2>
        <p className="max-w-2xl mx-auto text-slate-500 text-base md:text-lg leading-relaxed font-light">
          Agencias, consultores y desarrolladores confían en CookieBoy para cumplir
          con GDPR sin esfuerzo.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between min-h-[320px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-7">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} icon="solar:star-bold" width={18} height={18} />
                  ))}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{t.badge}</div>
              </div>
              <p className="text-slate-700 text-base leading-8 font-light mb-10">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <div className="flex items-center gap-4 pt-6 border-t border-slate-200/70">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-white font-medium text-lg shadow-sm border border-white">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{t.author}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
