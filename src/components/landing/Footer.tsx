import Link from "next/link";
import { Icon } from "@iconify/react";

const columns = [
  {
    title: "Producto",
    links: [
      { label: "Características", href: "/#caracteristicas" },
      { label: "Precios", href: "/#precios" },
      { label: "Escáner", href: "/escaner" },
      { label: "Diccionario", href: "/diccionario" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Documentación", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
      { label: "Estado", href: "/status" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nosotros", href: "/sobre" },
      { label: "Contacto", href: "/contacto" },
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 pt-16 md:pt-20 pb-10 relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20">
          <div className="col-span-2 md:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-2xl" aria-hidden>🍪</span>
              <span className="text-lg font-medium text-slate-900 tracking-tight uppercase">CookieBoy</span>
            </Link>
            <p className="mt-6 text-slate-500 leading-relaxed max-w-sm text-sm font-light">
              Plugin de cumplimiento GDPR para WordPress. Banner de cookies,
              detección automática, política autogenerada y Google Consent Mode
              v2.
            </p>
            <p className="mt-4 text-slate-400 text-xs font-light">
              Un producto de Nubium Solutions.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="font-medium text-slate-900 mb-6 tracking-tight">{col.title}</h3>
              <ul className="space-y-4 text-sm text-slate-500">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:text-amber-600 transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 font-light">
            © {new Date().getFullYear()} CookieBoy · Nubium Solutions. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 items-center">
            <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-amber-600 transition-colors">
              <Icon icon="solar:chat-round-linear" width={20} height={20} />
            </a>
            <a href="#" aria-label="GitHub" className="text-slate-400 hover:text-amber-600 transition-colors">
              <Icon icon="solar:code-circle-linear" width={20} height={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-amber-600 transition-colors">
              <Icon icon="solar:link-circle-linear" width={20} height={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
