"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const navLinks = [
  { label: "Producto", href: "#producto" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Precios", href: "#precios" },
  { label: "Escáner", href: "/escaner" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-4 left-0 w-full z-50 px-4 sm:px-6 transition-all duration-300 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="relative backdrop-blur-xl bg-white/70 border border-white/40 shadow-sm rounded-full px-2 py-2 pl-6 flex items-center justify-between transition-all duration-500 hover:bg-white/80 hover:shadow-md">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <span className="text-lg" aria-hidden>🍪</span>
            <span className="font-medium text-slate-800 tracking-tight text-xs uppercase">
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
              href="/login"
              className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-xs font-medium text-white uppercase tracking-widest bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:-translate-y-0.5"
            >
              Acceder
            </a>
            <button
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-white/60 transition-colors focus:outline-none"
            >
              <Icon icon={open ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"} width={22} height={22} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden absolute left-4 right-4 mt-3 transition-opacity duration-200 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-5 py-4 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors uppercase tracking-wider"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 px-5 py-4 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-2xl transition-colors uppercase tracking-widest text-center"
              >
                Acceder
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
