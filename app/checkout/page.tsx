'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/app/context/cart-context'

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

type ContactData = {
  name: string
  surname: string
  email: string
  phone: string
}

type ShippingMethod = 'pickup' | 'delivery'
type PaymentMethod = 'mercadopago' | 'modo'

const STEPS = ['Contacto', 'Envío', 'Pago', 'Resumen']

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()

  const [step, setStep] = useState(0)
  const [contact, setContact] = useState<ContactData>({ name: '', surname: '', email: '', phone: '' })
  const [shipping, setShipping] = useState<ShippingMethod>('pickup')
  const [payment, setPayment] = useState<PaymentMethod>('mercadopago')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-lg font-bold text-[#1E1E1E]">Tu carrito está vacío</p>
        <Link
          href="/catalogo"
          className="mt-4 inline-block rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest text-white"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          Ver catálogo
        </Link>
      </main>
    )
  }

  const subtotal = getTotal()

  async function handlePay() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          payer: contact,
          shipping,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.initPoint) {
        setError(data.error ?? 'Error al iniciar el pago')
        return
      }

      clearCart()
      window.location.href = data.initPoint
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="mb-4 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#0eb1c3]">
            ← Seguir comprando
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-wide text-[#1E1E1E]">Checkout</h1>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-0">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-colors ${
                    i < step
                      ? 'bg-[#0eb1c3] text-white'
                      : i === step
                      ? 'border-2 border-[#0eb1c3] text-[#0eb1c3]'
                      : 'border-2 border-gray-200 text-gray-300'
                  }`}
                >
                  {i < step ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${i === step ? 'text-[#0eb1c3]' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mb-4 h-px flex-1 transition-colors ${i < step ? 'bg-[#0eb1c3]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main form area */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            {/* STEP 0: Contacto */}
            {step === 0 && (
              <div>
                <h2 className="mb-6 text-base font-black uppercase tracking-wider text-[#1E1E1E]">
                  Datos de contacto
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Nombre</label>
                    <input
                      type="text"
                      required
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Apellido</label>
                    <input
                      type="text"
                      required
                      value={contact.surname}
                      onChange={(e) => setContact({ ...contact, surname: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Email</label>
                    <input
                      type="email"
                      required
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Teléfono</label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3]"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!contact.name || !contact.surname || !contact.email) return
                    setStep(1)
                  }}
                  disabled={!contact.name || !contact.surname || !contact.email}
                  className="mt-6 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-40"
                  style={{ backgroundColor: '#0eb1c3' }}
                >
                  Continuar
                </button>
              </div>
            )}

            {/* STEP 1: Envío */}
            {step === 1 && (
              <div>
                <h2 className="mb-6 text-base font-black uppercase tracking-wider text-[#1E1E1E]">
                  Método de envío
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition-colors ${
                      shipping === 'pickup' ? 'border-[#0eb1c3] bg-[#0eb1c3]/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="pickup"
                      checked={shipping === 'pickup'}
                      onChange={() => setShipping('pickup')}
                      className="mt-0.5 accent-[#0eb1c3]"
                    />
                    <div className="flex-1">
                      <p className="font-black text-[#1E1E1E]">Retiro en tienda</p>
                      <p className="text-sm text-gray-500">Colegiales, CABA — Coordinamos por WhatsApp</p>
                    </div>
                    <span className="font-black text-[#0eb1c3]">Gratis</span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition-colors ${
                      shipping === 'delivery' ? 'border-[#0eb1c3] bg-[#0eb1c3]/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="delivery"
                      checked={shipping === 'delivery'}
                      onChange={() => setShipping('delivery')}
                      className="mt-0.5 accent-[#0eb1c3]"
                    />
                    <div className="flex-1">
                      <p className="font-black text-[#1E1E1E]">Envío a domicilio</p>
                      <p className="text-sm text-gray-500">Todo el país — A calcular según destino</p>
                    </div>
                    <span className="text-sm font-bold text-gray-400">A calcular</span>
                  </label>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 rounded-2xl border border-gray-200 py-4 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-[2] rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: '#0eb1c3' }}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Pago */}
            {step === 2 && (
              <div>
                <h2 className="mb-6 text-base font-black uppercase tracking-wider text-[#1E1E1E]">
                  Método de pago
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-colors ${
                      payment === 'mercadopago' ? 'border-[#0eb1c3] bg-[#0eb1c3]/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="mercadopago"
                      checked={payment === 'mercadopago'}
                      onChange={() => setPayment('mercadopago')}
                      className="accent-[#0eb1c3]"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="font-black text-[#1E1E1E]">MercadoPago</p>
                        <p className="text-sm text-gray-500">Tarjeta, cuotas sin interés, efectivo</p>
                      </div>
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: '#009EE3' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" opacity=".3"/><path d="M12 4C7.582 4 4 7.582 4 12s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 3a5 5 0 1 1 0 10A5 5 0 0 1 12 7z"/></svg>
                      </div>
                    </div>
                  </label>

                  <div className="flex items-center gap-4 rounded-2xl border-2 border-gray-100 p-4 opacity-50">
                    <input type="radio" name="payment" disabled className="accent-[#0eb1c3]" />
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="font-black text-[#1E1E1E]">MODO</p>
                        <p className="text-sm text-gray-500">Billetera digital</p>
                      </div>
                      <span className="rounded-full border border-gray-300 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Próximamente
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-2xl border border-gray-200 py-4 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-[2] rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: '#0eb1c3' }}
                  >
                    Ver resumen
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Resumen */}
            {step === 3 && (
              <div>
                <h2 className="mb-6 text-base font-black uppercase tracking-wider text-[#1E1E1E]">
                  Resumen del pedido
                </h2>

                {/* Contact summary */}
                <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">Contacto</p>
                  <p className="mt-1 text-sm font-bold text-[#1E1E1E]">{contact.name} {contact.surname}</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                  {contact.phone && <p className="text-sm text-gray-500">{contact.phone}</p>}
                </div>

                {/* Shipping summary */}
                <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">Envío</p>
                  <p className="mt-1 text-sm font-bold text-[#1E1E1E]">
                    {shipping === 'pickup' ? 'Retiro en tienda — Colegiales CABA' : 'Envío a domicilio'}
                  </p>
                </div>

                {/* Products */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-wider text-gray-400">Productos</p>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item.productId} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-[#1E1E1E]">{item.name}</p>
                          <p className="text-xs text-gray-400">x{item.quantity} · {fmt(item.price)} c/u</p>
                        </div>
                        <p className="text-sm font-black text-[#1E1E1E]">{fmt(item.price * item.quantity)}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-2xl border border-gray-200 py-4 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={loading}
                    className="flex-[2] rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-60 hover:opacity-85"
                    style={{ backgroundColor: '#0eb1c3' }}
                  >
                    {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="rounded-2xl bg-white p-5 shadow-sm lg:h-fit">
            <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-gray-400">Tu pedido</h3>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.productId} className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
                      style={{ backgroundColor: '#0eb1c3' }}
                    >
                      {item.quantity}
                    </span>
                    <span className="text-xs font-semibold text-[#1E1E1E]">{item.name}</span>
                  </div>
                  <span className="shrink-0 text-xs font-black text-[#1E1E1E]">
                    {fmt(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Envío</span>
                <span className="text-xs font-bold text-gray-400">
                  {shipping === 'pickup' ? 'Gratis' : 'A calcular'}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-black text-[#1E1E1E]">Total</span>
                <span className="text-lg font-black text-[#1E1E1E]">{fmt(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
