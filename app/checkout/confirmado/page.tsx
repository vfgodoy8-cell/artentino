import Link from 'next/link'
import { CASH_DISCOUNT_PCT } from '@/app/lib/constants'

export default function CheckoutConfirmadoPage() {
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
        Tu pedido quedó guardado. Pasá por el local a retirarlo y abonalo ahí mismo.
      </p>

      <div className="mt-6 max-w-sm rounded-2xl border border-[#c8eff4] bg-[#f0fbfc] px-6 py-5 text-left">
        <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-[#0eb1c3]">Método de pago</p>
        <p className="font-black text-[#1E1E1E]">Efectivo o transferencia</p>
        <p className="mt-0.5 text-sm text-gray-500">Abonás al retirar en el local · Colegiales, CABA</p>

        <div className="mt-4 border-t border-[#c8eff4] pt-4">
          <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-[#0eb1c3]">Descuento aplicado</p>
          <p className="font-black text-[#1E1E1E]">{CASH_DISCOUNT_PCT}% OFF por pago en efectivo o transferencia</p>
        </div>
      </div>

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
