'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'
import { getMesas, updateMesaEstado, createMesa, deleteMesa } from '@/lib/data'
import { Mesa } from '@/lib/types'

function makeQrUrl(url: string, size = 140) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=f9fafb&color=111827`
}

const LABEL: Record<Mesa['tipo'], { singular: string; icono: string }> = {
  mesa:  { singular: 'Mesa',  icono: '🪑' },
  barra: { singular: 'Barra', icono: '🍺' },
}

function AdminMesasContent() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [baseUrl, setBaseUrl] = useState('')
  const [mesaQR, setMesaQR] = useState<Mesa | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ numero: '', capacidad: '4', tipo: 'mesa' as 'mesa' | 'barra' })
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
    getMesas().then(setMesas)
  }, [])

  const mesas_ = mesas.filter(m => m.tipo === 'mesa')
  const barras = mesas.filter(m => m.tipo === 'barra')

  const toggleEstado = async (mesa: Mesa) => {
    const nuevoEstado: Mesa['estado'] = mesa.estado === 'libre' ? 'ocupada' : 'libre'
    await updateMesaEstado(mesa.id, nuevoEstado)
    setMesas(prev => prev.map(m => m.id === mesa.id ? { ...m, estado: nuevoEstado } : m))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    const num = parseInt(form.numero)
    if (!num || num < 1) { setFormError('Número inválido'); return }
    setCreating(true)
    const res = await createMesa(num, parseInt(form.capacidad) || 4, form.tipo)
    if (res.ok) {
      const updated = await getMesas()
      setMesas(updated)
      setForm({ numero: '', capacidad: '4', tipo: 'mesa' })
      setShowForm(false)
    } else {
      setFormError(res.error ?? 'Error al crear')
    }
    setCreating(false)
  }

  const handleDelete = async (mesa: Mesa) => {
    const label = `${LABEL[mesa.tipo].singular} ${mesa.numero}`
    if (!confirm(`¿Eliminar ${label}? Se perderá el QR asociado.`)) return
    await deleteMesa(mesa.id)
    setMesas(prev => prev.filter(m => m.id !== mesa.id))
  }

  const descargarQR = (mesa: Mesa) => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`${baseUrl}/mesa/${mesa.id}`)}&format=png`
    window.open(url, '_blank')
  }

  const estadoColor: Record<Mesa['estado'], string> = {
    libre:     'bg-green-50 text-green-700 border-green-200',
    ocupada:   'bg-accent/10 text-accent border-accent/30',
    reservada: 'bg-blue-50 text-blue-700 border-blue-200',
  }

  const renderGroup = (grupo: Mesa[], titulo: string, icono: string) => {
    if (grupo.length === 0) return null
    return (
      <div className="mb-10">
        <h2 className="font-black text-lg mb-4">{icono} {titulo}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grupo.map(mesa => {
            const mesaUrl = `${baseUrl}/mesa/${mesa.id}`
            const { singular } = LABEL[mesa.tipo]
            return (
              <div key={mesa.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black">{singular} {mesa.numero}</h3>
                    <p className="text-sm text-gray-500">{mesa.capacidad} personas</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${estadoColor[mesa.estado]}`}>
                    {mesa.estado}
                  </span>
                </div>

                {baseUrl && (
                  <div className="flex flex-col items-center bg-gray-50 rounded-xl p-4 mb-4">
                    <img src={makeQrUrl(mesaUrl, 140)} alt={`QR ${singular} ${mesa.numero}`} width={140} height={140} />
                    <p className="text-xs text-gray-400 mt-2 text-center break-all">{mesaUrl}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => descargarQR(mesa)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                    ↓ QR
                  </button>
                  <button onClick={() => setMesaQR(mesa)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                    🔍 Ver QR
                  </button>
                  <button onClick={() => toggleEstado(mesa)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      mesa.estado === 'libre' ? 'bg-accent text-white hover:bg-accent-dark' : 'bg-green-500 text-white hover:bg-green-600'
                    }`}>
                    {mesa.estado === 'libre' ? 'Ocupar' : 'Liberar'}
                  </button>
                  <button onClick={() => handleDelete(mesa)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 text-sm font-medium">← Admin</Link>
            <span className="font-black text-lg">Gestión de Mesas</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3 text-xs text-gray-500 font-medium">
              <span>🟢 {mesas.filter(m => m.estado === 'libre').length} libres</span>
              <span>🟠 {mesas.filter(m => m.estado === 'ocupada').length} ocupadas</span>
            </div>
            <button onClick={() => { setShowForm(v => !v); setFormError('') }}
              className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors">
              + Nueva
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">

        {/* Formulario creación */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
            <h3 className="font-bold mb-5">Añadir mesa o barra</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Tipo */}
              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-500">Tipo</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['mesa', 'barra'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setForm(f => ({ ...f, tipo: t }))}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
                        form.tipo === t ? 'border-accent bg-accent/5 text-accent' : 'border-gray-200 text-gray-600'
                      }`}>
                      <span className="text-2xl">{LABEL[t].icono}</span>
                      <div className="text-left">
                        <p className="font-bold">{LABEL[t].singular}</p>
                        <p className="text-xs font-normal text-gray-400">
                          {t === 'mesa' ? 'Mesa con QR para pedir' : 'Barra o mostrador'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">
                    Número *
                  </label>
                  <input
                    type="number" min="1" required value={form.numero}
                    onChange={e => setForm(f => ({ ...f, numero: e.target.value }))}
                    placeholder="Ej: 13"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Capacidad (personas)</label>
                  <input
                    type="number" min="1" value={form.capacidad}
                    onChange={e => setForm(f => ({ ...f, capacidad: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{formError}</p>
              )}

              <div className="flex gap-3">
                <button type="submit" disabled={creating}
                  className="bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 transition-colors">
                  {creating ? 'Creando...' : `Crear ${LABEL[form.tipo].singular}`}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {renderGroup(mesas_, 'Mesas', '🪑')}
        {renderGroup(barras, 'Barra', '🍺')}

        {mesas.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🪑</p>
            <p className="text-gray-500 font-medium mb-5">Sin mesas configuradas</p>
            <button onClick={() => setShowForm(true)}
              className="bg-accent text-white px-6 py-3 rounded-2xl font-semibold hover:bg-accent-dark transition-colors">
              + Crear primera mesa
            </button>
          </div>
        )}
      </main>

      {/* Modal QR */}
      {mesaQR && baseUrl && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={() => setMesaQR(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-1">
              {LABEL[mesaQR.tipo].singular} {mesaQR.numero}
            </h2>
            <p className="text-gray-500 text-sm mb-6">Escanea para pedir</p>
            <div className="flex justify-center mb-4">
              <img src={makeQrUrl(`${baseUrl}/mesa/${mesaQR.id}`, 220)}
                alt="QR" width={220} height={220} />
            </div>
            <p className="text-xs text-gray-400 mb-6 break-all">{baseUrl}/mesa/{mesaQR.id}</p>
            <div className="flex gap-3">
              <button onClick={() => descargarQR(mesaQR)}
                className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-dark transition-colors">
                Descargar QR
              </button>
              <button onClick={() => setMesaQR(null)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminMesasPage() {
  return <AdminGuard><AdminMesasContent /></AdminGuard>
}
