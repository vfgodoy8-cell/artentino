'use client'

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/app/context/cart-context'
import { getFirstRelatedProduct } from '@/app/actions/get-related-product'

type Related = {
  id: string
  name: string
  imageUrl: string | null
  price: number
  slug: string
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

function fmtCountdown(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function CartAddPopup({ onOpenCart }: { onOpenCart: () => void }) {
  const { addCount, lastAdded, addItem, getItemCount, getTotal } = useCart()
  const [open, setOpen] = useState(false)
  const [related, setRelated] = useState<Related | null>(null)
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [countdown, setCountdown] = useState(300)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const suppressRef = useRef(false)

  // Open popup on each addItem, unless suppressed (related-product add)
  useEffect(() => {
    if (addCount === 0 || !lastAdded) return
    if (suppressRef.current) {
      suppressRef.current = false
      return
    }
    setOpen(true)
    setRelated(null)
    setCountdown(300)
    setLoadingRelated(true)
    getFirstRelatedProduct(lastAdded.productId).then((res) => {
      setRelated(res)
      setLoadingRelated(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addCount])

  // Countdown — only runs when popup is open and there's a related product
  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!open || !related) return
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [open, related?.id])

  function close() {
    setOpen(false)
    clearInterval(intervalRef.current)
  }

  function handleViewCart() {
    close()
    onOpenCart()
  }

  function handleAddRelated() {
    if (!related) return
    suppressRef.current = true
    addItem({ productId: related.id, name: related.name, price: related.price, imageUrl: related.imageUrl })
    close()
  }

  if (!open || !lastAdded) return null

  const resolved = !loadingRelated

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[8vh] sm:pt-[12vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" onClick={close} />

      {/* Panel */}
      <div className="animate-popup-in relative z-10 mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0eb1c3]/10">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0eb1c3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="flex-1 text-sm font-black text-[#1E1E1E]">Producto añadido al carrito</p>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#1E1E1E]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Added product card */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {lastAdded.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lastAdded.imageUrl} alt={lastAdded.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-bold leading-snug text-[#1E1E1E]">{lastAdded.name}</p>
            <p className="mt-1 text-xs text-gray-400">
              {lastAdded.addedQty} × {fmt(lastAdded.price)}
            </p>
          </div>
        </div>

        {/* Related section — only once loading is done */}
        {resolved && related && (
          <>
            <div className="border-t border-gray-100 px-5 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <p className="flex-1 text-xs font-black uppercase tracking-wider text-[#1E1E1E]">
                  Completá tu pedido
                </p>
                {countdown > 0 && (
                  <span className="rounded-full bg-[#0eb1c3]/10 px-2.5 py-0.5 font-mono text-[11px] font-black text-[#0eb1c3]">
                    {fmtCountdown(countdown)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#f9fafb] px-3 py-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm">
                  {related.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={related.imageUrl} alt={related.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-100" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-bold text-[#1E1E1E]">{related.name}</p>
                  <p className="text-xs font-black text-[#0eb1c3]">{fmt(related.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRelated}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0eb1c3] text-white transition-colors hover:bg-[#0a8f9e] active:scale-95"
                  title="Agregar al carrito"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-5 py-4">
              <button
                type="button"
                onClick={handleViewCart}
                className="h-10 w-full rounded-xl bg-[#0eb1c3] text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#0a8f9e]"
              >
                Ver carrito
              </button>
              <button
                type="button"
                onClick={close}
                className="h-9 w-full text-xs font-bold text-gray-400 transition-colors hover:text-[#1E1E1E]"
              >
                Ignorar y continuar
              </button>
            </div>
          </>
        )}

        {/* Simple version — no related products */}
        {resolved && !related && (
          <>
            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {getItemCount()} producto{getItemCount() !== 1 ? 's' : ''} en el carrito
                </span>
                <span className="font-black text-[#1E1E1E]">{fmt(getTotal())}</span>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={handleViewCart}
                className="h-10 w-full rounded-xl bg-[#0eb1c3] text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#0a8f9e]"
              >
                Ver carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
