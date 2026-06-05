'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategorias, getProductos, createPedido } from '@/lib/data'
import { Categoria, Producto } from '@/lib/types'
import MenuCard from '@/components/MenuCard'
import AvisoComanda from '@/components/AvisoComanda'
import { useCart } from '@/context/CartContext'

type Step = 'menu' | 'auth' | 'datos' | 'confirmado'

interface Cliente { id: string; nombre: string; email: string; telefono: string }

export default function LlevarPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cat, setCat] = useState('')
  const [step, setStep] = useState<Step>('menu')
  const [loading, setLoading] = useState(false)
  const [numPedido, setNumPedido] = useState(0)
  const [pago, setPago] = useState<'bar' | 'online'>('bar')
  const [form, setForm] = useState({ nombre: '', telefono: '', notas: '' })
  const [cliente, setCliente] = useState<Cliente | null>(null)

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({ nombre: '', email: '', password: '', telefono: '' })
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const { clearCart, total, count, items } = useCart()

  useEffect(() => {
    Promise.all([getCategorias(), getProductos()]).then(([cats, prods]) => {
      setCategorias(cats)
      setProductos(prods)
      if (cats.length) setCat(cats[0].id)
    })
    const saved = localStorage.getItem('clienteSession')
    if (saved) setCliente(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (cliente) {
      setForm(f => ({ ...f, nombre: cliente.nombre, telefono: cliente.telefono ?? '' }))
    }
  }, [cliente])

  const suplementos = productos.filter(p => (p as any).categoria_tipo === 'suplemento' && p.disponible)
  const categoriasVisibles = categorias.filter(c => c.tipo !== 'suplemento')
  const filtrados = productos.filter(p => p.disponible && p.categoria_id === cat && (p as any).categoria_tipo !== 'suplemento')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    try {
      const url = authMode === 'login' ? '/api/clientes/login' : '/api/clientes/register'
      const body = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : { nombre: authForm.nombre, email: authForm.email, password: authForm.password, telefono: authForm.telefono }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error de autenticación')

      localStorage.setItem('clienteSession', JSON.stringify(data.cliente))
      setCliente(data.cliente)
      setStep('datos')
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Error de autenticación')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleDatos = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const num = await createPedido('llevar', items, {
        cliente_nombre: form.nombre,
        cliente_telefono: form.telefono,
        notas: form.notas + (pago === 'online' ? ' [Pago online]' : ' [Paga en el bar]'),
      })
      setNumPedido(num)
      clearCart()
      setStep('confirmado')
    } catch {
      alert('Error al enviar el pedido. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('clienteSession')
    setCliente(null)
    setForm({ nombre: '', telefono: '', notas: '' })
  }

  if (step === 'confirmado') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">🛵</div>
        <h1 className="text-2xl font-black mb-1">¡Pedido recibido!</h1>
        <p className="text-gray-500 mb-4">Para llevar · {form.nombre}</p>
        <div className="bg-accent/10 rounded-2xl px-10 py-5 mb-4">
          <p className="text-sm text-gray-500 mb-1">Número de pedido</p>
          <p className="text-5xl font-black text-accent">#{numPedido}</p>
        </div>
        <p className="text-sm font-semibold mb-1">
          {pago === 'bar' ? '💵 Pagas en el bar al recoger' : '💳 Pago online confirmado'}
        </p>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed mt-2">
          Te avisaremos al teléfono <strong>{form.telefono}</strong> cuando esté listo.
        </p>
        <Link href="/" className="mt-8 text-accent font-semibold text-sm">← Volver al inicio</Link>
      </div>
    )
  }

  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setStep('menu')} className="text-gray-400 hover:text-gray-900 text-sm font-medium">← Volver</button>
            <span className="font-black text-lg">Tu cuenta</span>
          </div>
        </header>
        <main className="max-w-sm mx-auto px-4 py-8">
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setAuthMode(m); setAuthError('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${authMode === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-500">Nombre *</label>
                  <input type="text" required value={authForm.nombre}
                    onChange={e => setAuthForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Tu nombre"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-500">Teléfono</label>
                  <input type="tel" value={authForm.telefono}
                    onChange={e => setAuthForm(f => ({ ...f, telefono: e.target.value }))}
                    placeholder="600 000 000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Email *</label>
              <input type="email" required value={authForm.email}
                onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Contraseña *</label>
              <input type="password" required value={authForm.password}
                onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
            </div>
            {authError && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{authError}</p>}
            <button type="submit" disabled={authLoading}
              className="w-full bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent-dark transition-colors disabled:opacity-50">
              {authLoading ? 'Cargando...' : authMode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          <button onClick={() => setStep('datos')} className="w-full mt-4 py-3 text-gray-400 text-sm font-medium">
            Continuar sin cuenta →
          </button>
        </main>
      </div>
    )
  }

  if (step === 'datos') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setStep('menu')} className="text-gray-400 hover:text-gray-900 text-sm font-medium">← Volver</button>
            <span className="font-black text-lg">Confirmar pedido</span>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
            <h2 className="font-bold mb-3 text-sm text-gray-500 uppercase tracking-wider">Resumen</h2>
            <ul className="space-y-2 mb-3">
              {items.map(item => {
                const precio = item.variante?.precio ?? item.producto.precio
                const key = item.variante ? `${item.producto.id}-${item.variante.nombre}` : item.producto.id
                return (
                  <li key={key} className="flex justify-between text-sm">
                    <span>
                      <span className="font-bold">{item.cantidad}×</span> {item.producto.nombre}
                      {item.variante && <span className="text-gray-400 text-xs ml-1">({item.variante.nombre})</span>}
                    </span>
                    <span className="text-gray-400">{(precio * item.cantidad).toFixed(2)}€</span>
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-between font-bold pt-3 border-t">
              <span>Total</span>
              <span className="text-accent">{total.toFixed(2)}€</span>
            </div>
          </div>

          <form onSubmit={handleDatos} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Nombre *</label>
              <input type="text" required value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Tu nombre"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Teléfono *</label>
              <input type="tel" required value={form.telefono}
                onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                placeholder="600 000 000"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Notas (opcional)</label>
              <textarea value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                rows={2} placeholder="Alergias, peticiones..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-gray-500">Método de pago</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setPago('bar')}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${pago === 'bar' ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white'}`}>
                  <span className="text-2xl">💵</span>
                  <span className="text-sm font-semibold">Pagar en el bar</span>
                  <span className="text-xs text-gray-400">Al recoger</span>
                </button>
                <button type="button" onClick={() => setPago('online')}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${pago === 'online' ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white'}`}>
                  <span className="text-2xl">💳</span>
                  <span className="text-sm font-semibold">Pagar online</span>
                  <span className="text-xs text-gray-400">Próximamente</span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || pago === 'online'}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent-dark transition-colors disabled:opacity-50 shadow-lg shadow-orange-200">
              {loading ? 'Enviando...' : `Confirmar pedido · ${total.toFixed(2)}€`}
            </button>
            {pago === 'online' && (
              <p className="text-center text-xs text-gray-400">El pago online estará disponible próximamente</p>
            )}
          </form>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AvisoComanda />
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-gray-400 hover:text-gray-900 text-sm font-medium">← Inicio</Link>
              <span className="font-black text-lg">Para llevar 🛵</span>
            </div>
            {cliente ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                  👤 {cliente.nombre}
                </span>
                <button onClick={cerrarSesion} className="text-xs text-gray-400 hover:text-gray-600">Salir</button>
              </div>
            ) : (
              <button onClick={() => setStep('auth')} className="text-xs text-accent font-semibold">
                Iniciar sesión
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
            {categoriasVisibles.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${cat === c.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'}`}>
                {c.icono} {c.nombre}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-3 pb-28">
        <div className="space-y-2">
          {filtrados.length === 0 && cat === '' && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Cargando...</p>
            </div>
          )}
          {filtrados.map(p => <MenuCard key={p.id} producto={p} suplementos={suplementos} />)}
        </div>
      </main>

      {count > 0 && (
        <button
          onClick={() => cliente ? setStep('datos') : setStep('auth')}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-accent text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-semibold hover:bg-accent-dark transition-colors"
        >
          <span className="bg-white text-accent text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
          Continuar
          <span className="font-bold">{total.toFixed(2)}€</span>
        </button>
      )}
    </div>
  )
}
