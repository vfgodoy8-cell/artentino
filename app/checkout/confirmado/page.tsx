import Link from 'next/link'
import { CASH_DISCOUNT_PCT } from '@/app/lib/constants'

const WA_HREF = 'https://wa.me/5491139363333'

type Props = { searchParams: Promise<{ method?: string }> }

export default async function CheckoutConfirmadoPage({ searchParams }: Props) {
  const { method } = await searchParams
  const isCash = method === 'cash'
  const isTransfer = method === 'transfer'
  const isLegacy = method === 'cash_transfer'
  const isCashOrTransfer = isCash || isTransfer || isLegacy

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: '#0eb1c3' }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="text-3xl font-black text-[#1E1E1E]">¡Pedido registrado!</h1>

      <p className="mt-3 max-w-sm text-base text-gray-500">
        {isTransfer
          ? 'Tu pedido quedó guardado. Realizá la transferencia y envianos el comprobante.'
          : 'Tu pedido quedó guardado. Pasá por el local a retirarlo y abonalo ahí mismo.'}
      </p>

      {isCashOrTransfer && (
        <div className="mt-6 w-full max-w-sm rounded-2xl border border-[#c8eff4] bg-[#f0fbfc] px-6 py-5 text-left">

          {/* Método de pago */}
          <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-[#0eb1c3]">Método de pago</p>

          {isCash && (
            <>
              <p className="font-black text-[#1E1E1E]">Efectivo</p>
              <p className="mt-0.5 text-sm text-gray-500">Abonás al retirar en el local · Colegiales, CABA</p>
              <p className="mt-3 text-sm text-gray-500">
                Aguardá nuestro contacto para pasar por el Showroom a retirar.
              </p>
            </>
          )}

          {isTransfer && (
            <>
              <p className="font-black text-[#1E1E1E]">Transferencia bancaria</p>
              <p className="mt-0.5 text-sm text-gray-500">
                Hacelo a las siguientes cuentas y luego envianos el comprobante por{' '}
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0eb1c3] hover:underline"
                >
                  WhatsApp
                </a>
                .
              </p>

              {/* Cuenta 1 — Mercado Pago */}
              <div className="mt-4 rounded-xl border border-[#c8eff4] bg-white px-4 py-3 text-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mercado Pago</p>
                <p className="mt-1 text-gray-500">
                  ALIAS: <span className="font-black text-[#1E1E1E]">artentino</span>
                </p>
                <p className="text-gray-500">Mercado Pago Artentino - Toque Creativo SRL</p>
                <p className="text-xs text-gray-400">CVU: 0000003100132288095792</p>
              </div>

              {/* Cuenta 2 — Supervielle */}
              <div className="mt-2 rounded-xl border border-[#c8eff4] bg-white px-4 py-3 text-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Supervielle ARS</p>
                <p className="mt-1 text-gray-500">
                  ALIAS: <span className="font-black text-[#1E1E1E]">artentinosuper</span>
                </p>
                <p className="text-gray-500">Cta Cte 020-3781212-2 - Toque Creativo SRL - Artentino</p>
                <p className="text-xs text-gray-400">CBU: 0270020510037812120025</p>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Aguardá nuestro contacto para pasar por el Showroom a retirar.
              </p>
            </>
          )}

          {isLegacy && (
            <>
              <p className="font-black text-[#1E1E1E]">Efectivo o transferencia</p>
              <p className="mt-0.5 text-sm text-gray-500">Abonás al retirar en el local · Colegiales, CABA</p>
            </>
          )}

          {/* Descuento */}
          <div className="mt-4 border-t border-[#c8eff4] pt-4">
            <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-[#0eb1c3]">Descuento aplicado</p>
            <p className="font-black text-[#1E1E1E]">{CASH_DISCOUNT_PCT}% OFF por pago en efectivo o transferencia</p>
          </div>
        </div>
      )}

      <p className="mt-5 text-sm text-gray-400">
        Te enviamos un email con los detalles del pedido.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/catalogo"
          className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
        >
          Seguir comprando
        </Link>
        <Link
          href="/"
          className="rounded-2xl px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
