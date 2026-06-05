'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getMesas, getPedidosActivos, getCategorias, getProductos, createPedido, updateEstadoPedido } from '@/lib/data'

import { Mesa, Pedido, EstadoPedido, Categoria, Producto } from '@/lib/types'
import PedidoCard from '@/components/PedidoCard'

type Vista = 'mesas' | 'pedidos' | 'nueva-comanda'

export default function ComanderoPage() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [vista, setVista] = useState<Vista>('mesas')
  const [mesaSel, setMesaSel] = useState<Mesa | null>(null)
  const [cat, setCat] = useState('')
  const [carrito, setCarrito] = useState<{ producto: Producto; qty: number }[]>([])
  const [enviando, setEnviando] = useState(false)
  const [hora, setHora] = useState(new Date())

  const cargarPedidos = useCallback(async () => {
    const data = await getPedidosActivos()
    setPedidos(data)
  }, [])

  useEffect(() => {
    Promise.all([getMesas(), getPedidosActivos(), getCategorias(), getProductos()])
      .then(([ms, ps, cats, prods]) => {
        setMesas(ms)
        setPedidos(ps)
        setCategorias(cats)
        setProductos(prods)
        if (cats.length) setCat(cats[0].id)
      })

    const interval = setInterval(cargarPedidos, 5000)
    return () => clearInterval(interval)
  }, [cargarPedidos])

  useEffect(() => {
    const t = setInterval(() => setHora(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const pedidosMesa = mesaSel
    ? pedidos.filter(p => p.mesa_id === mesaSel.id && !['entregado', 'cancelado'].includes(p.estado))
    : []

  const cambiarEstado = async (id: string, estado: EstadoPedido) => {
    await updateEstadoPedido(id, estado)
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
  }

  const agregarCarrito = (p: Producto) => {
    setCarrito(prev => {
      const found = prev.find(i => i.producto.id === p.id)
      return found
        ? prev.map(i => i.producto.id === p.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { producto: p, qty: 1 }]
    })
  }

  const enviarComanda = async () => {
    if (!mesaSel || carrito.length === 0) return
    setEnviando(true)
    try {
      const items = carrito.map(i => ({
        producto: i.producto,
        cantidad: i.qty,
        variante: undefined as undefined,
      }))
      await createPedido('mesa', items, { mesa_id: mesaSel.id })
      setCarrito([])
      await cargarPedidos()
      setVista('pedidos')
    } catch {
      alert('Error al enviar la comanda. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const productosFiltrados = productos.filter(p => p.disponible && p.categoria_id === cat)
  const totalCarrito = carrito.reduce((s, i) => s + (i.producto.variantes?.[0]?.precio ?? i.producto.precio) * i.qty, 0)
  const itemsCarrito = carrito.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 text-sm font-medium">← Admin</Link>
            <span className="font-black text-lg">🧑‍💼 Comandero</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setVista('mesas')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${vista === 'mesas' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'}`}>
              🪑 Mesas
            </button>
            <button onClick={() => { setMesaSel(null); setVista('pedidos') }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${vista === 'pedidos' && !mesaSel ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'}`}>
              📋 Pedidos
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">

        {/* MESAS */}
        {vista === 'mesas' && (
          <div>
            {/* Mesas */}
            {mesas.filter(m => m.tipo !== 'barra').length > 0 && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">🪑 Mesas</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                  {mesas.filter(m => m.tipo !== 'barra').map(mesa => {
                    const activos = pedidos.filter(
                      p => p.mesa_id === mesa.id && !['entregado', 'cancelado'].includes(p.estado)
                    ).length
                    return (
                      <button key={mesa.id}
                        onClick={() => { setMesaSel(mesa); setVista('pedidos') }}
                        className={`rounded-2xl p-4 flex flex-col items-center gap-1 border-2 transition-all ${
                          activos > 0 ? 'bg-accent/5 border-accent text-accent' :
                          mesa.estado === 'reservada' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                        <span className="text-2xl font-black">{mesa.numero}</span>
                        <span className="text-xs font-medium">{mesa.capacidad} pax</span>
                        {activos > 0 ? (
                          <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">
                            {activos} pedido{activos > 1 ? 's' : ''}
                          </span>
                        ) : mesa.estado === 'reservada' ? (
                          <span className="text-xs">Reservada</span>
                        ) : (
                          <span className="text-xs text-gray-400">Libre</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
            {/* Barra */}
            {mesas.filter(m => m.tipo === 'barra').length > 0 && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">🍺 Barra</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {mesas.filter(m => m.tipo === 'barra').map(mesa => {
                    const activos = pedidos.filter(
                      p => p.mesa_id === mesa.id && !['entregado', 'cancelado'].includes(p.estado)
                    ).length
                    return (
                      <button key={mesa.id}
                        onClick={() => { setMesaSel(mesa); setVista('pedidos') }}
                        className={`rounded-2xl p-4 flex flex-col items-center gap-1 border-2 transition-all ${
                          activos > 0 ? 'bg-blue-50 border-blue-400 text-blue-700' :
                          'bg-white border-blue-100 text-blue-500 hover:border-blue-300'
                        }`}>
                        <span className="text-xl">🍺</span>
                        <span className="text-xl font-black">{mesa.numero}</span>
                        {activos > 0 ? (
                          <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                            {activos} pedido{activos > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-xs text-blue-300">Libre</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* PEDIDOS */}
        {vista === 'pedidos' && (
          <div>
            {mesaSel ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => { setMesaSel(null); setVista('mesas') }} className="text-gray-400 text-sm font-medium">← Mesas</button>
                    <div>
                      <h2 className="font-black text-lg">
                        {mesaSel.tipo === 'barra' ? `🍺 Barra ${mesaSel.numero}` : `Mesa ${mesaSel.numero}`}
                      </h2>
                      <p className="text-sm text-gray-500">{pedidosMesa.length} pedido(s) activo(s)</p>
                    </div>
                  </div>
                  <button onClick={() => setVista('nueva-comanda')}
                    className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-accent-dark transition-colors">
                    + Comanda
                  </button>
                </div>
                {pedidosMesa.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-5xl mb-4">🍽️</p>
                    <p className="text-gray-500 mb-2 font-medium">Mesa libre</p>
                    <p className="text-gray-400 text-sm mb-6">No hay pedidos activos en esta mesa</p>
                    <button onClick={() => setVista('nueva-comanda')}
                      className="bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:bg-accent-dark transition-colors">
                      Abrir primera comanda
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidosMesa.map(p => <PedidoCard key={p.id} pedido={p} onEstado={cambiarEstado} hora={hora} />)}
                  </div>
                )}
              </>
            ) : (
              <div>
                <h2 className="font-black text-lg mb-4">Todos los pedidos activos</h2>
                {pedidos.filter(p => !['entregado', 'cancelado'].includes(p.estado)).length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="text-gray-500">Sin pedidos activos</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidos
                      .filter(p => !['entregado', 'cancelado'].includes(p.estado))
                      .map(p => <PedidoCard key={p.id} pedido={p} onEstado={cambiarEstado} hora={hora} />)
                    }
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* NUEVA COMANDA */}
        {vista === 'nueva-comanda' && (
          <div className="pb-28">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setVista('pedidos')} className="text-gray-400 text-sm font-medium">← Volver</button>
              <h2 className="font-black text-lg">
                Nueva comanda {mesaSel
                  ? `· ${mesaSel.tipo === 'barra' ? `🍺 Barra ${mesaSel.numero}` : `Mesa ${mesaSel.numero}`}`
                  : ''}
              </h2>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
              {categorias.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${cat === c.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {c.icono} {c.nombre}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {productosFiltrados.map(p => {
                const qty = carrito.find(i => i.producto.id === p.id)?.qty ?? 0
                const precio = p.variantes?.[0]?.precio ?? p.precio
                return (
                  <div key={p.id} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{p.nombre}</p>
                      <p className="text-accent text-sm font-bold">
                        {precio.toFixed(2)}€{p.variantes ? <span className="text-gray-400 font-normal text-xs"> +</span> : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {qty > 0 && (
                        <>
                          <button
                            onClick={() => setCarrito(prev =>
                              prev.map(i => i.producto.id === p.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0)
                            )}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-600 flex items-center justify-center font-bold active:scale-90 transition-transform">
                            −
                          </button>
                          <span className="w-5 text-center font-black text-sm">{qty}</span>
                        </>
                      )}
                      <button onClick={() => agregarCarrito(p)}
                        className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold active:scale-90 transition-transform">
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {vista === 'nueva-comanda' && carrito.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
          <div className="max-w-2xl mx-auto">
            <button onClick={enviarComanda} disabled={enviando}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-base shadow-xl hover:bg-accent-dark transition-colors flex items-center justify-between px-6 disabled:opacity-50">
              <span>{enviando ? 'Enviando...' : `Enviar comanda · ${itemsCarrito} item${itemsCarrito > 1 ? 's' : ''}`}</span>
              <span className="font-black">{totalCarrito.toFixed(2)}€</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
