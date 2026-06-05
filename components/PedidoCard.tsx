'use client'
import { Pedido, EstadoPedido } from '@/lib/types'
import EstadoBadge from './EstadoBadge'

interface Props {
  pedido: Pedido
  onEstado?: (id: string, estado: EstadoPedido) => void
  hora?: Date
  dark?: boolean
}

const SIG: Partial<Record<EstadoPedido, { estado: EstadoPedido; label: string }>> = {
  pendiente:      { estado: 'en_preparacion', label: '▶ Iniciar'      },
  confirmado:     { estado: 'en_preparacion', label: '▶ Iniciar'      },
  en_preparacion: { estado: 'listo',          label: '✓ Marcar listo' },
  listo:          { estado: 'entregado',       label: '✓ Entregado'   },
}

export default function PedidoCard({ pedido, onEstado, hora = new Date(), dark = false }: Props) {
  const sig = SIG[pedido.estado]
  const mins = Math.floor((hora.getTime() - new Date(pedido.created_at).getTime()) / 60000)
  const urgente = pedido.estado === 'pendiente' && mins >= 5
  const total = (pedido.total ?? 0).toFixed(2)
  const esBarra = pedido.mesa?.tipo === 'barra'
  const mesaLabel = pedido.mesa ? `${esBarra ? '🍺 Barra' : 'Mesa'} ${pedido.mesa.numero}` : `Mesa ?`
  const tipo = pedido.tipo === 'mesa' ? mesaLabel : '🛵 Llevar'

  if (dark) {
    return (
      <div className={`rounded-2xl overflow-hidden border ${urgente ? 'border-red-400 shadow-lg shadow-red-900/20' : 'border-white/10'} bg-gray-800`}>
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl font-black shrink-0">#{pedido.numero_orden}</span>
            <span className="text-sm text-gray-400 truncate">{tipo}</span>
            {pedido.cliente_nombre && (
              <span className="text-xs text-gray-500 truncate hidden sm:block">· {pedido.cliente_nombre}</span>
            )}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${urgente ? 'bg-red-500/30 text-red-300 animate-pulse' : 'bg-white/10 text-gray-400'}`}>
            {mins}min
          </span>
        </div>

        <div className="p-3 space-y-1.5">
          {(pedido.items ?? []).map((item, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="font-black text-white shrink-0">{item.cantidad}×</span>
              <span className="text-gray-200 flex-1">{item.producto?.nombre ?? '—'}</span>
              {item.notas && <span className="text-gray-400 text-xs shrink-0">({item.notas})</span>}
            </div>
          ))}
          {pedido.notas && (
            <p className="text-xs text-yellow-300 bg-yellow-900/20 border border-yellow-700/30 rounded-lg px-3 py-2 mt-2">
              📝 {pedido.notas}
            </p>
          )}
        </div>

        <div className="px-3 pb-3 flex gap-2">
          {sig && onEstado && (
            <button onClick={() => onEstado(pedido.id, sig.estado)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-95 ${
                pedido.estado === 'pendiente' ? 'bg-red-500 hover:bg-red-400' :
                pedido.estado === 'en_preparacion' ? 'bg-green-500 hover:bg-green-400' :
                'bg-white/10 hover:bg-white/20'
              } text-white`}>
              {sig.label}
            </button>
          )}
          {onEstado && (
            <button onClick={() => onEstado(pedido.id, 'cancelado')}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-red-900/40 text-gray-500 hover:text-red-400 transition-colors">
              ✕
            </button>
          )}
        </div>
      </div>
    )
  }

  // Light mode — comandero / admin
  return (
    <div className={`bg-white rounded-2xl p-4 border-2 shadow-sm transition-all ${urgente ? 'border-red-400' : pedido.estado === 'listo' ? 'border-green-400' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl font-black">#{pedido.numero_orden}</span>
            {pedido.tipo === 'mesa' && pedido.mesa && (
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${
                pedido.mesa.tipo === 'barra'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {pedido.mesa.tipo === 'barra' ? '🍺' : '🪑'} {pedido.mesa.tipo === 'barra' ? 'Barra' : 'Mesa'} {pedido.mesa.numero}
              </span>
            )}
            {pedido.tipo === 'llevar' && (
              <span className="text-sm font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg">
                🛵 Llevar
              </span>
            )}
          </div>
          {pedido.cliente_nombre && <p className="text-sm text-gray-500 mt-0.5">{pedido.cliente_nombre}</p>}
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <EstadoBadge estado={pedido.estado} />
          <span className="text-xs text-gray-400">{mins} min</span>
        </div>
      </div>

      <ul className="space-y-1.5 mb-3">
        {(pedido.items ?? []).map((item, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>
              <span className="font-bold text-gray-900">{item.cantidad}×</span>
              {' '}<span className="text-gray-700">{item.producto?.nombre ?? '—'}</span>
              {item.notas && <span className="text-gray-400 text-xs ml-1">({item.notas})</span>}
            </span>
            <span className="text-gray-400">{(Number(item.precio ?? 0) * item.cantidad).toFixed(2)}€</span>
          </li>
        ))}
      </ul>

      {pedido.notas && (
        <p className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-xl px-3 py-2 mb-3">
          📝 {pedido.notas}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="font-bold text-gray-900">{total}€</span>
        {sig && onEstado && (
          <button onClick={() => onEstado(pedido.id, sig.estado)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              sig.estado === 'listo' ? 'bg-green-500 text-white hover:bg-green-600' :
              sig.estado === 'en_preparacion' ? 'bg-accent text-white hover:bg-accent-dark' :
              'bg-gray-800 text-white hover:bg-gray-900'
            }`}>
            {sig.label}
          </button>
        )}
      </div>
    </div>
  )
}
