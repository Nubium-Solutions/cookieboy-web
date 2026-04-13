import { Icon } from "@iconify/react";

const brands = [
  { name: "Chihuahuas Elegantes", icon: "solar:heart-linear" },
  { name: "Encuentra Parking", icon: "solar:map-point-linear" },
  { name: "Nubium Solutions", icon: "solar:cloud-linear" },
  { name: "Agencia Pixel", icon: "solar:palette-linear" },
  { name: "LegalTech ES", icon: "solar:scale-linear" },
  { name: "WebForge", icon: "solar:hammer-linear" },
];

export function TrustedBy() {
  return (
    <section className="flex flex-col w-full max-w-[1400px] border-slate-200/30 border-t mx-auto py-20 items-center overflow-hidden">
      <p className="text-sm text-slate-500 font-medium tracking-wide uppercase mb-12 px-6 text-center">
        Webs que ya cumplen con CookieBoy
      </p>
      <div
        className="w-full relative flex items-center overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
          {[...brands, ...brands].map((b, i) => (
            <div
              key={`${b.name}-${i}`}
              className="flex items-center gap-3 text-slate-400 opacity-60 hover:opacity-100 hover:text-slate-800 transition-all cursor-pointer mr-16 md:mr-24"
            >
              <Icon icon={b.icon} width={36} height={36} />
              <span className="text-2xl font-medium tracking-tight whitespace-nowrap">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
