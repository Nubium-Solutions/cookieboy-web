import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Soporte — CookieBoy",
  description:
    "Centro de soporte de CookieBoy. Contacta con nosotros, consulta la documentación o reporta una incidencia.",
};

export default function SoportePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-800">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900"
      >
        ← Volver a inicio
      </Link>

      <h1 className="mb-2 text-4xl font-semibold text-slate-900">Soporte</h1>
      <p className="mb-10 text-slate-600">
        ¿Tienes dudas o alguna incidencia con CookieBoy? Estamos aquí para
        ayudarte.
      </p>

      <div className="space-y-10 text-[15px] leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            Contacto directo
          </h2>
          <p className="mb-4 text-slate-700">
            Envíanos un email y te responderemos en menos de 24 horas
            laborables (lunes a viernes).
          </p>
          <a
            href="mailto:soporte@cookieboy.es"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white shadow-sm hover:bg-amber-600"
          >
            soporte@cookieboy.es
          </a>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            Qué incluir en tu mensaje
          </h2>
          <p className="mb-3 text-slate-700">
            Para ayudarte más rápido, por favor incluye:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-slate-700">
            <li>Tu clave de licencia (empieza por <code>CB-</code>).</li>
            <li>El dominio WordPress donde está instalado el plugin.</li>
            <li>Versión del plugin y de WordPress.</li>
            <li>Descripción clara del problema o consulta.</li>
            <li>Capturas de pantalla si procede.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            Área de cliente
          </h2>
          <p className="text-slate-700">
            Desde tu{" "}
            <a
              href="https://licencias.nubiumsolutions.com/cliente/login"
              className="text-amber-700 hover:underline"
            >
              área de cliente
            </a>{" "}
            puedes gestionar tus licencias, descargar el plugin, ver tus
            facturas y administrar tu suscripción.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            Horario de atención
          </h2>
          <p className="text-slate-700">
            Lunes a viernes, de 9:00 a 18:00 (hora peninsular española).
            Fuera de ese horario también puedes escribirnos y te
            responderemos lo antes posible.
          </p>
        </section>
      </div>
    </main>
  );
}
