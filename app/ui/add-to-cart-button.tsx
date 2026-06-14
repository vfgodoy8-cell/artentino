'use client'

import { useState } from 'react'
import { useCart, type ComboPrice } from '@/app/context/cart-context'

type Props = {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  comboPrices?: ComboPrice[]
  disabled?: boolean
  size?: 'sm' | 'lg'
}

// Shared transition for the crossfading content spans
const contentTransition =
  'transition-[opacity,transform] duration-[150ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]'

export default function AddToCartButton({
  productId,
  name,
  price,
  imageUrl,
  comboPrices,
  disabled,
  size = 'sm',
}: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem({ productId, name, price, imageUrl, comboPrices })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (size === 'lg') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`relative mt-8 w-full overflow-hidden rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white
          transition-[transform,background-color] duration-[180ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]
          active:scale-[0.97] disabled:opacity-40
          ${added ? 'bg-[#1E1E1E]' : 'bg-[#0eb1c3] hover:bg-[#0ca3b4]'}`}
      >
        {/* Default label */}
        <span
          aria-hidden={added ? true : undefined}
          className={`flex items-center justify-center gap-2 ${contentTransition} ${
            added ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {disabled ? 'Sin stock' : 'Agregar al carrito'}
        </span>

        {/* Confirmed label */}
        <span
          aria-hidden={!added ? true : undefined}
          className={`absolute inset-0 flex items-center justify-center gap-2 ${contentTransition} ${
            added ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <CheckIcon size={14} />
          Agregado
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative mt-4 w-full overflow-hidden rounded-xl py-3 text-xs font-black uppercase tracking-widest text-white
        transition-[transform,background-color] duration-[180ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]
        active:scale-[0.97] disabled:opacity-40
        ${added ? 'bg-[#1E1E1E]' : 'bg-[#1E1E1E] hover:bg-[#0eb1c3]'}`}
    >
      {/* Default label */}
      <span
        aria-hidden={added ? true : undefined}
        className={`flex items-center justify-center ${contentTransition} ${
          added ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        Agregar
      </span>

      {/* Confirmed label */}
      <span
        aria-hidden={!added ? true : undefined}
        className={`absolute inset-0 flex items-center justify-center gap-1.5 ${contentTransition} ${
          added ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <CheckIcon size={10} />
        Agregado
      </span>
    </button>
  )
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
