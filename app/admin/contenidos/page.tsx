'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'
import { getContenidos, createContenido, updateContenido, deleteContenido } from '@/lib/data'
import { Contenido, ContenidoTipo } from '@/lib/types'

const TIPO_INFO: Record<ContenidoTipo, { label: string; icono: string }> = {
  sorteo: { label: 'Sorteos', icono: '🎁' },
  promocion: { label: 'Promociones', icono: '🏷️' },
}

function ContenidosContent() {
  const [tipo, setTipo] = useState<ContenidoTipo>('sorteo')
  const [items, setItems] = useState<Contenido[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titulo: '', descripcion: '', enlace: '' })
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  const cargar = (t: ContenidoTipo) => {
    setLoading(true)
    getContenidos(t, false).then(data => { setItems(data); setLoading(false) })
  }

  useEffect(() => { cargar(tipo) }, [tipo])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!form.titulo.trim()) { setFormError('El título es obligatorio'); return }
    setCreating(true)
    const res = await createContenido({ tipo, ...form })
    if (res.ok) {
      setForm({ titulo: '', descripcion: '', enlace: '' })
      setShowForm(false)
      cargar(tipo)
    } else {
      setFormError(res.error ?? 'Error al crear')
    }
    setCreating(false)
  }

  const toggleActivo = async (item: Contenido) => {
    await updateContenido(item.id, { activo: !item.activo })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, activo: !i.activo } : i))
  }

  const handleDelete = async (item: Contenido) => {
    if (!confirm(`¿Eliminar "${item.titulo}"?`)) return
    await deleteContenido(item.id)
    setItems(prev => prev.filter(i => i.id !== item.id))
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 text-sm font-medium">← Admin</Link>
            <span className="font-black text-lg">Sorteos y promociones</span>
          </div>
          <button onClick={() => { setShowForm(v => !v); setFormError('') }}
            className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors">
            + Nuevo
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-6">
        <div className="flex gap-2 mb-6">
          {(Object.keys(TIPO_INFO) as ContenidoTipo[]).map(t => (
            <button key={t} onClick={() => setTipo(t)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tipo === t ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              <span>{TIPO_INFO[t].icono}</span> {TIPO_INFO[t].label}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
            <h3 className="font-bold mb-5">Nuevo {TIPO_INFO[tipo].label.toLowerCase().slice(0, -1)}</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">Título *</label>
                <input type="text" required value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ej: Sorteo de verano"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">Descripción</label>
                <textarea value={form.descripcion} rows={3}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Condiciones, premio, fechas..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">Enlace (opcional)</label>
                <input type="url" value={form.enlace}
                  onChange={e => setForm(f => ({ ...f, enlace: e.target.value }))}
                  placeholder="https://instagram.com/p/..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent" />
              </div>

              {formError && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{formError}</p>}

              <div className="flex gap-3">
                <button type="submit" disabled={creating}
                  className="bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 transition-colors">
                  {creating ? 'Creando...' : 'Crear'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm">Cargando...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">{TIPO_INFO[tipo].icono}</p>
            <p className="text-gray-500 font-medium mb-5">Todavía no hay {TIPO_INFO[tipo].label.toLowerCase()}</p>
            <button onClick={() => setShowForm(true)}
              className="bg-accent text-white px-6 py-3 rounded-2xl font-semibold hover:bg-accent-dark transition-colors">
              + Crear el primero
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {items.map(item => (
              <div key={item.id} className="flex flex-wrap items-start gap-x-4 gap-y-2 px-5 py-4">
                <div className="flex-1 min-w-[180px]">
                  <p className="font-bold text-sm">{item.titulo}</p>
                  {item.descripcion && <p className="text-xs text-gray-500 mt-0.5 whitespace-pre-line">{item.descripcion}</p>}
                  {item.enlace && <p className="text-xs text-accent mt-0.5 truncate">{item.enlace}</p>}
                </div>
                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                  <button onClick={() => toggleActivo(item)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors ${
                      item.activo ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    {item.activo ? 'Activo' : 'Oculto'}
                  </button>
                  <button onClick={() => handleDelete(item)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex-shrink-0">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function ContenidosPage() {
  return <AdminGuard><ContenidosContent /></AdminGuard>
}
