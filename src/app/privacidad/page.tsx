import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad — CookieBoy",
  description:
    "Política de privacidad de CookieBoy. Información sobre el tratamiento de datos personales conforme al RGPD y la LOPDGDD.",
};

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-800">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900"
      >
        ← Volver a inicio
      </Link>

      <h1 className="mb-2 text-4xl font-semibold text-slate-900">
        Política de Privacidad
      </h1>
      <p className="mb-10 text-sm text-slate-500">
        Última actualización: 15 de abril de 2026
      </p>

      <div className="space-y-8 text-[15px] leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            1. Responsable del tratamiento
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
            <li>
              <strong>Sitio web:</strong>{" "}
              <a
                href="https://cookieboy.es"
                className="text-amber-700 hover:underline"
              >
                cookieboy.es
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            2. Datos que tratamos
          </h2>
          <p className="mb-3 text-slate-700">
            Tratamos los siguientes datos personales cuando usas CookieBoy:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-slate-700">
            <li>
              <strong>Datos de registro y facturación:</strong> nombre,
              apellidos, email, empresa, país, NIF y dirección (cuando
              contratas una suscripción).
            </li>
            <li>
              <strong>Datos técnicos:</strong> dirección IP, dominio web donde
              activas la licencia, versión del plugin, información del
              navegador (solo cuando interactúas con nuestros servidores de
              licencias).
            </li>
            <li>
              <strong>Datos de pago:</strong> procesados íntegramente por
              Stripe Payments Europe Ltd. Nosotros nunca almacenamos datos de
              tarjeta.
            </li>
            <li>
              <strong>Datos de soporte:</strong> mensajes y adjuntos que nos
              envíes al contactar con soporte.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            3. Finalidad y base legal
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-slate-700">
            <li>
              <strong>Ejecución del contrato</strong> (art. 6.1.b RGPD):
              gestionar tu suscripción, emitir facturas, entregarte el plugin
              y prestarte soporte.
            </li>
            <li>
              <strong>Cumplimiento legal</strong> (art. 6.1.c RGPD):
              conservación de facturas por el plazo exigido por la normativa
              fiscal y mercantil.
            </li>
            <li>
              <strong>Interés legítimo</strong> (art. 6.1.f RGPD): prevención
              de fraude y abuso, mejora del servicio y seguridad de nuestros
              sistemas.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            4. Plazos de conservación
          </h2>
          <p className="text-slate-700">
            Conservamos tus datos mientras mantengas una suscripción activa
            con nosotros. Tras la baja: las facturas durante el plazo legal
            aplicable (hasta 6 años según la normativa fiscal española); los
            datos de soporte durante 12 meses; el resto se elimina o anonimiza
            en un plazo máximo de 30 días salvo obligación legal en contra.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            5. Encargados del tratamiento
          </h2>
          <p className="mb-3 text-slate-700">
            Para prestar el servicio compartimos datos con los siguientes
            encargados del tratamiento, todos ellos con garantías adecuadas:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-slate-700">
            <li>
              <strong>Stripe Payments Europe Ltd.</strong> (Irlanda) —
              procesador de pagos.
            </li>
            <li>
              <strong>Hetzner Online GmbH</strong> (Alemania) — alojamiento de
              servidores.
            </li>
            <li>
              <strong>Comytel / cPanel</strong> (España) — servidor de correo
              transaccional.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            6. Tus derechos
          </h2>
          <p className="mb-3 text-slate-700">
            Puedes ejercer los siguientes derechos escribiendo a{" "}
            <a
              href="mailto:soporte@cookieboy.es"
              className="text-amber-700 hover:underline"
            >
              soporte@cookieboy.es
            </a>
            :
          </p>
          <ul className="list-disc space-y-1 pl-6 text-slate-700">
            <li>Acceso a tus datos personales.</li>
            <li>Rectificación de datos inexactos.</li>
            <li>Supresión (derecho al olvido).</li>
            <li>Limitación u oposición al tratamiento.</li>
            <li>Portabilidad de los datos.</li>
            <li>Revocación del consentimiento cuando aplique.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Si consideras que no hemos atendido correctamente tu solicitud,
            tienes derecho a presentar una reclamación ante la Agencia
            Española de Protección de Datos (
            <a
              href="https://www.aepd.es"
              className="text-amber-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.aepd.es
            </a>
            ).
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            7. Transferencias internacionales
          </h2>
          <p className="text-slate-700">
            Todos nuestros proveedores principales están ubicados en la Unión
            Europea. Stripe puede realizar transferencias a EE. UU. bajo el
            marco del EU-US Data Privacy Framework y cláusulas contractuales
            tipo aprobadas por la Comisión Europea.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900">
            8. Cambios en esta política
          </h2>
          <p className="text-slate-700">
            Podemos actualizar esta política para reflejar cambios legales o
            en el servicio. Te notificaremos por email cualquier cambio
            sustancial con al menos 15 días de antelación.
          </p>
        </section>
      </div>
    </main>
  );
}
