import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: '#2BBCB0' }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="text-3xl font-black text-[#1E1E1E]">¡Gracias por tu compra!</h1>
      <p className="mt-3 max-w-sm text-base text-gray-500">
        Tu pago fue procesado correctamente. En breve recibirás un email de confirmación.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
        style={{ backgroundColor: '#2BBCB0' }}
      >
        Volver al inicio
      </Link>
    </main>
  )
}
