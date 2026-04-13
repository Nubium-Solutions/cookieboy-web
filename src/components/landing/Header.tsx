import Link from "next/link";
import { Icon } from "@iconify/react";

const navLinks = [
  { label: "Producto", href: "#producto" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Precios", href: "#precios" },
  { label: "Escáner", href: "/escaner" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  return (
    <header className="fixed top-4 left-0 w-full z-50 px-4 sm:px-6 transition-all duration-300 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="relative backdrop-blur-xl bg-white/70 border border-white/40 shadow-sm rounded-full px-2 py-2 pl-6 flex items-center justify-between transition-all duration-500 hover:bg-white/80 hover:shadow-md">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg" aria-hidden>🍪</span>
            <span className="font-medium text-slate-800 tracking-tight text-xs uppercase hidden sm:block">
              CookieBoy
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-xs font-normal text-slate-500 hover:text-slate-900 uppercase tracking-wider rounded-full hover:bg-white/60 transition-all"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/app"
              className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-xs font-medium text-white uppercase tracking-widest bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:-translate-y-0.5"
            >
              Acceder
            </a>
            <button
              type="button"
              aria-label="Abrir menú"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-white/60 transition-colors focus:outline-none"
            >
              <Icon icon="solar:hamburger-menu-linear" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
