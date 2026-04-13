const phrases = [
  "DETECCIÓN AUTOMÁTICA",
  "GDPR · LOPDGDD · ePRIVACY",
  "CONSENT MODE V2",
  "7 IDIOMAS",
  "200 KB",
  "SIN TRACKERS PROPIOS",
];

export function BigMarquee() {
  return (
    <section className="py-24 border-y border-white/30 bg-white/5 backdrop-blur-sm overflow-hidden">
      <div
        className="animate-marquee-fast flex w-max"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 30%, black 60%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 30%, black 60%, transparent)",
        }}
      >
        {[0, 1].map((group) => (
          <div
            key={group}
            className="flex items-center gap-24 pr-24 text-[8rem] font-semibold text-slate-900 opacity-5 whitespace-nowrap"
          >
            {phrases.map((p) => (
              <span key={`${group}-${p}`}>{p}</span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
