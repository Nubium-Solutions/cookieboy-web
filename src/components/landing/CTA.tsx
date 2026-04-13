export function CTA() {
  return (
    <section className="flex flex-col text-center min-h-[60vh] px-6 relative items-center justify-center py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none" />
      <div className="w-64 h-64 rounded-full bg-amber-400/20 blur-[100px] absolute" />
      <h2 className="text-5xl md:text-7xl font-medium text-slate-900 tracking-tighter mb-6 relative z-10">
        Deja de arriesgarte.
        <br />
        Empieza a cumplir.
      </h2>
      <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto mb-10 relative z-10 font-light">
        Instala CookieBoy en tu WordPress y cumple con GDPR desde el primer minuto.
        14 días de prueba gratis, sin tarjeta.
      </p>
      <div className="relative z-10">
        <a
          href="/registro"
          className="cta-btn text-lg py-4 px-10 shadow-lg font-medium text-slate-900 bg-white/70 border border-white/90 rounded-full backdrop-blur-md transition-all hover:-translate-y-1 overflow-hidden relative inline-flex items-center justify-center"
        >
          Probar gratis
        </a>
      </div>
    </section>
  );
}
