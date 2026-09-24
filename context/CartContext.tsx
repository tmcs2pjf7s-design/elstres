'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { CartItem, Producto, Variante } from '@/lib/types'

const cartKey = (productoId: string, variante?: Variante) =>
  variante ? `${productoId}-${variante.nombre}` : productoId

interface CartCtx {
  items: CartItem[]
  addItem: (p: Producto, variante?: Variante) => void
  removeItem: (productoId: string, variante?: Variante) => void
  updateQty: (productoId: string, qty: number, variante?: Variante) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartCtx | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (p: Producto, variante?: Variante) => {
    const key = cartKey(p.id, variante)
    setItems(prev => {
      const found = prev.find(i => cartKey(i.producto.id, i.variante) === key)
      return found
        ? prev.map(i => cartKey(i.producto.id, i.variante) === key ? { ...i, cantidad: i.cantidad + 1 } : i)
        : [...prev, { producto: p, cantidad: 1, variante }]
    })
  }

  const removeItem = (productoId: string, variante?: Variante) => {
    const key = cartKey(productoId, variante)
    setItems(prev => prev.filter(i => cartKey(i.producto.id, i.variante) !== key))
  }

  const updateQty = (productoId: string, qty: number, variante?: Variante) => {
    const key = cartKey(productoId, variante)
    setItems(prev => qty <= 0
      ? prev.filter(i => cartKey(i.producto.id, i.variante) !== key)
      : prev.map(i => cartKey(i.producto.id, i.variante) === key ? { ...i, cantidad: qty } : i)
    )
  }

  const clearCart = () => setItems([])

  const precioItem = (item: CartItem) =>
    (item.variante?.precio ?? item.producto.precio) * item.cantidad

  const total = items.reduce((s, i) => s + precioItem(i), 0)
  const count = items.reduce((s, i) => s + i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart outside CartProvider')
  return ctx
}
