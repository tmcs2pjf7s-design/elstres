'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategorias, getProductos } from '@/lib/data'
import { Categoria, Producto } from '@/lib/types'

export default function MenuPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cat, setCat] = useState('')

  useEffect(() => {
    Promise.all([getCategorias(), getProductos()]).then(([cats, prods]) => {
      setCategorias(cats)
      setProductos(prods)
      if (cats.length) setCat(cats[0].id)
    })
  }, [])

  const categoriasVisibles = categorias.filter(c => c.tipo !== 'suplemento')
  const filtrados = productos.filter(p => p.disponible && p.categoria_id === cat && (p as any).categoria_tipo !== 'suplemento')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-14 flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-900 font-medium text-sm p-1">← Inicio</Link>
            <span className="text-lg font-black">Menú</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-1 px-1">
            {categoriasVisibles.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${cat === c.id ? 'bg-accent text-white shadow-sm' : 'bg-gray-100 text-gray-600'}`}>
                <span>{c.icono}</span>
                <span>{c.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 pb-8">
        {cat === '' ? (
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 px-4 py-3.5 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg w-2/5" />
                  <div className="h-3 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-14 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="space-y-2">
          {filtrados.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 px-4 py-3.5">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{p.nombre}</h3>
                {p.descripcion && (
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-2 leading-relaxed">{p.descripcion}</p>
                )}
                {p.variantes ? (
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {p.variantes.map(v => (
                      <span key={v.nombre} className="text-xs bg-orange-50 text-accent px-2 py-0.5 rounded-lg font-semibold">
                        {v.nombre} {v.precio.toFixed(2)}€
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-accent font-black text-base mt-1">{p.precio.toFixed(2)}€</p>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </main>
    </div>
  )
}
