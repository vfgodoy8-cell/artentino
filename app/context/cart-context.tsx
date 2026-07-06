'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type ComboPrice = {
  id: string
  quantity: number
  price: number
  startDate: string | null
  endDate: string | null
}

export type CartItem = {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  quantity: number
  comboPrices?: ComboPrice[]
  attributeValueId?: string
}

export function getEffectivePrice(item: CartItem): number {
  if (!item.comboPrices || item.comboPrices.length === 0) return item.price
  const now = new Date()
  const applicable = item.comboPrices
    .filter((c) => {
      if (item.quantity < c.quantity) return false
      if (c.startDate && new Date(c.startDate) > now) return false
      if (c.endDate && new Date(c.endDate) < now) return false
      return true
    })
    .sort((a, b) => b.quantity - a.quantity)
  return applicable.length > 0 ? applicable[0].price : item.price
}

// Stable key for deduplication — same product + same variant = same cart line
export function cartItemKey(item: Pick<CartItem, 'productId' | 'attributeValueId'>): string {
  return `${item.productId}:${item.attributeValueId ?? ''}`
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (productId: string, attributeValueId?: string) => void
  updateQuantity: (productId: string, quantity: number, attributeValueId?: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  addCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [addCount, setAddCount] = useState(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('artentino-cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem('artentino-cart', JSON.stringify(items))
  }, [items, hydrated])

  function addItem(product: Omit<CartItem, 'quantity'>, qty = 1) {
    setAddCount((n) => n + 1)
    setItems((prev) => {
      const key = cartItemKey(product)
      const existing = prev.find((i) => cartItemKey(i) === key)
      if (existing) {
        return prev.map((i) =>
          cartItemKey(i) === key ? { ...i, quantity: i.quantity + qty } : i,
        )
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }

  function removeItem(productId: string, attributeValueId?: string) {
    const key = cartItemKey({ productId, attributeValueId })
    setItems((prev) => prev.filter((i) => cartItemKey(i) !== key))
  }

  function updateQuantity(productId: string, quantity: number, attributeValueId?: string) {
    const key = cartItemKey({ productId, attributeValueId })
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => cartItemKey(i) !== key))
      return
    }
    setItems((prev) =>
      prev.map((i) => (cartItemKey(i) === key ? { ...i, quantity } : i)),
    )
  }

  function clearCart() {
    setItems([])
  }

  function getTotal() {
    return items.reduce((acc, i) => acc + getEffectivePrice(i) * i.quantity, 0)
  }

  function getItemCount() {
    return items.reduce((acc, i) => acc + i.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount, addCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
