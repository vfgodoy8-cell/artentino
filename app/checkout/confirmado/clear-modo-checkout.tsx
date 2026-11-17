'use client'

import { useEffect } from 'react'
import { useCart } from '@/app/context/cart-context'
import { MODO_CHECKOUT_DRAFT_KEY } from '@/app/lib/constants'

// Con MODO el carrito no se vacía antes de redirigir (el comprador puede volver sin pagar y
// reintentar) — se vacía acá, al volver por callbackSuccess.
export default function ClearModoCheckout() {
  const { items, clearCart } = useCart()

  useEffect(() => {
    if (items.length > 0) clearCart()
    try {
      sessionStorage.removeItem(MODO_CHECKOUT_DRAFT_KEY)
    } catch {}
  }, [items.length, clearCart])

  return null
}
