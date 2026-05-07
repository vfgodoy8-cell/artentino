import Link from 'next/link'

export default function CheckoutPendingPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="text-3xl font-black text-[#1E1E1E]">Tu pago está siendo procesado</h1>
      <p className="mt-3 max-w-sm text-base text-gray-500">
        Tu transacción está pendiente de confirmación. Te notificaremos por email cuando se acredite.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
        style={{ backgroundColor: '#0eb1c3' }}
      >
        Volver al inicio
      </Link>
    </main>
  )
}
