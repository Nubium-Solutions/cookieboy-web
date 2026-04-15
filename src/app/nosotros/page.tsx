import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre nosotros — CookieBoy",
  description:
    "Conoce al equipo detrás de CookieBoy y nuestra misión: hacer que el cumplimiento del RGPD sea simple para cualquier WordPress.",
};

export default function NosotrosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-800">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900"
      >
        ← Volver a inicio
      </Link>

      <h1 className="mb-2 text-4xl font-semibold text-slate-900">
        Sobre nosotros
      </h1>
      <p className="mb-10 text-slate-600">
        Simplificar el cumplimiento del RGPD para que tú puedas centrarte en
        tu negocio.
      </p>

      <div className="space-y-10 text-[15px] leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            Quiénes somos
          </h2>
          <p className="mb-3 text-slate-700">
            CookieBoy es un producto de <strong>LUKE I AM YOUR FATHER SL</strong>
            , una empresa española dedicada a crear herramientas de
            cumplimiento normativo para sitios web. Desarrollamos software que
            entiende a los administradores de WordPress porque lo somos
            nosotros también.
          </p>
          <p className="text-slate-700">
            Nacimos con una idea clara: los plugins de cookies existentes son
            lentos, caros, confusos y muchos incumplen la propia normativa
            que dicen aplicar. Creemos que cumplir la ley debería ser fácil,
            rápido y barato.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            Nuestra misión
          </h2>
          <p className="text-slate-700">
            Que cualquier propietario de una web en WordPress pueda cumplir el
            RGPD, la LOPDGDD, la Directiva ePrivacy y la LSSI en menos de 5
            minutos, sin contratar un consultor, sin cargar la web con 300 KB
            de scripts de terceros y sin pagar suscripciones absurdas.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            Lo que nos diferencia
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-slate-700">
            <li>
              <strong>Diccionario propio de 2.400+ cookies</strong> mantenido
              y clasificado por nosotros, con actualizaciones automáticas.
            </li>
            <li>
              <strong>Plugin ligero</strong> (menos de 200 KB) sin dependencias
              externas ni trackers propios.
            </li>
            <li>
              <strong>Google Consent Mode v2</strong> integrado sin tocar
              código.
            </li>
            <li>
              <strong>7 idiomas</strong> disponibles de serie.
            </li>
            <li>
              <strong>Soporte técnico real</strong> atendido por quienes
              construimos el producto.
            </li>
            <li>
              <strong>Política de cookies autogenerada</strong> que se
              actualiza sola cuando detecta cambios en tu web.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            Datos de la empresa
          </h2>
          <ul className="space-y-1 text-slate-700">
            <li>
              <strong>Razón social:</strong> LUKE I AM YOUR FATHER SL
            </li>
            <li>
              <strong>NIF:</strong> B16425282
            </li>
            <li>
              <strong>Domicilio social:</strong> Calle Arabial, 45 — Centro
              Comercial Neptuno, local 32
            </li>
            <li>
              <strong>Email de contacto:</strong>{" "}
              <a
                href="mailto:soporte@cookieboy.es"
                className="text-amber-700 hover:underline"
              >
                soporte@cookieboy.es
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            ¿Hablamos?
          </h2>
          <p className="text-slate-700">
            ¿Tienes dudas, quieres colaborar o simplemente decirnos hola?
            Escríbenos a{" "}
            <a
              href="mailto:soporte@cookieboy.es"
              className="text-amber-700 hover:underline"
            >
              soporte@cookieboy.es
            </a>{" "}
            o visita nuestra{" "}
            <Link
              href="/soporte"
              className="text-amber-700 hover:underline"
            >
              página de soporte
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
