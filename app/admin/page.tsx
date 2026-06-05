'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getPedidosActivos, getProductos, getMesas } from '@/lib/data'
import { Pedido, Producto, Mesa } from '@/lib/types'
import AdminGuard from '@/components/AdminGuard'
import EstadoBadge from '@/components/EstadoBadge'

interface Stats {
  pedidos_hoy: number
  ingresos_hoy: number
  pedidos_activos: number
  mesas_ocupadas: number
  mesas_total: number
}

function AdminContent() {
  const [adminEmail, setAdminEmail] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setAdminEmail(localStorage.getItem('adminSession') ?? '')
    Promise.all([
      fetch('/api/data/stats').then(r => r.ok ? r.json() : null).catch(() => null),
      getPedidosActivos(),
      getProductos(),
      getMesas(),
    ]).then(([s, ps, prods, ms]) => {
      if (s) setStats(s)
      setPedidos(ps ?? [])
      setProductos(prods ?? [])
      setMesas(ms ?? [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.replace('/admin/login')
  }

  const statCards = stats
    ? [
        { label: 'Pedidos hoy',    value: stats.pedidos_hoy,                       icon: '📋', color: 'bg-blue-50 text-blue-700' },
        { label: 'Ingresos hoy',   value: `${(stats.ingresos_hoy ?? 0).toFixed(0)}€`,  icon: '💰', color: 'bg-green-50 text-green-700' },
        { label: 'Mesas ocupadas', value: `${stats.mesas_ocupadas}/${stats.mesas_total}`, icon: '🪑', color: 'bg-orange-50 text-orange-700' },
        { label: 'Pedidos activos',value: stats.pedidos_activos,                   icon: '⚡', color: 'bg-yellow-50 text-yellow-700' },
      ]
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 text-sm font-medium">← Inicio</Link>
            <span className="font-black text-xl">⚙️ Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/cocina" className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              👨‍🍳 Cocina
            </Link>
            <Link href="/comandero" className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              🧑‍💼 Comandero
            </Link>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              <span className="text-xs text-gray-400 hidden sm:block">{adminEmail}</span>
              <button onClick={handleLogout} className="text-sm bg-red-50 text-red-600 px-3 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors">
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl p-5 bg-gray-100 animate-pulse h-28" />
              ))
            : statCards.map(s => (
                <div key={s.label} className={`rounded-2xl p-5 ${s.color.split(' ')[0]} border border-current/10`}>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className={`text-3xl font-black ${s.color.split(' ')[1]}`}>{s.value}</div>
                  <div className="text-sm font-medium opacity-70 mt-1">{s.label}</div>
                </div>
              ))
          }
        </div>

        {/* Accesos rápidos */}
        <h2 className="font-black text-lg mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { href: '/cocina',           icon: '👨‍🍳', label: 'Cocina',      sub: 'Tiempo real' },
            { href: '/comandero',        icon: '🧑‍💼', label: 'Comandero',   sub: 'Gestión mesas' },
            { href: '/llevar',           icon: '🛵', label: 'Para llevar', sub: 'Hacer pedido' },
            { href: '/admin/historial',  icon: '📊', label: 'Historial',   sub: 'Cierre de caja' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow text-center">
              <span className="text-3xl">{a.icon}</span>
              <span className="font-semibold text-sm">{a.label}</span>
              <span className="text-gray-400 text-xs">{a.sub}</span>
            </Link>
          ))}
        </div>

        {/* Gestión */}
        <h2 className="font-black text-lg mb-4">Gestión</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link href="/admin/menu" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-2xl">🍽️</div>
            <div>
              <h3 className="font-bold">Gestión de Menú</h3>
              <p className="text-sm text-gray-500">{productos.length} productos · Añadir, editar o desactivar</p>
            </div>
          </Link>
          <Link href="/admin/mesas" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🪑</div>
            <div>
              <h3 className="font-bold">Gestión de Mesas</h3>
              <p className="text-sm text-gray-500">{mesas.length} mesas · Configurar y generar QR</p>
            </div>
          </Link>
          <Link href="/admin/impresoras" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl">🖨️</div>
            <div>
              <h3 className="font-bold">Impresoras</h3>
              <p className="text-sm text-gray-500">Conectar por WiFi · Cocina, barra, ticket</p>
            </div>
          </Link>
          <Link href="/admin/historial" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">📊</div>
            <div>
              <h3 className="font-bold">Historial y caja</h3>
              <p className="text-sm text-gray-500">Pedidos del día · Cierre de caja</p>
            </div>
          </Link>
        </div>

        {/* Pedidos activos */}
        <h2 className="font-black text-lg mb-4">Pedidos activos</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
          ) : pedidos.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-gray-500 text-sm">Sin pedidos activos ahora mismo</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">#</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Tipo</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 hidden sm:table-cell">Cliente</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Estado</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-bold">#{p.numero_orden}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {p.tipo === 'mesa' ? `Mesa ${p.mesa?.numero ?? '?'}` : '🛵 Llevar'}
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden sm:table-cell">{p.cliente_nombre ?? '—'}</td>
                    <td className="px-5 py-3"><EstadoBadge estado={p.estado} /></td>
                    <td className="px-5 py-3 text-right font-bold text-accent">{(p.total ?? 0).toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return <AdminGuard><AdminContent /></AdminGuard>
}
