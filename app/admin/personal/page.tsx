'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'
import { getPersonal, createPersonal, setPersonalActivo } from '@/lib/data'
import { Usuario, StaffRol } from '@/lib/types'

const ROL_INFO: Record<StaffRol, { label: string; icono: string; color: string }> = {
  admin:    { label: 'Administrador', icono: '🛠️', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  camarero: { label: 'Camarero',      icono: '🧑‍💼', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  cocina:   { label: 'Cocina',        icono: '👨‍🍳', color: 'bg-orange-50 text-orange-700 border-orange-200' },
}

function PersonalContent() {
  const [personal, setPersonal] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', password: '', rol: 'camarero' as StaffRol })
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  const cargar = () => getPersonal().then(p => { setPersonal(p); setLoading(false) })

  useEffect(() => { cargar() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (form.password.length < 8) { setFormError('La contraseña debe tener al menos 8 caracteres'); return }
    setCreating(true)
    const res = await createPersonal(form)
    if (res.ok) {
      setForm({ nombre: '', email: '', telefono: '', password: '', rol: 'camarero' })
      setShowForm(false)
      await cargar()
    } else {
      setFormError(res.error ?? 'Error al crear la cuenta')
    }
    setCreating(false)
  }

  const toggleActivo = async (u: Usuario) => {
    await setPersonalActivo(u.id, !u.activo)
    setPersonal(prev => prev.map(p => p.id === u.id ? { ...p, activo: !p.activo } : p))
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 text-sm font-medium">← Admin</Link>
            <span className="font-black text-lg">Personal</span>
          </div>
          <button onClick={() => { setShowForm(v => !v); setFormError('') }}
            className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors">
            + Nueva cuenta
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-6">
        <p className="text-sm text-gray-500 mb-6">
          Cuentas nominales de acceso a <strong>/comandero</strong> y <strong>/cocina</strong>. Cada persona entra con
          su propio email y contraseña — evita compartir un único PIN entre todo el equipo.
        </p>

        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
            <h3 className="font-bold mb-5">Dar de alta a alguien del equipo</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-500">Rol</label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(ROL_INFO) as StaffRol[]).map(r => (
                    <button key={r} type="button" onClick={() => setForm(f => ({ ...f, rol: r }))}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
                        form.rol === r ? 'border-accent bg-accent/5 text-accent' : 'border-gray-200 text-gray-600'
                      }`}>
                      <span className="text-xl">{ROL_INFO[r].icono}</span>
                      {ROL_INFO[r].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Nombre *</label>
                  <input type="text" required value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Nombre y apellido"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Teléfono</label>
                  <input type="tel" value={form.telefono}
                    onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Email *</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="correo@ejemplo.com"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Contraseña *</label>
                  <input type="password" required value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent" />
                </div>
              </div>

              {formError && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{formError}</p>}

              <div className="flex gap-3">
                <button type="submit" disabled={creating}
                  className="bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 transition-colors">
                  {creating ? 'Creando...' : 'Crear cuenta'}
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
        ) : personal.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🧑‍🤝‍🧑</p>
            <p className="text-gray-500 font-medium mb-5">Todavía no hay cuentas de personal</p>
            <button onClick={() => setShowForm(true)}
              className="bg-accent text-white px-6 py-3 rounded-2xl font-semibold hover:bg-accent-dark transition-colors">
              + Dar de alta a la primera persona
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {personal.map(u => (
              <div key={u.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border flex-shrink-0 ${ROL_INFO[u.rol].color}`}>
                  {ROL_INFO[u.rol].icono}
                </div>
                <div className="flex-1 min-w-[140px]">
                  <p className="font-bold text-sm">{u.nombre}</p>
                  <p className="text-xs text-gray-400 break-all">{u.email}{u.telefono ? ` · ${u.telefono}` : ''}</p>
                </div>
                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${ROL_INFO[u.rol].color}`}>
                    {ROL_INFO[u.rol].label}
                  </span>
                  <button onClick={() => toggleActivo(u)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors ${
                      u.activo ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}>
                    {u.activo ? 'Desactivar' : 'Activar'}
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

export default function PersonalPage() {
  return <AdminGuard><PersonalContent /></AdminGuard>
}
