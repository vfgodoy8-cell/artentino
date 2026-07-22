'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart, getEffectivePrice } from '@/app/context/cart-context'
import { CASH_DISCOUNT, CASH_DISCOUNT_PCT } from '@/app/lib/constants'

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

type ContactData = {
  name: string
  surname: string
  email: string
  phone: string
}

type AddressData = {
  street: string
  streetNumber: string
  city: string
  province: string
  zip: string
}

type ShippingMethod = 'pickup' | 'delivery'
type PaymentMethod = 'mercadopago' | 'cash' | 'transfer' | 'modo'
type ShippingCourier = 'ARTENTINO_EXPRESS' | 'ZIPNOVA'
type ShippingOption = { courier: ShippingCourier; label: string; amount: number }

const STEPS = ['Contacto', 'Envío', 'Pago', 'Resumen']

export default function CheckoutClient() {
  const { items, getTotal, clearCart } = useCart()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [contact, setContact] = useState<ContactData>({ name: '', surname: '', email: '', phone: '' })
  const [shipping, setShipping] = useState<ShippingMethod>('pickup')
  const [address, setAddress] = useState<AddressData>({ street: '', streetNumber: '', city: '', province: '', zip: '' })
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [courier, setCourier] = useState<ShippingCourier | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)
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

  const isCashOrTransfer = payment === 'cash' || payment === 'transfer'
  const discountedTotal = Math.round(subtotal * (1 - CASH_DISCOUNT))
  const shippingAmount = shipping === 'delivery' && courier
    ? shippingOptions.find((o) => o.courier === courier)?.amount ?? 0
    : 0
  const displayTotal = (isCashOrTransfer ? discountedTotal : subtotal) + shippingAmount

  async function handleContinueFromShipping() {
    if (shipping === 'pickup') {
      setStep(2)
      return
    }

    if (!address.city || !address.zip) return

    setQuoteLoading(true)
    setQuoteError(null)
    try {
      const res = await fetch('/api/checkout/quote-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: address.city,
          province: address.province,
          zip: address.zip,
          declaredValue: subtotal,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setQuoteError(data.error ?? 'No se pudo cotizar el envío')
        return
      }
      setShippingOptions(data.options)
      setCourier(data.options[0]?.courier ?? null)
      setStep(2)
    } catch {
      setQuoteError('No se pudo cotizar el envío. Intentá de nuevo.')
    } finally {
      setQuoteLoading(false)
    }
  }

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
            price: getEffectivePrice(i),
            quantity: i.quantity,
            attributeValueId: i.attributeValueId,
          })),
          payer: contact,
          shipping,
          paymentMethod: payment,
          ...(shipping === 'delivery'
            ? { shippingAddress: address, shippingCourier: courier, shippingQuotedAmount: shippingAmount }
            : {}),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Error al procesar el pedido')
        return
      }

      if (data.confirmed) {
        clearCart()
        router.push(`/checkout/confirmado?method=${payment}`)
        return
      }

      if (!data.initPoint) {
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
    <main className="min-h-dvh bg-[#F7F7F7]">
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
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Apellido</label>
                    <input
                      type="text"
                      required
                      value={contact.surname}
                      onChange={(e) => setContact({ ...contact, surname: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Email</label>
                    <input
                      type="email"
                      required
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Teléfono</label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
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
                      onChange={() => { setShipping('delivery'); if (payment === 'cash' || payment === 'transfer') setPayment('mercadopago') }}
                      className="mt-0.5 accent-[#0eb1c3]"
                    />
                    <div className="flex-1">
                      <p className="font-black text-[#1E1E1E]">Envío a domicilio</p>
                      <p className="text-sm text-gray-500">Todo el país — A calcular según destino</p>
                    </div>
                    <span className="text-sm font-bold text-gray-400">A calcular</span>
                  </label>
                </div>

                {shipping === 'delivery' && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Calle</label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Número</label>
                      <input
                        type="text"
                        value={address.streetNumber}
                        onChange={(e) => setAddress({ ...address, streetNumber: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Localidad</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="Ej: Pilar"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Provincia</label>
                      <input
                        type="text"
                        value={address.province}
                        onChange={(e) => setAddress({ ...address, province: e.target.value })}
                        placeholder="Ej: Buenos Aires"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Código Postal</label>
                      <input
                        type="text"
                        required
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
                      />
                    </div>
                  </div>
                )}

                {quoteError && (
                  <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                    {quoteError}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 rounded-2xl border border-gray-200 py-4 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleContinueFromShipping}
                    disabled={quoteLoading || (shipping === 'delivery' && (!address.city || !address.zip))}
                    className="flex-[2] rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-40 hover:opacity-85"
                    style={{ backgroundColor: '#0eb1c3' }}
                  >
                    {quoteLoading ? 'Cotizando…' : 'Continuar'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Pago */}
            {step === 2 && (
              <div>
                {shipping === 'delivery' && (
                  <div className="mb-8">
                    <h2 className="mb-6 text-base font-black uppercase tracking-wider text-[#1E1E1E]">
                      Método de envío
                    </h2>
                    {shippingOptions.length === 0 ? (
                      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                        No hay opciones de envío disponibles para esta localidad por el momento.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {shippingOptions.map((option) => (
                          <label
                            key={option.courier}
                            className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 p-4 transition-colors ${
                              courier === option.courier ? 'border-[#0eb1c3] bg-[#0eb1c3]/5' : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="radio"
                                name="courier"
                                checked={courier === option.courier}
                                onChange={() => setCourier(option.courier)}
                                className="accent-[#0eb1c3]"
                              />
                              <div>
                                <p className="font-black text-[#1E1E1E]">{option.label}</p>
                                <p className="text-sm text-gray-500">
                                  {option.courier === 'ARTENTINO_EXPRESS' ? 'Gestionado por Artentino' : 'Gestionado por Zipnova'}
                                </p>
                              </div>
                            </div>
                            <span className="font-black text-[#1E1E1E]">{fmt(option.amount)}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

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

                  {shipping === 'pickup' && (
                    <>
                      <label
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition-colors ${
                          payment === 'cash' ? 'border-[#0eb1c3] bg-[#0eb1c3]/5' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={payment === 'cash'}
                          onChange={() => setPayment('cash')}
                          className="mt-0.5 accent-[#0eb1c3]"
                        />
                        <div className="flex-1">
                          <p className="font-black text-[#1E1E1E]">Efectivo</p>
                          <p className="text-sm text-gray-500">Pagás al retirar en el local</p>
                        </div>
                        <span className="rounded-full bg-[#0eb1c3]/10 px-3 py-1 text-xs font-black text-[#0eb1c3]">
                          {CASH_DISCOUNT_PCT}% OFF
                        </span>
                      </label>

                      <label
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition-colors ${
                          payment === 'transfer' ? 'border-[#0eb1c3] bg-[#0eb1c3]/5' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="transfer"
                          checked={payment === 'transfer'}
                          onChange={() => setPayment('transfer')}
                          className="mt-0.5 accent-[#0eb1c3]"
                        />
                        <div className="flex-1">
                          <p className="font-black text-[#1E1E1E]">Transferencia bancaria</p>
                          <p className="text-sm text-gray-500">Enviás el comprobante antes de retirar</p>
                        </div>
                        <span className="rounded-full bg-[#0eb1c3]/10 px-3 py-1 text-xs font-black text-[#0eb1c3]">
                          {CASH_DISCOUNT_PCT}% OFF
                        </span>
                      </label>
                    </>
                  )}

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
                    disabled={shipping === 'delivery' && !courier}
                    className="flex-[2] rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-40 hover:opacity-85"
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

                <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">Contacto</p>
                  <p className="mt-1 text-sm font-bold text-[#1E1E1E]">{contact.name} {contact.surname}</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                  {contact.phone && <p className="text-sm text-gray-500">{contact.phone}</p>}
                </div>

                <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">Envío</p>
                  <p className="mt-1 text-sm font-bold text-[#1E1E1E]">
                    {shipping === 'pickup'
                      ? 'Retiro en tienda — Colegiales CABA'
                      : `${shippingOptions.find((o) => o.courier === courier)?.label ?? 'Envío a domicilio'} — ${fmt(shippingAmount)}`}
                  </p>
                  {shipping === 'delivery' && (
                    <p className="text-sm text-gray-500">
                      {address.street} {address.streetNumber}, {address.city}
                      {address.province ? `, ${address.province}` : ''} (CP {address.zip})
                    </p>
                  )}
                </div>

                <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">Pago</p>
                  <p className="mt-1 text-sm font-bold text-[#1E1E1E]">
                    {payment === 'cash'
                      ? 'Efectivo — pagás al retirar'
                      : payment === 'transfer'
                      ? 'Transferencia bancaria — enviás el comprobante'
                      : 'MercadoPago'}
                  </p>
                </div>

                {isCashOrTransfer && (
                  <div className="mb-4 rounded-xl border border-[#c8eff4] bg-[#f0fbfc] px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-wider text-[#0eb1c3]">Descuento aplicado</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm font-bold text-[#1E1E1E]">{CASH_DISCOUNT_PCT}% OFF {payment === 'cash' ? 'efectivo' : 'transferencia'}</p>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 line-through">{fmt(subtotal)}</p>
                        <p className="text-base font-black text-[#0eb1c3]">{fmt(discountedTotal)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-wider text-gray-400">Productos</p>
                  <ul className="space-y-2">
                    {items.map((item) => {
                      const effectivePrice = getEffectivePrice(item)
                      const hasCombo = effectivePrice < item.price
                      const savings = (item.price - effectivePrice) * item.quantity
                      return (
                        <li key={item.productId} className="rounded-xl border border-gray-100 px-4 py-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#1E1E1E]">{item.name}</p>
                              {hasCombo ? (
                                <p className="text-xs text-[#0eb1c3] font-semibold">
                                  Precio volumen: {fmt(effectivePrice)} c/u · ahorrás {fmt(savings)}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-400">x{item.quantity} · {fmt(item.price)} c/u</p>
                              )}
                            </div>
                            <p className="shrink-0 text-sm font-black text-[#1E1E1E]">{fmt(effectivePrice * item.quantity)}</p>
                          </div>
                        </li>
                      )
                    })}
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
                    {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Procesando...
                    </span>
                  ) : isCashOrTransfer ? 'Confirmar pedido' : 'Pagar con MercadoPago'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="rounded-2xl bg-white p-5 shadow-sm lg:h-fit">
            <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-gray-400">Tu pedido</h3>
            <ul className="space-y-3">
              {items.map((item) => {
                const effectivePrice = getEffectivePrice(item)
                return (
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
                      {fmt(effectivePrice * item.quantity)}
                    </span>
                  </li>
                )
              })}
            </ul>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Envío</span>
                <span className="text-xs font-bold text-gray-400">
                  {shipping === 'pickup' ? 'Gratis' : courier ? fmt(shippingAmount) : 'A calcular'}
                </span>
              </div>
              {isCashOrTransfer && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">Subtotal</span>
                  <span className="text-xs font-bold text-gray-400 line-through">{fmt(subtotal)}</span>
                </div>
              )}
              {isCashOrTransfer && (
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0eb1c3]">{CASH_DISCOUNT_PCT}% OFF {payment === 'cash' ? 'efectivo' : 'transferencia'}</span>
                  <span className="text-xs font-black text-[#0eb1c3]">−{fmt(subtotal - discountedTotal)}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-black text-[#1E1E1E]">Total</span>
                <span className="text-lg font-black text-[#1E1E1E]">{fmt(displayTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
