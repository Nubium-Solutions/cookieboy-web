import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCustomer, logout } from "@/lib/auth";

async function logoutAction() {
  "use server";
  await logout();
  redirect("/");
}

type License = {
  license_key: string;
  domain: string;
  tier: number;
  plan: string;
  status: string;
  license_status: string;
  expires_at: string | null;
};

export default async function DashboardPage() {
  const data = await getCurrentCustomer();
  if (!data) redirect("/login");
  const { customer, licenses } = data as { customer: { email: string; full_name: string }; licenses: License[] };

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>🍪</span>
            <span className="text-lg font-medium text-slate-900 tracking-tight uppercase">CookieBoy</span>
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Cerrar sesión
            </button>
          </form>
        </header>

        <h1 className="text-4xl font-medium text-slate-900 tracking-tight mb-2">
          Hola, {customer.full_name || customer.email}
        </h1>
        <p className="text-slate-500 font-light mb-12">Estas son tus licencias activas.</p>

        {licenses.length === 0 ? (
          <div className="glass-panel p-10 rounded-[2rem] border border-white/60 text-center">
            <p className="text-slate-600 mb-6">Aún no tienes ninguna licencia.</p>
            <Link href="/#precios" className="inline-flex items-center px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
              Ver planes
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {licenses.map((l) => (
              <div key={l.license_key} className="glass-panel p-6 rounded-2xl border border-white/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{l.plan || `Tier ${l.tier}`}</div>
                  <div className="font-medium text-slate-900">{l.domain}</div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">{l.license_key}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium uppercase tracking-wider ${l.license_status === "active" ? "text-emerald-600" : "text-red-600"}`}>
                    {l.license_status}
                  </div>
                  {l.expires_at && <div className="text-xs text-slate-400 mt-1">Vence: {new Date(l.expires_at).toLocaleDateString("es-ES")}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
