import { Icon } from "@iconify/react";

const CHECKOUT_BASE = "https://licencias.nubiumsolutions.com/api/stripe/checkout";

type Plan = {
  slug: string;
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
    slug: "bronce",
    name: "Bronce",
    price: "30€",
    period: "/año",
    description: "Para webs pequeñas que empiezan a cumplir.",
    features: ["200 URLs rastreadas", "1 dominio", "Detección automática", "Banner básico", "Soporte por email"],
    cta: "Empezar",
  },
  {
    slug: "plata",
    name: "Plata",
    price: "50€",
    period: "/año",
    description: "Para profesionales y pymes con más tráfico.",
    features: [
      "1.200 URLs rastreadas",
      "1 dominio",
      "Banner personalizable",
      "Política autogenerada",
      "Google Consent Mode v2",
      "Soporte prioritario",
    ],
    highlighted: true,
    cta: "Empezar",
  },
  {
    slug: "oro",
    name: "Oro",
    price: "110€",
    period: "/año",
    description: "Para agencias que gestionan webs de clientes.",
    features: [
      "2.400 URLs rastreadas",
      "3 dominios",
      "Auto-bloqueo de scripts",
      "Diccionario ampliado",
      "Multi-idioma",
      "Soporte 24h",
    ],
    cta: "Empezar",
  },
  {
    slug: "platino",
    name: "Platino",
    price: "230€",
    period: "/año",
    description: "Para consultores LOPD y grandes organizaciones.",
    features: [
      "URLs ilimitadas",
      "10 dominios",
      "Onboarding personalizado",
      "Soporte 24/7",
      "SLA 99.9%",
      "Account manager",
    ],
    cta: "Empezar",
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
                <div className="text-xs font-medium tracking-wider uppercase text-amber-700 mb-2 relative z-10">
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
            <a
              href={`${CHECKOUT_BASE}?plan=${plan.slug}&cycle=yearly`}
              className={`w-full py-3 rounded-xl font-medium transition-colors relative z-10 text-center ${
                plan.highlighted
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                  : "border border-slate-300 text-slate-700 hover:bg-white/50"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-slate-500 mt-8 font-light">
        Todos los planes incluyen auto-actualizaciones, diccionario en la nube y soporte GDPR/LOPDGDD.
      </p>
    </section>
  );
}
