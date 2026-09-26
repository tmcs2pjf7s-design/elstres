'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { getMesas, getPedidosActivos, getCategorias, getProductos, createPedido, updateEstadoPedido, updateMesaEstado } from '@/lib/data'
import { Mesa, Pedido, EstadoPedido, Categoria, Producto } from '@/lib/types'
import PedidoCard from '@/components/PedidoCard'

type Vista = 'mesas' | 'pedidos' | 'nueva-comanda' | 'cuenta'

function beep(freq: number, dur: number) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur)
  } catch {}
}

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
  const idsConocidos = useRef<Set<string>>(new Set())
  const estadosConocidos = useRef<Map<string, EstadoPedido>>(new Map())
  const iniciado = useRef(false)

  const cargarPedidos = useCallback(async () => {
    const data = await getPedidosActivos()
    setPedidos(data)
    return data
  }, [])

  useEffect(() => {
    Promise.all([getMesas(), getPedidosActivos(), getCategorias(), getProductos()])
      .then(([ms, ps, cats, prods]) => {
        setMesas(ms)
        setPedidos(ps)
        setCategorias(cats)
        setProductos(prods)
        if (cats.length) setCat(cats[0].id)
        ps.forEach(p => {
          idsConocidos.current.add(p.id)
          estadosConocidos.current.set(p.id, p.estado)
        })
        iniciado.current = true
      })

    const interval = setInterval(async () => {
      const nuevos = await getPedidosActivos()
      setPedidos(nuevos)
      if (iniciado.current) {
        for (const p of nuevos) {
          const estadoAnterior = estadosConocidos.current.get(p.id)
          // Nuevo pedido pendiente → beep de alerta
          if (!idsConocidos.current.has(p.id) && p.estado === 'pendiente') {
            beep(660, 0.4)
          }
          // Pedido que acaba de ser marcado LISTO → beep celebración
          if (estadoAnterior && estadoAnterior !== 'listo' && p.estado === 'listo') {
            beep(880, 0.2); setTimeout(() => beep(1100, 0.3), 200)
          }
          idsConocidos.current.add(p.id)
          estadosConocidos.current.set(p.id, p.estado)
        }
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [cargarPedidos])

  useEffect(() => {
    const t = setInterval(() => setHora(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const pendientesVerificar = pedidos.filter(p => p.estado === 'pendiente' && p.tipo === 'mesa')
  const listosEntregar = pedidos.filter(p => p.estado === 'listo')

  const pedidosMesa = mesaSel
    ? pedidos.filter(p => p.mesa_id === mesaSel.id && !['entregado', 'cancelado'].includes(p.estado))
    : []

  // Cuenta de mesa: todos los pedidos de hoy (incluido entregados) para calcular total
  const totalMesa = pedidosMesa.reduce((s, p) => s + Number(p.total ?? 0), 0)
  const itemsMesa = pedidosMesa.flatMap(p => p.items ?? [])

  const cambiarEstado = async (id: string, estado: EstadoPedido) => {
    const ok = await updateEstadoPedido(id, estado)
    if (ok) {
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
      estadosConocidos.current.set(id, estado)
    } else {
      alert('No se pudo actualizar el pedido. Inténtalo de nuevo.')
    }
    return ok
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
      const items = carrito.map(i => ({ producto: i.producto, cantidad: i.qty, variante: undefined as undefined }))
      await createPedido('mesa', items, { mesa_id: mesaSel.id })
      // El servidor marca la mesa como 'ocupada' al crear el pedido; reflejarlo también aquí
      setMesas(prev => prev.map(m => m.id === mesaSel.id ? { ...m, estado: 'ocupada' } : m))
      setCarrito([])
      await cargarPedidos()
      setVista('pedidos')
    } catch {
      alert('Error al enviar la comanda.')
    } finally {
      setEnviando(false)
    }
  }

  const productosFiltrados = productos.filter(p => p.disponible && p.categoria_id === cat)
  const totalCarrito = carrito.reduce((s, i) => s + Number(i.producto.variantes?.[0]?.precio ?? i.producto.precio) * i.qty, 0)
  const itemsCarrito = carrito.reduce((s, i) => s + i.qty, 0)

  const mesaLabel = (m: Mesa) => m.tipo === 'barra' ? `🍺 Barra ${m.numero}` : `Mesa ${m.numero}`

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

        {/* ── LISTOS PARA ENTREGAR ─────────────────────────────── */}
        {listosEntregar.length > 0 && (
          <div className="mb-4 bg-green-50 border-2 border-green-400 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-green-500">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">🔔</span>
                <span className="text-white font-black text-sm">
                  {listosEntregar.length} pedido{listosEntregar.length > 1 ? 's' : ''} listo{listosEntregar.length > 1 ? 's' : ''} para entregar
                </span>
              </div>
            </div>
            <div className="divide-y divide-green-100">
              {listosEntregar.map(p => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black">#{p.numero_orden}</span>
                    <span className="text-sm font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-lg">
                      {p.tipo === 'mesa' ? mesaLabel(p.mesa ?? { tipo: 'mesa', numero: 0, id: '', capacidad: 0, estado: 'libre' }) : '🛵 Llevar'}
                    </span>
                    {p.cliente_nombre && <span className="text-sm text-gray-500">{p.cliente_nombre}</span>}
                  </div>
                  <button onClick={() => cambiarEstado(p.id, 'entregado')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors active:scale-95 flex-shrink-0">
                    ✓ Entregado
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PENDIENTES DE VERIFICAR ──────────────────────────── */}
        {pendientesVerificar.length > 0 && (
          <div className="mb-4 bg-orange-50 border-2 border-orange-300 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-orange-500">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg animate-pulse">🔔</span>
                <span className="text-white font-black text-sm">
                  {pendientesVerificar.length} pedido{pendientesVerificar.length > 1 ? 's' : ''} esperando verificación
                </span>
              </div>
              <span className="text-orange-100 text-xs">Ir a la mesa y confirmar</span>
            </div>
            <div className="divide-y divide-orange-100">
              {pendientesVerificar.map(p => (
                <div key={p.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black">#{p.numero_orden}</span>
                        <span className="text-sm font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-lg">
                          {p.mesa?.tipo === 'barra' ? `🍺 Barra ${p.mesa?.numero}` : `🪑 Mesa ${p.mesa?.numero ?? '?'}`}
                        </span>
                      </div>
                      {p.cliente_nombre && <p className="text-sm text-gray-500 mt-0.5">{p.cliente_nombre}</p>}
                    </div>
                    <span className="text-sm font-bold text-orange-600">{Number(p.total ?? 0).toFixed(2)}€</span>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {(p.items ?? []).map((item, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span><span className="font-bold">{item.cantidad}×</span> {item.producto?.nombre ?? '—'}{item.notas && <span className="text-gray-400 text-xs ml-1">({item.notas})</span>}</span>
                        <span className="text-gray-400">{(Number(item.precio ?? 0) * item.cantidad).toFixed(2)}€</span>
                      </li>
                    ))}
                  </ul>
                  {p.notas && <p className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-xl px-3 py-2 mb-3">📝 {p.notas}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => cambiarEstado(p.id, 'confirmado')}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-95">
                      ✓ Verificar y enviar a cocina
                    </button>
                    <button onClick={() => cambiarEstado(p.id, 'cancelado')}
                      className="px-3 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MESAS ────────────────────────────────────────────── */}
        {vista === 'mesas' && (
          <div>
            {mesas.filter(m => m.tipo !== 'barra').length > 0 && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">🪑 Mesas</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                  {mesas.filter(m => m.tipo !== 'barra').map(mesa => {
                    const activos = pedidos.filter(p => p.mesa_id === mesa.id && !['entregado', 'cancelado'].includes(p.estado))
                    const tienePendiente = activos.some(p => p.estado === 'pendiente')
                    const tieneListo = activos.some(p => p.estado === 'listo')
                    return (
                      <button key={mesa.id} onClick={() => { setMesaSel(mesa); setVista('pedidos') }}
                        className={`rounded-2xl p-4 flex flex-col items-center gap-1 border-2 transition-all ${
                          tieneListo    ? 'bg-green-50 border-green-400 text-green-700' :
                          tienePendiente? 'bg-orange-50 border-orange-400 text-orange-700 animate-pulse' :
                          activos.length> 0 ? 'bg-accent/5 border-accent text-accent' :
                          mesa.estado === 'reservada' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                        <span className="text-2xl font-black">{mesa.numero}</span>
                        <span className="text-xs font-medium">{mesa.capacidad} pax</span>
                        {tieneListo ? (
                          <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">✓ Listo</span>
                        ) : tienePendiente ? (
                          <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold">⚡ Verificar</span>
                        ) : activos.length > 0 ? (
                          <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">{activos.length} pedido{activos.length > 1 ? 's' : ''}</span>
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
            {mesas.filter(m => m.tipo === 'barra').length > 0 && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">🍺 Barra</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {mesas.filter(m => m.tipo === 'barra').map(mesa => {
                    const activos = pedidos.filter(p => p.mesa_id === mesa.id && !['entregado', 'cancelado'].includes(p.estado))
                    const tieneListo = activos.some(p => p.estado === 'listo')
                    const tienePendiente = activos.some(p => p.estado === 'pendiente')
                    return (
                      <button key={mesa.id} onClick={() => { setMesaSel(mesa); setVista('pedidos') }}
                        className={`rounded-2xl p-4 flex flex-col items-center gap-1 border-2 transition-all ${
                          tieneListo ? 'bg-green-50 border-green-400 text-green-700' :
                          tienePendiente ? 'bg-orange-50 border-orange-400 text-orange-700 animate-pulse' :
                          activos.length > 0 ? 'bg-blue-50 border-blue-400 text-blue-700' :
                          'bg-white border-blue-100 text-blue-500 hover:border-blue-300'
                        }`}>
                        <span className="text-xl">🍺</span>
                        <span className="text-xl font-black">{mesa.numero}</span>
                        {tieneListo ? <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">✓ Listo</span>
                        : tienePendiente ? <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold">⚡ Verificar</span>
                        : activos.length > 0 ? <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-bold">{activos.length} pedido{activos.length > 1 ? 's' : ''}</span>
                        : <span className="text-xs text-blue-300">Libre</span>}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── PEDIDOS DE MESA ──────────────────────────────────── */}
        {vista === 'pedidos' && mesaSel && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button onClick={() => { setMesaSel(null); setVista('mesas') }} className="text-gray-400 text-sm font-medium">← Mesas</button>
                <div>
                  <h2 className="font-black text-lg">{mesaLabel(mesaSel)}</h2>
                  <p className="text-sm text-gray-500">{pedidosMesa.length} pedido(s) activo(s)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setVista('cuenta')}
                  className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors">
                  💶 Cuenta
                </button>
                <button onClick={() => setVista('nueva-comanda')}
                  className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-accent-dark transition-colors">
                  + Comanda
                </button>
              </div>
            </div>
            {pedidosMesa.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-4">🍽️</p>
                <p className="text-gray-500 mb-2 font-medium">Mesa libre</p>
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
          </div>
        )}

        {/* ── TODOS LOS PEDIDOS ────────────────────────────────── */}
        {vista === 'pedidos' && !mesaSel && (
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
                  .map(p => <PedidoCard key={p.id} pedido={p} onEstado={cambiarEstado} hora={hora} />)}
              </div>
            )}
          </div>
        )}

        {/* ── CUENTA DE MESA ───────────────────────────────────── */}
        {vista === 'cuenta' && mesaSel && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setVista('pedidos')} className="text-gray-400 text-sm font-medium">← Volver</button>
              <h2 className="font-black text-lg">Cuenta · {mesaLabel(mesaSel)}</h2>
            </div>

            {pedidosMesa.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-4xl mb-3">🍽️</p>
                <p className="text-gray-500">No hay pedidos activos en esta mesa</p>
              </div>
            ) : (
              <>
                {/* Desglose por pedido */}
                <div className="space-y-3 mb-4">
                  {pedidosMesa.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">Comanda #{p.numero_orden}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          p.estado === 'listo' ? 'bg-green-100 text-green-700' :
                          p.estado === 'en_preparacion' ? 'bg-orange-100 text-orange-700' :
                          p.estado === 'confirmado' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>{p.estado.replace('_', ' ')}</span>
                      </div>
                      <ul className="space-y-1 text-sm">
                        {(p.items ?? []).map((item, i) => (
                          <li key={i} className="flex justify-between text-gray-600">
                            <span><span className="font-medium">{item.cantidad}×</span> {item.producto?.nombre ?? '—'}</span>
                            <span>{(Number(item.precio ?? 0) * item.cantidad).toFixed(2)}€</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between font-semibold text-sm mt-2 pt-2 border-t border-gray-50">
                        <span>Subtotal</span>
                        <span>{Number(p.total ?? 0).toFixed(2)}€</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-gray-900 text-white rounded-2xl p-5 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xl">TOTAL MESA</span>
                    <span className="font-black text-3xl text-accent">{totalMesa.toFixed(2)}€</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{pedidosMesa.reduce((s, p) => s + (p.items?.length ?? 0), 0)} productos · {pedidosMesa.length} comanda{pedidosMesa.length > 1 ? 's' : ''}</p>
                </div>

                {/* Cerrar mesa */}
                <button
                  onClick={async () => {
                    if (!confirm(`¿Marcar toda la mesa ${mesaSel.numero} como pagada y liberar?`)) return
                    for (const p of pedidosMesa) {
                      if (p.estado !== 'cancelado') {
                        const ok = await cambiarEstado(p.id, 'entregado')
                        if (!ok) return
                      }
                    }
                    await updateMesaEstado(mesaSel.id, 'libre')
                    setMesas(prev => prev.map(m => m.id === mesaSel.id ? { ...m, estado: 'libre' } : m))
                    await cargarPedidos()
                    setVista('mesas')
                    setMesaSel(null)
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-lg transition-colors shadow-lg shadow-green-200">
                  💶 Cobrado · Liberar mesa
                </button>
              </>
            )}
          </div>
        )}

        {/* ── NUEVA COMANDA ────────────────────────────────────── */}
        {vista === 'nueva-comanda' && (
          <div className="pb-28">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setVista('pedidos')} className="text-gray-400 text-sm font-medium">← Volver</button>
              <h2 className="font-black text-lg">
                Nueva comanda {mesaSel ? `· ${mesaLabel(mesaSel)}` : ''}
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
                const precio = Number(p.variantes?.[0]?.precio ?? p.precio)
                return (
                  <div key={p.id} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{p.nombre}</p>
                      <p className="text-accent text-sm font-bold">
                        {precio.toFixed(2)}€{p.variantes ? <span className="text-gray-400 font-normal text-xs"> +vars</span> : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {qty > 0 && (
                        <>
                          <button onClick={() => setCarrito(prev => prev.map(i => i.producto.id === p.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0))}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-600 flex items-center justify-center font-bold active:scale-90 transition-transform">−</button>
                          <span className="w-5 text-center font-black text-sm">{qty}</span>
                        </>
                      )}
                      <button onClick={() => agregarCarrito(p)}
                        className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold active:scale-90 transition-transform">+</button>
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
              <span>{enviando ? 'Enviando...' : `Enviar · ${itemsCarrito} item${itemsCarrito > 1 ? 's' : ''}`}</span>
              <span className="font-black">{totalCarrito.toFixed(2)}€</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
