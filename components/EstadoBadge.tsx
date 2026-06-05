import { EstadoPedido } from '@/lib/types'

const cfg: Record<EstadoPedido, { label: string; cls: string }> = {
  pendiente:      { label: 'Pendiente',    cls: 'bg-yellow-100 text-yellow-800' },
  confirmado:     { label: 'Confirmado',   cls: 'bg-blue-100 text-blue-800' },
  en_preparacion: { label: 'En cocina',    cls: 'bg-orange-100 text-orange-800' },
  listo:          { label: '✓ Listo',      cls: 'bg-green-100 text-green-800' },
  entregado:      { label: 'Entregado',    cls: 'bg-gray-100 text-gray-500' },
  cancelado:      { label: 'Cancelado',    cls: 'bg-red-100 text-red-700' },
}

export default function EstadoBadge({ estado }: { estado: EstadoPedido }) {
  const entry = cfg[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${entry.cls}`}>
      {entry.label}
    </span>
  )
}
