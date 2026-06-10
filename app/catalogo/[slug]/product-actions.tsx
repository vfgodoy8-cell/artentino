'use client'

import { useState } from 'react'
import { useCart, type ComboPrice } from '@/app/context/cart-context'

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

function CartIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  )
}

type Props = {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  comboPrices: ComboPrice[]
  disabled: boolean
}

export default function ProductActions({
  productId,
  name,
  price,
  imageUrl,
  comboPrices,
  disabled,
}: Props) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [comboAddedId, setComboAddedId] = useState<string | null>(null)

  function handleAddToCart() {
    addItem({ productId, name, price, imageUrl, comboPrices }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  function handleComboAdd(combo: ComboPrice) {
    addItem({ productId, name, price, imageUrl, comboPrices }, combo.quantity)
    setComboAddedId(combo.id)
    setTimeout(() => setComboAddedId(null), 1200)
  }

  return (
    <div>
      {/* Combo table */}
      {comboPrices.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-xl border border-[#0eb1c3]/30 bg-[#f0fbfc]">
          <div className="border-b border-[#0eb1c3]/20 px-4 py-2.5">
            <p className="text-xs font-black uppercase tracking-wider text-[#0eb1c3]">
              Comprá más, pagá menos
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#0eb1c3]/10">
                <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Cantidad
                </th>
                <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Precio unitario
                </th>
                <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Ahorrás
                </th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0eb1c3]/10">
              {comboPrices.map((c) => {
                const pct = Math.round((1 - c.price / price) * 100)
                const isAdded = comboAddedId === c.id
                return (
                  <tr key={c.id}>
                    <td className="px-4 py-2.5 font-bold text-[#1E1E1E]">{c.quantity}+ unidades</td>
                    <td className="px-4 py-2.5 font-black text-[#1E1E1E]">{fmt(c.price)}</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-full bg-[#0eb1c3] px-2.5 py-0.5 text-xs font-black text-white">
                        {pct}% off
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => handleComboAdd(c)}
                        disabled={disabled}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white transition-colors disabled:opacity-40"
                        style={{ backgroundColor: isAdded ? '#1E1E1E' : '#0eb1c3' }}
                      >
                        <CartIcon />
                        {isAdded ? '¡Listo!' : `Pack x${c.quantity}`}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="px-4 py-2 text-[11px] text-gray-400">
            * Al comprar pack no se puede elegir color.
          </p>
        </div>
      )}

      {/* Quantity selector */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-bold text-gray-500">Cantidad:</span>
        <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-lg text-gray-500 transition-colors hover:bg-gray-50"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-black text-[#1E1E1E]">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center text-lg text-gray-500 transition-colors hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Main add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={disabled}
        className="mt-4 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-all disabled:opacity-40"
        style={{ backgroundColor: added ? '#1E1E1E' : '#0eb1c3' }}
      >
        {disabled ? 'Sin stock' : added ? '¡Agregado!' : 'Agregar al carrito'}
      </button>
    </div>
  )
}
