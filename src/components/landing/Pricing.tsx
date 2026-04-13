import { Icon } from "@iconify/react";

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

const plans: Plan[] = [
  {
    name: "Bronce",
    price: "9€",
    period: "/mes",
    description: "Para webs pequeñas que empiezan a cumplir.",
    features: ["1 dominio", "Hasta 100 URLs", "Banner básico", "7 idiomas", "Soporte por email"],
    cta: "Empezar",
  },
  {
    name: "Plata",
    price: "19€",
    period: "/mes",
    description: "Para profesionales y pymes con más tráfico.",
    features: [
      "3 dominios",
      "Hasta 500 URLs",
      "Banner personalizable",
      "Google Consent Mode v2",
      "Analítica de consentimientos",
      "Soporte prioritario",
    ],
    highlighted: true,
    cta: "Empezar 14 días gratis",
  },
  {
    name: "Oro",
    price: "39€",
    period: "/mes",
    description: "Para agencias que gestionan webs de clientes.",
    features: [
      "10 dominios",
      "URLs ilimitadas",
      "Banner white-label",
      "Informes PDF de cumplimiento",
      "Consultoría de instalación",
      "Soporte 24h",
    ],
    cta: "Empezar",
  },
  {
    name: "Platino",
    price: "99€",
    period: "/mes",
    description: "Para consultores LOPD y grandes organizaciones.",
    features: [
      "Dominios ilimitados",
      "URLs ilimitadas",
      "API privada",
      "Diccionario privado",
      "SLA 99.9%",
      "Account manager dedicado",
    ],
    cta: "Hablar con ventas",
  },
];

export function Pricing() {
  return (
    <section id="precios" className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-24 md:pb-32">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight mb-4">Precios transparentes</h2>
        <p className="text-base md:text-lg text-slate-500 font-light">
          Sin trucos, sin letra pequeña. Cambia de plan cuando quieras.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-panel p-8 rounded-[2rem] flex flex-col border ${
              plan.highlighted
                ? "border-amber-300 shadow-xl relative overflow-hidden bg-white/80"
                : "border-white/60"
            }`}
          >
            {plan.highlighted && (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-[40px]" />
                <div className="text-xs font-medium tracking-wider uppercase text-amber-600 mb-2 relative z-10">
                  Más popular
                </div>
              </>
            )}
            <h3 className="text-xl font-medium text-slate-900 mb-2 relative z-10">{plan.name}</h3>
            <div className="mb-6 relative z-10">
              <span className="text-4xl font-medium text-slate-900 tracking-tight">{plan.price}</span>
              <span className="text-slate-500">{plan.period}</span>
            </div>
            <p className="text-sm text-slate-500 mb-8 font-light relative z-10">{plan.description}</p>
            <ul className="space-y-3 mb-8 flex-1 relative z-10">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                  <Icon icon="solar:check-circle-linear" className="text-amber-500" width={18} height={18} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`w-full py-3 rounded-xl font-medium transition-colors relative z-10 ${
                plan.highlighted
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                  : "border border-slate-300 text-slate-700 hover:bg-white/50"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-slate-400 mt-8 font-light">
        Todos los planes incluyen auto-actualizaciones, diccionario en la nube y soporte GDPR/LOPDGDD.
      </p>
    </section>
  );
}
