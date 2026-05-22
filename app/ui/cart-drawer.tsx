'use client'

import Link from 'next/link'
import { useCart, getEffectivePrice } from '@/app/context/cart-context'
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
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-[#1E1E1E] hover:text-[#1E1E1E]"
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
              <button
                onClick={onClose}
                className="mt-2 text-sm font-black uppercase tracking-widest text-white rounded-xl px-6 py-2.5 transition-opacity hover:opacity-85"
                style={{ backgroundColor: '#0eb1c3' }}
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const effectivePrice = getEffectivePrice(item)
                const hasCombo = effectivePrice < item.price
                return (
                  <li key={item.productId} className="flex gap-3">
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
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-gray-500 transition-colors hover:text-[#1E1E1E]"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="w-7 text-center text-xs font-black text-[#1E1E1E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-gray-500 transition-colors hover:text-[#1E1E1E]"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-xs font-semibold text-red-400 transition-colors hover:text-red-600"
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
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">Subtotal</span>
              <span className="text-lg font-black text-[#1E1E1E]">{fmt(getTotal())}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-2xl py-4 text-center text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#0eb1c3' }}
            >
              Ir al checkout
            </Link>
            <button
              onClick={onClose}
              className="mt-3 w-full rounded-2xl border border-gray-200 py-3.5 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
