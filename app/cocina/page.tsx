'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { getPedidosActivos, updateEstadoPedido, getImpresoras } from '@/lib/data'
import { Pedido, EstadoPedido, Impresora } from '@/lib/types'
import { imprimirPedido } from '@/lib/print'
import PedidoCard from '@/components/PedidoCard'

const COLS: { estado: EstadoPedido; label: string; color: string }[] = [
  { estado: 'confirmado',     label: '🔴 Nuevos',     color: 'border-red-500'    },
  { estado: 'en_preparacion', label: '🟡 Preparando', color: 'border-yellow-500' },
  { estado: 'listo',          label: '🟢 Listos',     color: 'border-green-500'  },
]

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    ;[0, 200].forEach(delay => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = 880
      const t = ctx.currentTime + delay / 1000
      gain.gain.setValueAtTime(0.4, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      osc.start(t); osc.stop(t + 0.3)
    })
  } catch {}
}

export default function CocinaPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [hora, setHora] = useState(new Date())
  const impresorasRef = useRef<Impresora[]>([])
  const idsConocidos = useRef<Set<string>>(new Set())
  const iniciado = useRef(false)

  const cargar = useCallback(async () => {
    const data = await getPedidosActivos()
    setPedidos(data)
    return data
  }, [])

  useEffect(() => {
    getImpresoras().then(imps => { impresorasRef.current = imps })

    cargar().then(data => {
      data.forEach(p => idsConocidos.current.add(p.id))
      iniciado.current = true
      setLoading(false)
    })

    const interval = setInterval(async () => {
      const nuevos = await getPedidosActivos()
      setPedidos(nuevos)
      if (iniciado.current) {
        for (const p of nuevos) {
          if (!idsConocidos.current.has(p.id) && p.estado === 'confirmado') {
            beep()
            imprimirPedido(p, impresorasRef.current)
          }
          idsConocidos.current.add(p.id)
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [cargar])

  useEffect(() => {
    const t = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const cambiarEstado = async (id: string, estado: EstadoPedido) => {
    const ok = await updateEstadoPedido(id, estado)
    if (ok) {
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
    } else {
      alert('No se pudo actualizar el pedido. Inténtalo de nuevo.')
    }
  }

  const pendientes = pedidos.filter(p => p.estado === 'confirmado').length

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Cargando pedidos...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="bg-gray-900 border-b border-white/10 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-white text-sm transition-colors">← Admin</Link>
          <span className="text-xl font-black">👨‍🍳 Cocina</span>
          {pendientes > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {pendientes} nuevo{pendientes > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => cargar()}
            className="text-gray-400 hover:text-white text-sm transition-colors px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg">
            ↻ Actualizar
          </button>
          <div className="text-right">
            <p className="text-xl font-black tabular-nums">
              {hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-gray-500 text-xs capitalize">
              {hora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-3 divide-x divide-white/10 overflow-hidden">
        {COLS.map(col => {
          const items = pedidos.filter(p => p.estado === col.estado)
          return (
            <div key={col.estado} className="flex flex-col overflow-hidden">
              <div className={`px-5 py-3 border-b-2 ${col.color} bg-white/5 flex items-center justify-between flex-shrink-0`}>
                <span className="font-bold text-sm">{col.label}</span>
                <span className="bg-white/10 text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {items.length === 0
                  ? <p className="text-gray-600 text-sm text-center py-12">Sin pedidos</p>
                  : items.map(p => <PedidoCard key={p.id} pedido={p} onEstado={cambiarEstado} hora={hora} dark />)
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
