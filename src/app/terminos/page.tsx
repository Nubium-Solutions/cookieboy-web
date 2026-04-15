import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones — CookieBoy",
  description:
    "Términos y condiciones de uso del servicio CookieBoy.",
};

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-800">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900"
      >
        ← Volver a inicio
      </Link>

      <h1 className="mb-2 text-4xl font-semibold text-slate-900">
        Términos y Condiciones
      </h1>
      <p className="mb-10 text-sm text-slate-500">
        Última actualización: 15 de abril de 2026
      </p>

      <div className="space-y-8 text-[15px] leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            1. Identificación del prestador
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
              <strong>Email:</strong>{" "}
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
            2. Objeto
          </h2>
          <p className="text-slate-700">
            Los presentes términos regulan el acceso y uso del servicio
            CookieBoy, consistente en un plugin para WordPress que facilita el
            cumplimiento del RGPD, LOPDGDD, la Directiva ePrivacy y la LSSI,
            mediante un banner de consentimiento, detección automática de
            cookies, política de cookies generada automáticamente e
            integración con Google Consent Mode v2.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            3. Aceptación
          </h2>
          <p className="text-slate-700">
            La contratación del servicio implica la aceptación plena de estos
            términos. Si no estás de acuerdo con alguno de los puntos, no
            debes utilizar el servicio.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            4. Suscripciones y precios
          </h2>
          <p className="mb-3 text-slate-700">
            CookieBoy ofrece distintos planes de suscripción (Bronce, Plata,
            Oro, Platino) con facturación anual. Los precios vigentes aparecen
            publicados en cookieboy.es y pueden modificarse en el futuro; los
            cambios no afectarán al periodo contratado en curso.
          </p>
          <p className="text-slate-700">
            El periodo contratado comienza en el momento en que activas la
            licencia en tu sitio WordPress por primera vez, no en el momento
            del pago.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            5. Cancelación y reembolsos
          </h2>
          <p className="mb-3 text-slate-700">
            Puedes cancelar tu suscripción en cualquier momento desde tu área
            de cliente. La cancelación tendrá efecto al final del periodo de
            facturación en curso, y mantendrás acceso al servicio hasta esa
            fecha.
          </p>
          <p className="text-slate-700">
            De conformidad con el art. 103.m del Real Decreto Legislativo
            1/2007, el derecho de desistimiento no resulta aplicable a los
            contenidos digitales suministrados de forma inmediata con el
            consentimiento previo del consumidor. Las licencias son
            consideradas contenido digital y el periodo de prueba/desistimiento
            no aplica una vez activada la licencia.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            6. Obligaciones del usuario
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-slate-700">
            <li>
              Proporcionar información veraz y actualizada al contratar.
            </li>
            <li>
              Utilizar la licencia únicamente en el dominio declarado.
              Cada licencia es válida para un único dominio.
            </li>
            <li>
              Mantener la confidencialidad de tu clave de licencia. No
              compartirla con terceros.
            </li>
            <li>
              No realizar ingeniería inversa, descompilación ni redistribución
              del plugin fuera de los términos de su licencia.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            7. Propiedad intelectual
          </h2>
          <p className="text-slate-700">
            CookieBoy, el código del plugin, la web, la marca y todos los
            elementos que los componen son propiedad de LUKE I AM YOUR FATHER
            SL o de sus licenciantes. La suscripción otorga un derecho de uso
            no exclusivo, intransferible y limitado al dominio contratado,
            pero no transmite titularidad alguna.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            8. Limitación de responsabilidad
          </h2>
          <p className="text-slate-700">
            CookieBoy se presta tal cual y nos esforzamos por mantener su
            disponibilidad y correcto funcionamiento. No garantizamos que el
            servicio sea ininterrumpido o libre de errores. No somos
            responsables de daños indirectos, pérdidas de datos, lucro
            cesante ni de decisiones tomadas por el usuario basadas en la
            configuración del plugin. El cumplimiento normativo final es
            responsabilidad del titular del sitio web.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            9. Protección de datos
          </h2>
          <p className="text-slate-700">
            El tratamiento de datos personales se regula en nuestra{" "}
            <Link
              href="/privacidad"
              className="text-amber-700 hover:underline"
            >
              Política de Privacidad
            </Link>
            , que forma parte inseparable de estos términos.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            10. Modificaciones
          </h2>
          <p className="text-slate-700">
            Podemos modificar estos términos para adaptarlos a cambios legales
            o del servicio. Las modificaciones se notificarán por email con al
            menos 15 días de antelación. Si no estás de acuerdo con los
            cambios, puedes cancelar tu suscripción antes de que entren en
            vigor.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            11. Legislación aplicable y jurisdicción
          </h2>
          <p className="text-slate-700">
            Estos términos se rigen por la legislación española. Para la
            resolución de cualquier controversia, las partes se someten a los
            juzgados y tribunales del domicilio del consumidor cuando sea
            aplicable, o a los del domicilio social de LUKE I AM YOUR FATHER
            SL en caso contrario.
          </p>
        </section>
      </div>
    </main>
  );
}
