'use client'

import { useState, useEffect } from 'react'
import { useCart, type ComboPrice } from '@/app/context/cart-context'
import { CASH_DISCOUNT_PCT } from '@/app/lib/constants'
import VariantSelector from './variant-selector'

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

type VariantEntry = { id: string; value: string }

type Props = {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  comboPrices: ComboPrice[]
  disabled: boolean
  disabledReason: 'no-stock' | 'no-color' | null
  maxQty: number
  selectedColorId: string | null
  onClearColor: () => void
  variantGroups: Record<string, VariantEntry[]>
  stockByValueId: Record<string, number>
  onColorSelect: (id: string | null) => void
  colorResetKey: number
}

export default function ProductActions({
  productId,
  name,
  price,
  imageUrl,
  comboPrices,
  disabled,
  disabledReason,
  maxQty,
  selectedColorId,
  onClearColor,
  variantGroups,
  stockByValueId,
  onColorSelect,
  colorResetKey,
}: Props) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [comboAddedId, setComboAddedId] = useState<string | null>(null)
  const [showPackNote, setShowPackNote] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setQty(1)
  }, [selectedColorId])

  function handleAddToCart() {
    addItem(
      {
        productId,
        name,
        price,
        imageUrl,
        comboPrices,
        attributeValueId: selectedColorId ?? undefined,
      },
      qty,
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  function handleComboAdd(combo: ComboPrice) {
    if (selectedColorId !== null) {
      onClearColor()
      setShowPackNote(true)
      setTimeout(() => setShowPackNote(false), 3000)
    }
    addItem({ productId, name, price, imageUrl, comboPrices }, combo.quantity)
    setComboAddedId(combo.id)
    setTimeout(() => setComboAddedId(null), 1200)
  }

  function handleVariantSelect(_attrName: string, valueId: string) {
    onColorSelect(valueId || null)
  }

  const buttonLabel = added
    ? '¡Agregado!'
    : disabledReason === 'no-color'
      ? 'Seleccioná una variante'
      : disabledReason === 'no-stock'
        ? 'Sin stock'
        : 'Agregar al carrito'

  const hasVariants = Object.keys(variantGroups).length > 0

  return (
    <div>
      {/* Combo table */}
      {comboPrices.length > 0 && (
        <div
          className="relative mt-5"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Transfer tooltip */}
          {showTooltip && (
            <div className="absolute -top-11 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-[#1E1E1E] px-3 py-2 text-center text-xs font-semibold text-white shadow-lg">
              Si comprás con efectivo o transferencia, tenés un {CASH_DISCOUNT_PCT}% de descuento
              <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#1E1E1E]" />
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-[#0eb1c3]/30 bg-[#f0fbfc]">
            <div className="border-b border-[#0eb1c3]/20 px-4 py-2.5">
              <p className="text-xs font-black uppercase tracking-wider text-[#0eb1c3]">
                Comprá más y sumá descuentos adicionales
              </p>
              <p className="mt-0.5 text-[11px] font-semibold normal-case tracking-normal text-[#0eb1c3]/80">
                Son acumulables con el {CASH_DISCOUNT_PCT}% OFF Efectivo - Transferencia!
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
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white transition-colors"
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
            <p
              className={`px-4 py-2 text-[11px] transition-colors duration-300 ${
                showPackNote ? 'font-bold text-[#0eb1c3]' : 'text-gray-400'
              }`}
            >
              {showPackNote
                ? '✓ Color deseleccionado — los packs son surtidos.'
                : '* Los packs vienen surtidos — no se elige color.'}
            </p>
          </div>
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
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            className="flex h-9 w-9 items-center justify-center text-lg text-gray-500 transition-colors hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Variant selector — between quantity and add-to-cart */}
      {hasVariants && (
        <div className="mt-5">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            Variante
          </p>
          <VariantSelector
            key={colorResetKey}
            variantGroups={variantGroups}
            stockByValueId={stockByValueId}
            onSelect={handleVariantSelect}
          />
        </div>
      )}

      {/* Main add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={disabled}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-all disabled:opacity-60"
        style={{ backgroundColor: added ? '#1E1E1E' : '#0eb1c3' }}
      >
        {disabledReason === 'no-color' ? (
          <>
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            Seleccioná una variante
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </>
        ) : (
          buttonLabel
        )}
      </button>
    </div>
  )
}
