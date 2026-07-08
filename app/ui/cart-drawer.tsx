'use client'

import Link from 'next/link'
import { useCart, getEffectivePrice, cartItemKey } from '@/app/context/cart-context'
import { CASH_DISCOUNT_PCT } from '@/app/lib/constants'
import { CategoryIcon } from './product-card'

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCart()

  return (
    <>
      {/* Overlay — fades faster than the drawer slides in */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[100] bg-black/40 transition-[opacity] [transition-timing-function:var(--ease-out)] ${
          open ? 'opacity-100 duration-[260ms]' : 'pointer-events-none opacity-0 duration-[200ms]'
        }`}
      />

      {/* Drawer — iOS-weight easing, asymmetric enter/exit durations */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-sm flex-col bg-white shadow-2xl transition-[transform] [transition-timing-function:var(--ease-drawer)] ${
          open ? 'translate-x-0 duration-[380ms]' : 'translate-x-full duration-[280ms]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-[#1E1E1E]">
              Tu carrito
            </h2>
            <p className="text-xs text-gray-400">
              {getItemCount()} {getItemCount() === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-[transform,color,border-color] duration-[160ms] [transition-timing-function:var(--ease-out)] hover:border-[#1E1E1E] hover:text-[#1E1E1E] active:scale-[0.90]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="text-sm font-bold text-gray-400">Tu carrito está vacío</p>
              <Link
                href="/catalogo"
                onClick={onClose}
                className="mt-2 rounded-xl bg-[#0eb1c3] px-6 py-2.5 text-sm font-black uppercase tracking-widest text-white transition-[transform,background-color] duration-[160ms] [transition-timing-function:var(--ease-out)] hover:bg-[#0ca3b4] active:scale-[0.97]"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const effectivePrice = getEffectivePrice(item)
                const hasCombo = effectivePrice < item.price
                return (
                  <li key={cartItemKey(item)} className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <CategoryIcon category="" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="line-clamp-2 text-xs font-bold leading-snug text-[#1E1E1E]">
                        {item.name}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-sm font-black text-[#1E1E1E]">{fmt(effectivePrice)}</p>
                        {hasCombo && (
                          <p className="text-xs text-gray-400 line-through">{fmt(item.price)}</p>
                        )}
                      </div>
                      {hasCombo && (
                        <p className="text-[10px] font-black uppercase tracking-wide text-[#0eb1c3]">
                          Precio por volumen aplicado ✓
                        </p>
                      )}

                      {/* Quantity + remove */}
                      <div className="mt-auto flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.attributeValueId)}
                            className="flex h-7 w-7 items-center justify-center text-gray-500 transition-[transform,color] duration-[160ms] [transition-timing-function:var(--ease-out)] hover:text-[#1E1E1E] active:scale-[0.85]"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="w-7 text-center text-xs font-black text-[#1E1E1E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.attributeValueId)}
                            className="flex h-7 w-7 items-center justify-center text-gray-500 transition-[transform,color] duration-[160ms] [transition-timing-function:var(--ease-out)] hover:text-[#1E1E1E] active:scale-[0.85]"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.attributeValueId)}
                          className="text-xs font-semibold text-red-400 transition-[transform,color] duration-[160ms] [transition-timing-function:var(--ease-out)] hover:text-red-600 active:scale-[0.90]"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <p className="shrink-0 text-sm font-black text-[#1E1E1E]">
                      {fmt(effectivePrice * item.quantity)}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">Subtotal</span>
              <span className="text-lg font-black text-[#1E1E1E]">{fmt(getTotal())}</span>
            </div>
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#f0fbfc] px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0eb1c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p className="text-xs font-black leading-snug text-[#0eb1c3]">
                Pagando en efectivo o transferencia, tenés {CASH_DISCOUNT_PCT}% OFF
              </p>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-2xl bg-[#0eb1c3] py-4 text-center text-sm font-black uppercase tracking-widest text-white transition-[transform,background-color] duration-[180ms] [transition-timing-function:var(--ease-out)] hover:bg-[#0ca3b4] active:scale-[0.97]"
            >
              Ir al checkout
            </Link>
            <button
              onClick={onClose}
              className="mt-3 w-full rounded-2xl border border-gray-200 py-3.5 text-sm font-bold text-[#1E1E1E] transition-[transform,color,border-color] duration-[160ms] [transition-timing-function:var(--ease-out)] hover:border-[#0eb1c3] hover:text-[#0eb1c3] active:scale-[0.97]"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
