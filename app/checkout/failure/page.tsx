import Link from 'next/link'

export default function CheckoutFailurePage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <h1 className="text-3xl font-black text-[#1E1E1E]">Hubo un problema con el pago</h1>
      <p className="mt-3 max-w-sm text-base text-gray-500">
        No pudimos procesar tu pago. Podés intentarlo de nuevo o elegir otro método.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/checkout"
          className="inline-block rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          Reintentar pago
        </Link>
        <Link
          href="/"
          className="inline-block rounded-2xl border border-gray-200 px-8 py-4 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
