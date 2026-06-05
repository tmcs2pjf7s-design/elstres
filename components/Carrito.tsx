'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

interface Props {
  onConfirmar: (notas: string) => void
  loading?: boolean
}

export default function Carrito({ onConfirmar, loading }: Props) {
  const { items, updateQty, total, count } = useCart()
  const [open, setOpen] = useState(false)
  const [notas, setNotas] = useState('')

  if (count === 0) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-accent text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-semibold hover:bg-accent-dark transition-colors"
      >
        <span className="bg-white text-accent text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
        Ver pedido
        <span className="font-bold">{total.toFixed(2)}€</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-lg font-bold">Tu pedido</h2>
            <button onClick={() => setOpen(false)} className="text-gray-400 text-3xl leading-none">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.map(item => {
              const precio = Number(item.variante?.precio ?? item.producto.precio)
              const key = item.variante ? `${item.producto.id}-${item.variante.nombre}` : item.producto.id
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {item.producto.nombre}
                      {item.variante && (
                        <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-normal">
                          {item.variante.nombre}
                        </span>
                      )}
                    </p>
                    <p className="text-accent text-sm font-semibold">
                      {(precio * item.cantidad).toFixed(2)}€
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.producto.id, item.cantidad - 1, item.variante)}
                      className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 flex items-center justify-center font-bold text-lg"
                    >−</button>
                    <span className="w-5 text-center font-semibold">{item.cantidad}</span>
                    <button
                      onClick={() => updateQty(item.producto.id, item.cantidad + 1, item.variante)}
                      className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg"
                    >+</button>
                  </div>
                </div>
              )
            })}

            <div className="pt-2">
              <textarea
                value={notas}
                onChange={e => setNotas(e.target.value)}
                placeholder="Alergias, peticiones especiales..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-accent"
                rows={3}
              />
            </div>
          </div>

          <div className="px-5 py-4 border-t">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            <button
              onClick={() => { onConfirmar(notas); setOpen(false) }}
              disabled={loading}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Confirmar pedido'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
