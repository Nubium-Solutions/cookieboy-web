import { Icon } from "@iconify/react";

const pillars = [
  {
    icon: "solar:rocket-linear",
    title: "Ligero",
    description:
      "CookieBoy pesa solo 200 KB y no carga librerías externas. Tu web no se ralentiza, tu Lighthouse Score sube.",
  },
  {
    icon: "solar:shield-check-linear",
    title: "Legal",
    description:
      "Cumple con GDPR, LOPDGDD y ePrivacy. Auditado por consultores legales y probado por agencias.",
  },
  {
    icon: "solar:magic-stick-3-linear",
    title: "Automático",
    description:
      "Detección, clasificación, bloqueo y política de cookies sin tocar una línea de código. Todo se auto-actualiza.",
  },
];

export function Pillars() {
  return (
    <section className="max-w-[1400px] mx-auto py-32 px-6">
      <div className="text-center mb-20 md:mb-24">
        <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight mb-6 leading-tight">
          Por qué elegir CookieBoy
        </h2>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
          Tres razones por las que agencias y consultores LOPD ya están migrando
          desde Cookiebot y CookieYes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[600px]">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="glass-panel rounded-[2.5rem] p-10 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-700 shadow-sm hover:shadow-md"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/70 border border-slate-200/70 backdrop-blur-md flex items-center justify-center mb-8 text-slate-700 shadow-sm group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-200 transition-colors">
                <Icon icon={p.icon} width={24} height={24} />
              </div>
              <h3 className="text-3xl font-normal text-slate-900 mb-4 tracking-tight">{p.title}</h3>
              <p className="text-slate-500 leading-relaxed font-light">{p.description}</p>
            </div>
            <div className="mt-12 w-full aspect-[4/3] bg-white/50 border border-white/60 rounded-2xl shadow-inner group-hover:bg-white/70 transition-colors" />
          </div>
        ))}
      </div>
    </section>
  );
}
