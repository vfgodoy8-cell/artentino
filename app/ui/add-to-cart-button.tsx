'use client'

import { useState } from 'react'
import { useCart } from '@/app/context/cart-context'

type Props = {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  disabled?: boolean
  size?: 'sm' | 'lg'
}

export default function AddToCartButton({
  productId,
  name,
  price,
  imageUrl,
  disabled,
  size = 'sm',
}: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem({ productId, name, price, imageUrl })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  if (size === 'lg') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className="mt-8 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-all disabled:opacity-40"
        style={{ backgroundColor: added ? '#1E1E1E' : '#2BBCB0' }}
      >
        {disabled ? 'Sin stock' : added ? '¡Agregado!' : 'Agregar al carrito'}
      </button>
    )
  }

  const bgClass = added ? 'bg-[#1E1E1E]' : 'bg-[#1E1E1E] hover:bg-[#2BBCB0]'
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`mt-4 w-full rounded-xl py-3 text-xs font-black uppercase tracking-widest text-white transition-colors duration-200 disabled:opacity-40 ${bgClass}`}
    >
      {added ? '¡Agregado!' : 'Agregar'}
    </button>
  )
}
