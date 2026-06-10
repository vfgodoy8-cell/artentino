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

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

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
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.productId ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
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
      value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount }}
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
