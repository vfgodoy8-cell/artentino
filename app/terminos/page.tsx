import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Artentino',
  description: 'Condiciones de uso, compra y venta de Artentino.',
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-2 font-black text-[#1E1E1E]">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-gray-600">{children}</div>
    </div>
  )
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: '#0eb1c3' }}>
            Legal
          </p>
          <h1 className="text-3xl font-black text-[#1E1E1E] sm:text-4xl">
            Términos y condiciones
          </h1>
          <p className="mt-3 text-gray-500">
            Última actualización: agosto de 2026. Al navegar o realizar una compra en este sitio,
            aceptás las condiciones descriptas a continuación.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6 lg:px-8">
        <Block title="1. Aceptación de los términos">
          <p>
            El uso de este sitio y la realización de una compra implican la aceptación plena de estos
            términos y condiciones, así como de nuestra{' '}
            <Link href="/privacidad" className="font-semibold" style={{ color: '#0eb1c3' }}>
              Política de Privacidad
            </Link>
            . Estas condiciones se rigen por la Ley 24.240 de Defensa del Consumidor.
          </p>
        </Block>

        <Block title="2. Productos, precios y disponibilidad">
          <p>
            Los precios publicados incluyen impuestos y están expresados en pesos argentinos.
            Artentino se reserva el derecho de modificar precios y stock sin previo aviso. Si un
            producto no tiene stock disponible tras confirmar una compra, te lo vamos a informar para
            coordinar un reembolso o reemplazo.
          </p>
        </Block>

        <Block title="3. Medios de pago">
          <p>
            Aceptamos MercadoPago (tarjetas de crédito, débito y cuotas sin interés), efectivo y
            transferencia bancaria (con retiro en showroom), y cheques para pedidos mayoristas con
            cuenta corriente vigente. Ver el detalle completo en{' '}
            <Link href="/faq#pago" className="font-semibold" style={{ color: '#0eb1c3' }}>
              Preguntas frecuentes → Formas de pago
            </Link>
            .
          </p>
        </Block>

        <Block title="4. Envíos">
          <p>
            Ofrecemos envío Express (CABA y GBA) y envío a todo el país a través de Zipnova, además de
            retiro sin cargo en nuestro showroom. Los tiempos y costos de envío se calculan según el
            destino ingresado en el checkout. Ver el detalle completo en{' '}
            <Link href="/faq#envio" className="font-semibold" style={{ color: '#0eb1c3' }}>
              Preguntas frecuentes → Envíos
            </Link>
            .
          </p>
        </Block>

        <Block title="5. Cambios y devoluciones">
          <p>
            Aceptamos cambios o devoluciones dentro de los 10 días corridos desde la recepción,
            siempre que el producto esté sin uso y en su embalaje original. Ver las condiciones
            completas en{' '}
            <Link href="/faq#cambios" className="font-semibold" style={{ color: '#0eb1c3' }}>
              Preguntas frecuentes → Cambios y devoluciones
            </Link>
            .
          </p>
        </Block>

        <Block title="6. Botón de Arrepentimiento">
          <p>
            De acuerdo a la Resolución 424/2020, tenés derecho a revocar tu compra dentro de los 10
            días corridos desde que recibiste el pedido, sin necesidad de indicar motivo ni costo
            alguno. Podés iniciar este trámite desde nuestro{' '}
            <Link href="/arrepentimiento" className="font-semibold" style={{ color: '#0eb1c3' }}>
              Botón de Arrepentimiento
            </Link>
            .
          </p>
        </Block>

        <Block title="7. Propiedad intelectual">
          <p>
            Todos los contenidos de este sitio (textos, imágenes, logotipos, diseño) son propiedad de
            Artentino o de sus respectivos titulares, y no pueden reproducirse sin autorización previa.
          </p>
        </Block>

        <Block title="8. Limitación de responsabilidad">
          <p>
            Artentino no se responsabiliza por demoras ocasionadas por terceros (transportistas,
            procesadores de pago) ni por el uso indebido de los productos adquiridos. Los productos
            personalizados o pedidos especiales no admiten cambio salvo defecto de fabricación.
          </p>
        </Block>

        <Block title="9. Modificaciones">
          <p>
            Estos términos pueden actualizarse periódicamente. Los cambios entran en vigencia desde su
            publicación en esta página.
          </p>
        </Block>

        <Block title="10. Ley aplicable y jurisdicción">
          <p>
            Estos términos se rigen por las leyes de la República Argentina. Ante cualquier
            controversia, las partes se someten a la jurisdicción de los tribunales ordinarios de la
            Ciudad Autónoma de Buenos Aires, sin perjuicio de los derechos que la Ley 24.240 reconoce
            a los consumidores.
          </p>
        </Block>

        <Block title="11. Contacto">
          <p>
            Ante cualquier consulta sobre estos términos, escribinos a{' '}
            <a href="mailto:info@artentino.com" className="font-semibold" style={{ color: '#0eb1c3' }}>
              info@artentino.com
            </a>{' '}
            o por WhatsApp al{' '}
            <a
              href="https://api.whatsapp.com/send?phone=5491139363333"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: '#0eb1c3' }}
            >
              +54 9 11 3936 3333
            </a>
            .
          </p>
        </Block>
      </div>
    </div>
  )
}
