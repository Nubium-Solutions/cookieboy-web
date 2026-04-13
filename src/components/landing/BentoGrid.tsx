import { Icon } from "@iconify/react";

export function BentoGrid() {
  return (
    <section id="caracteristicas" className="max-w-[1400px] mx-auto py-20 px-4 sm:px-6">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-slate-900 tracking-tight mb-4">
          Todo lo que necesitas para cumplir
        </h2>
        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-light">
          Detección automática, diccionario global en la nube, Consent Mode v2 y 7
          idiomas. Sin plugins extra, sin mantenimiento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 md:gap-8 md:min-h-[800px]">
        {/* Card 1 — Diccionario 2.400+ cookies */}
        <div className="glass-panel md:col-span-2 flex flex-col rounded-[2rem] p-6 sm:p-8 md:p-10 justify-between group">
          <div>
            <div className="flex bg-slate-100 w-12 h-12 border-slate-200 border rounded-full shadow-inner items-center justify-center mb-6">
              <Icon icon="solar:book-2-linear" width={24} height={24} className="text-slate-700" />
            </div>
            <h3 className="text-2xl font-normal text-slate-900 mb-3 tracking-tight">
              Diccionario de +2.400 cookies
            </h3>
            <p className="text-slate-500 text-base font-light">
              CookieBoy identifica y clasifica automáticamente cookies de Google,
              Meta, TikTok, LinkedIn, Hotjar, Shopify, WooCommerce y cientos más.
              El diccionario vive en la nube y se actualiza diariamente.
            </p>
          </div>
          <div className="mt-10 flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white/60 border border-white/80 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[160px]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />
              <div className="flex justify-between items-center w-full mb-4 relative z-10">
                <div className="text-xs font-normal text-slate-500 tracking-wider uppercase">Detección</div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-full pt-4 relative z-10">
                <div className="bg-amber-400/10 w-full h-[30%] rounded-t-sm" />
                <div className="w-full bg-amber-400/20 rounded-t-sm h-[50%]" />
                <div className="w-full bg-amber-400/30 rounded-t-sm h-[80%]" />
                <div className="w-full bg-amber-500/60 rounded-t-sm h-[100%] relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-600 shadow-sm" />
                </div>
                <div className="w-full bg-amber-400/20 rounded-t-sm h-[60%]" />
                <div className="w-full bg-amber-400/10 rounded-t-sm h-[40%]" />
                <div className="w-full bg-amber-400/10 rounded-t-sm h-[45%]" />
                <div className="w-full bg-amber-400/5 rounded-t-sm h-[20%]" />
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-white/60 border border-white/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="text-xs font-normal text-slate-500 tracking-wider uppercase mb-1">Cookies clasificadas</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-700">
                  <Icon icon="solar:check-circle-linear" width={16} height={16} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-1.5 w-full bg-emerald-300 rounded-full" />
                  <div className="h-1.5 w-2/3 bg-slate-200 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                  <Icon icon="solar:info-circle-linear" width={16} height={16} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-1.5 w-5/6 bg-slate-300 rounded-full" />
                  <div className="h-1.5 w-1/2 bg-slate-200 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 — 7 idiomas */}
        <div className="glass-panel flex flex-col rounded-[2rem] p-6 sm:p-8 md:p-10 justify-between group">
          <div>
            <div className="flex bg-slate-100 w-12 h-12 border-slate-200 border rounded-full shadow-inner items-center justify-center mb-6">
              <Icon icon="solar:global-linear" width={24} height={24} className="text-slate-700" />
            </div>
            <h3 className="text-2xl font-normal text-slate-900 mb-3 tracking-tight">
              7 idiomas integrados
            </h3>
            <p className="text-slate-500 font-light text-base">
              Español, inglés, francés, alemán, portugués, italiano y catalán.
            </p>
          </div>
          <div className="mt-10 flex gap-2 items-center justify-center">
            {["🇪🇸", "🇬🇧", "🇫🇷", "🇩🇪", "🇵🇹", "🇮🇹"].map((flag, i) => (
              <div
                key={i}
                className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xl sm:text-2xl hover:-translate-y-1 hover:shadow-md transition-all"
              >
                {flag}
              </div>
            ))}
          </div>
        </div>

        {/* Card 3 — Consent Mode v2 */}
        <div className="glass-panel flex flex-col rounded-[2rem] p-6 sm:p-8 md:p-10 justify-between group">
          <div>
            <div className="flex bg-slate-100 w-12 h-12 border-slate-200 border rounded-full shadow-inner items-center justify-center mb-6">
              <Icon icon="solar:bolt-linear" width={24} height={24} className="text-slate-700" />
            </div>
            <h3 className="text-2xl font-normal text-slate-900 mb-3 tracking-tight">
              Google Consent Mode v2
            </h3>
            <p className="text-slate-500 font-light text-base">
              Compatible con Google Ads y Analytics desde el primer clic.
            </p>
          </div>
          <div className="mt-10 space-y-3">
            <div className="flex items-center justify-between bg-white/70 border border-white p-4 rounded-xl shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Icon icon="solar:check-circle-bold" width={16} height={16} className="text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-slate-700">Analytics Storage</span>
              </div>
              <div className="w-11 h-6 bg-emerald-500 rounded-full relative shadow-inner">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow border border-slate-200" />
              </div>
            </div>
            <div className="flex items-center justify-between bg-white/40 border border-white/60 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                  <Icon icon="solar:close-circle-linear" width={16} height={16} />
                </div>
                <span className="text-xs font-medium text-slate-500">Ad Storage</span>
              </div>
              <div className="w-11 h-6 bg-slate-200 rounded-full relative shadow-inner border border-slate-300">
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm border border-slate-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 — Auto-actualizaciones */}
        <div className="glass-panel md:col-span-2 flex flex-col rounded-[2rem] p-6 sm:p-8 md:p-10 justify-between group">
          <div>
            <div className="flex bg-slate-100 w-12 h-12 border-slate-200 border rounded-full shadow-inner items-center justify-center mb-6">
              <Icon icon="solar:refresh-circle-linear" width={24} height={24} className="text-slate-700" />
            </div>
            <h3 className="text-2xl font-normal text-slate-900 mb-2 tracking-tight">
              Auto-actualizaciones en la nube
            </h3>
            <p className="text-slate-500 font-light text-base max-w-lg">
              El diccionario global se sincroniza con tu web diariamente. Cada vez
              que añadimos una cookie nueva, tu plugin la reconoce automáticamente
              en menos de 24 horas. Sin updates manuales.
            </p>
          </div>
          <div className="mt-10 flex flex-col md:flex-row gap-5">
            <div className="flex-[2] bg-white/60 border border-white/80 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-sm min-h-[160px]">
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 15,30 L 40,60 L 65,35 L 85,75" stroke="#f59e0b" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                <path d="M 40,60 L 55,85" stroke="#f59e0b" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
              </svg>
              <div className="absolute top-[30%] left-[15%] w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm border border-white" />
              <div className="absolute top-[60%] left-[40%] w-5 h-5 rounded-full bg-white border-2 border-amber-200 shadow-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                <div className="w-2 h-2 bg-amber-500 rounded-full absolute" />
              </div>
              <div className="absolute top-[35%] left-[65%] w-3 h-3 rounded-full bg-amber-300 shadow-sm border border-white" />
              <div className="absolute top-[75%] left-[85%] w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm border border-white" />
              <div className="absolute top-[85%] left-[55%] w-2.5 h-2.5 rounded-full bg-amber-300" />
            </div>
            <div className="flex-[1] flex flex-col gap-4">
              <div className="bg-white/60 border border-white/80 rounded-xl p-5 flex-1 flex flex-col justify-center shadow-sm">
                <div className="text-xs font-normal text-slate-500 tracking-wider uppercase mb-1">Cookies en BD</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-normal text-slate-800 tracking-tight">2.400</span>
                  <span className="text-sm font-normal text-slate-500">+</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[92%] rounded-full" />
                </div>
              </div>
              <div className="bg-white/60 border border-white/80 rounded-xl p-5 flex-1 flex flex-col justify-center shadow-sm">
                <div className="text-xs font-normal text-slate-500 tracking-wider uppercase mb-1">Sync diario</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-normal text-slate-800 tracking-tight">&lt;24h</span>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <div className="h-2 flex-1 bg-emerald-400/60 rounded-full" />
                  <div className="h-2 flex-1 bg-emerald-400/40 rounded-full" />
                  <div className="h-2 flex-1 bg-emerald-400/20 rounded-full" />
                  <div className="h-2 flex-[0.5] bg-slate-200 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
