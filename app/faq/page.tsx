import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes — Artentino',
  description: 'Envíos, formas de pago, registro, regalos corporativos y política de cambios.',
}

const sections = [
  { id: 'envio', label: 'Envíos' },
  { id: 'pago', label: 'Formas de pago' },
  { id: 'registro', label: 'Registro y compra' },
  { id: 'regalos', label: 'Regalos corporativos' },
  { id: 'cambios', label: 'Cambios y devoluciones' },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="h-1 w-8 rounded-full"
          style={{ backgroundColor: '#0eb1c3' }}
        />
        <h2 className="text-xl font-black text-[#1E1E1E] sm:text-2xl">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="mb-2 font-black text-[#1E1E1E]">{q}</p>
      <div className="text-sm leading-relaxed text-gray-600">{children}</div>
    </div>
  )
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="text-sm leading-relaxed text-gray-600">{children}</div>
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: '#0eb1c3' }}>
            Centro de ayuda
          </p>
          <h1 className="text-3xl font-black text-[#1E1E1E] sm:text-4xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-3 text-gray-500">
            Todo lo que necesitás saber sobre envíos, pagos, cambios y más.
          </p>

          {/* Anchor nav */}
          <div className="mt-6 flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-bold text-gray-600 transition-all hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">

        {/* ── ENVÍOS ── */}
        <Section id="envio" title="Envíos y entregas">
          <QA q="¿Cuál es el costo de envío?">
            Se ve al finalizar la compra y depende del código postal ingresado.
          </QA>

          <QA q="¿Puedo retirar mi pedido por el showroom?">
            <p>
              Sí, sin costo. Te enviamos un email cuando tu pedido está listo. Podés autorizar a un
              tercero informando nombre, apellido y DNI a{' '}
              <a href="mailto:info@artentino.com" className="font-semibold" style={{ color: '#0eb1c3' }}>
                info@artentino.com
              </a>
              .
            </p>
            <p className="mt-2">
              <strong>Dirección:</strong>{' '}
              <a
                href="https://maps.app.goo.gl/vYdUfZ1vPTeStfdWA"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold"
                style={{ color: '#0eb1c3' }}
              >
                Cramer 886, CABA (CP 1426)
              </a>
              , frente a la Estación Colegiales (Tren Mitre), a metros de Av. Federico Lacroze y
              cerca de Av. Cabildo (Subte D, Estación Olleros). Estacionamiento gratuito para clientes.
            </p>
            <p className="mt-2">
              <strong>Atención:</strong> Lunes a Viernes de 8:30 a 17:30 y Sábados de 10 a 15.
              También podés sacar turno (presencial o virtual por WhatsApp) desde el{' '}
              <Link href="/turnos" className="font-semibold" style={{ color: '#0eb1c3' }}>
                Home
              </Link>
              .
            </p>
          </QA>

          <QA q="¿Cuándo voy a recibir mi pedido?">
            <p>
              <strong>Envíos Express (solo CABA y GBA):</strong> si el pedido ingresa antes de las
              14 h de un día hábil o sábado, llega en el día; si no, al día hábil siguiente. Pedidos
              mayoristas o de gran volumen se informan por mail o WhatsApp.
            </p>
            <p className="mt-2">
              <strong>Envíos al interior:</strong> de 5 a 15 días hábiles. Entregas de lunes a
              sábados de 10 a 20 h. No se entrega domingos ni feriados.
            </p>
          </QA>
        </Section>

        {/* ── FORMAS DE PAGO ── */}
        <Section id="pago" title="Formas de pago">
          <QA q="¿Cómo puedo pagar?">
            Efectivo, transferencia, QR (Modo / Mercado Pago), tarjeta de débito y crédito. Cheques
            exclusivamente para pedidos mayoristas con cuenta corriente vigente. No hace falta tener
            local ni CUIT para comprar por mayor.
          </QA>

          <Block>
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">
              Datos para transferencia
            </p>
            <div className="space-y-1">
              <p><strong>TOQUE CREATIVO SRL</strong> — CUIT 30716283360</p>
              <p>Banco Supervielle — CC en pesos 3781212</p>
              <p>CBU 0270020510037812120025 — Alias: <strong>artentinosuper</strong></p>
            </div>
            <div className="mt-3 space-y-1 border-t border-gray-100 pt-3">
              <p>Cuenta Mercado Pago</p>
              <p>CVU 0000003100132288095792 — Alias: <strong>artentino</strong></p>
            </div>
            <p className="mt-3 text-gray-400">Se emiten facturas A y B.</p>
          </Block>
        </Section>

        {/* ── REGISTRO Y COMPRA ── */}
        <Section id="registro" title="Registro y compra">
          <QA q="¿Cómo me registro?">
            Ingresá al{' '}
            <Link href="/login" className="font-semibold" style={{ color: '#0eb1c3' }}>
              login
            </Link>
            , elegí tu contraseña y completá tus datos.
          </QA>

          <QA q="Me registré y no puedo ingresar, o compré y no recibí mail de confirmación.">
            Revisá la carpeta <strong>SPAM</strong> o Correo no deseado. Si no está ahí, escribinos
            a{' '}
            <a href="mailto:info@artentino.com" className="font-semibold" style={{ color: '#0eb1c3' }}>
              info@artentino.com
            </a>{' '}
            o al WhatsApp{' '}
            <a
              href="https://api.whatsapp.com/send?phone=5491139363333"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: '#0eb1c3' }}
            >
              11 3936 3333
            </a>
            , mencionando tu número de pedido.
          </QA>
        </Section>

        {/* ── REGALOS CORPORATIVOS ── */}
        <Section id="regalos" title="Regalos corporativos y personalizados">
          <Block>
            <p>
              Aplicamos el logo de tu empresa, emprendimiento o evento, o el diseño que nos envíes.
              Consultá las cantidades mínimas en cada artículo.
            </p>
            <p className="mt-3">
              Para consultas escribinos a{' '}
              <a href="mailto:info@artentino.com" className="font-semibold" style={{ color: '#0eb1c3' }}>
                info@artentino.com
              </a>{' '}
              o al{' '}
              <a
                href="https://api.whatsapp.com/send?phone=5491139363333"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold"
                style={{ color: '#0eb1c3' }}
              >
                WhatsApp +54 9 11 3936 3333
              </a>
              .
            </p>
          </Block>
        </Section>

        {/* ── CAMBIOS Y DEVOLUCIONES ── */}
        <Section id="cambios" title="Cambios y devoluciones">
          <Block>
            <p>
              Aceptamos cambios o devoluciones dentro de los <strong>10 días corridos</strong> desde
              la recepción, siempre que el producto esté sin uso, en perfecto estado y con su embalaje
              original. No se aceptan devoluciones por daños de mal uso, golpes posteriores a la
              entrega o instalación incorrecta.
            </p>
            <p className="mt-3">
              <strong>Productos dañados en el envío:</strong> avisar dentro de las 24 h de recibido,
              con fotos y/o videos del embalaje y del producto por WhatsApp para gestionar el reclamo
              con el transporte. Pasado ese plazo no se toman reclamos por daños de transporte.
            </p>
            <p className="mt-3">
              <strong>Sin cambio:</strong> productos en liquidación, outlet o con descuento especial;
              compras con retiro en depósito una vez retiradas; productos personalizados o pedidos
              especiales.
            </p>
            <p className="mt-3">
              <strong>Reintegros:</strong> una vez recibido y verificado el producto devuelto, se
              reintegra por el mismo medio de pago. Los costos de envío no son reembolsables; en
              devoluciones el envío corre por cuenta del cliente.
            </p>
          </Block>
        </Section>

        {/* ── Contacto al pie ── */}
        <div className="rounded-2xl border border-[#0eb1c3]/20 bg-[#f0fbfc] p-6 text-center">
          <p className="mb-1 text-xs font-black uppercase tracking-wider" style={{ color: '#0eb1c3' }}>
            ¿No encontraste lo que buscabas?
          </p>
          <p className="mb-5 text-[#1E1E1E] font-semibold">Contactanos directamente</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:info@artentino.com"
              className="inline-flex items-center gap-2 rounded-xl border border-[#0eb1c3] px-5 py-2.5 text-sm font-bold transition-all hover:bg-[#0eb1c3] hover:text-white"
              style={{ color: '#0eb1c3' }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@artentino.com
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=5491139363333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#0eb1c3' }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
              WhatsApp +54 9 11 3936 3333
            </a>
            <a
              href="https://maps.app.goo.gl/vYdUfZ1vPTeStfdWA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 transition-all hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Cramer 886, Colegiales CABA
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
