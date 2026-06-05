'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'
import EstadoBadge from '@/components/EstadoBadge'
import { EstadoPedido } from '@/lib/types'

interface ResumenDia {
  total_pedidos: number
  entregados: number
  cancelados: number
  activos: number
  ingresos: number
  ingresos_cobrados: number
  por_tipo: { mesa: number; llevar: number }
}

interface PedidoHistorial {
  id: string
  numero_orden: number
  tipo: 'mesa' | 'llevar'
  estado: EstadoPedido
  total: number
  cliente_nombre?: string
  notas?: string
  created_at: string
  mesa?: { id: string; numero: number; tipo: string }
  items: { cantidad: number; precio: number; notas?: string; producto?: { nombre: string } }[]
}

function HistorialContent() {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [pedidos, setPedidos] = useState<PedidoHistorial[]>([])
  const [resumen, setResumen] = useState<ResumenDia | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<string>('todos')
  const [expandido, setExpandido] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/data/historial?fecha=${fecha}`)
      .then(r => r.json())
      .then(data => {
        setPedidos(data.pedidos ?? [])
        setResumen(data.resumen ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [fecha])

  const filtrados = filtro === 'todos' ? pedidos : pedidos.filter(p => p.estado === filtro)

  const hora = (iso: string) => new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 text-sm font-medium">← Admin</Link>
            <span className="font-black text-lg">📊 Historial</span>
          </div>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">

        {/* ── RESUMEN DEL DÍA ──────────────────────────────────── */}
        {resumen && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl mb-1">📋</p>
              <p className="text-2xl font-black text-gray-900">{resumen.total_pedidos}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Pedidos totales</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 shadow-sm">
              <p className="text-2xl mb-1">💶</p>
              <p className="text-2xl font-black text-green-700">{resumen.ingresos_cobrados.toFixed(2)}€</p>
              <p className="text-xs text-green-600 font-medium mt-0.5">Cobrado ({resumen.entregados} entregados)</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 shadow-sm">
              <p className="text-2xl mb-1">💰</p>
              <p className="text-2xl font-black text-blue-700">{resumen.ingresos.toFixed(2)}€</p>
              <p className="text-xs text-blue-600 font-medium mt-0.5">Total facturado</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 shadow-sm">
              <p className="text-2xl mb-1">⚡</p>
              <p className="text-2xl font-black text-orange-700">{resumen.activos}</p>
              <p className="text-xs text-orange-600 font-medium mt-0.5">En curso ahora</p>
            </div>
          </div>
        )}

        {/* Desglose mesa vs llevar */}
        {resumen && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">🪑</span>
              <div>
                <p className="font-black text-lg">{resumen.por_tipo.mesa}</p>
                <p className="text-xs text-gray-500">En mesa</p>
              </div>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🛵</span>
              <div>
                <p className="font-black text-lg">{resumen.por_tipo.llevar}</p>
                <p className="text-xs text-gray-500">Para llevar</p>
              </div>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex items-center gap-2">
              <span className="text-lg">❌</span>
              <div>
                <p className="font-black text-lg text-red-500">{resumen.cancelados}</p>
                <p className="text-xs text-gray-500">Cancelados</p>
              </div>
            </div>
          </div>
        )}

        {/* ── FILTROS ──────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
          {['todos', 'pendiente', 'confirmado', 'en_preparacion', 'listo', 'entregado', 'cancelado'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                filtro === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {f === 'todos' ? `Todos (${pedidos.length})` : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* ── LISTADO PEDIDOS ──────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500">No hay pedidos para este filtro</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Hora</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 hidden sm:table-cell">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Estado</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <>
                    <tr key={p.id}
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${p.estado === 'cancelado' ? 'opacity-50' : ''}`}
                      onClick={() => setExpandido(expandido === p.id ? null : p.id)}>
                      <td className="px-4 py-3 font-bold">#{p.numero_orden}</td>
                      <td className="px-4 py-3 text-gray-500 tabular-nums">{hora(p.created_at)}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.tipo === 'mesa'
                          ? `${p.mesa?.tipo === 'barra' ? '🍺' : '🪑'} ${p.mesa?.tipo === 'barra' ? 'Barra' : 'Mesa'} ${p.mesa?.numero ?? '?'}`
                          : '🛵 Llevar'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.cliente_nombre ?? '—'}</td>
                      <td className="px-4 py-3"><EstadoBadge estado={p.estado} /></td>
                      <td className="px-4 py-3 text-right font-bold text-accent">{p.total.toFixed(2)}€</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{expandido === p.id ? '▲' : '▼'}</td>
                    </tr>
                    {expandido === p.id && (
                      <tr key={`${p.id}-detail`} className="bg-gray-50 border-b border-gray-100">
                        <td colSpan={7} className="px-4 py-3">
                          <ul className="space-y-1">
                            {p.items.map((item, i) => (
                              <li key={i} className="flex justify-between text-xs text-gray-600">
                                <span><span className="font-bold">{item.cantidad}×</span> {item.producto?.nombre ?? '—'}{item.notas && <span className="text-gray-400 ml-1">({item.notas})</span>}</span>
                                <span>{(item.precio * item.cantidad).toFixed(2)}€</span>
                              </li>
                            ))}
                          </ul>
                          {p.notas && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 mt-2">📝 {p.notas}</p>}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default function HistorialPage() {
  return <AdminGuard><HistorialContent /></AdminGuard>
}
