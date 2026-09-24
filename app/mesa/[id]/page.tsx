'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { getCategorias, getProductos, getMesas, createPedido, getPedidosActivos } from '@/lib/data'
import { Categoria, Producto, Mesa, Pedido } from '@/lib/types'
import MenuCard from '@/components/MenuCard'
import AvisoComanda from '@/components/AvisoComanda'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

type Step = 'menu' | 'carrito' | 'auth' | 'datos' | 'confirmado'

interface Cliente { id: string; nombre: string; email: string; telefono: string }

export default function MesaPage() {
  const { t } = useLanguage()
  const params = useParams()
  const rawId = params.id
  const mesaId = Array.isArray(rawId) ? rawId[0] : String(rawId ?? '')

  const [mesa, setMesa] = useState<Mesa | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cat, setCat] = useState('')
  const [step, setStep] = useState<Step>('menu')
  const [loading, setLoading] = useState(false)
  const [numPedido, setNumPedido] = useState(0)
  const [notas, setNotas] = useState('')

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'guest'>('login')
  const [authForm, setAuthForm] = useState({ nombre: '', email: '', password: '', telefono: '' })
  const [guestNombre, setGuestNombre] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const { clearCart, items, total, count, updateQty } = useCart()

  useEffect(() => {
    Promise.all([getCategorias(), getProductos(), getMesas()]).then(([cats, prods, mesas]) => {
      setCategorias(cats)
      setProductos(prods)
      if (cats.length) setCat(cats[0].id)
      const m = mesas.find(m => m.id === mesaId)
      if (m) setMesa(m)
    })
    const saved = localStorage.getItem('clienteSession')
    if (saved) {
      try { setCliente(JSON.parse(saved)) } catch {}
    }
  }, [mesaId])

  const suplementos = productos.filter(p => (p as any).categoria_tipo === 'suplemento' && p.disponible)
  const categoriasVisibles = categorias.filter(c => c.tipo !== 'suplemento')
  const filtrados = productos.filter(p => p.disponible && p.categoria_id === cat && (p as any).categoria_tipo !== 'suplemento')
  const mesaLabel = mesa ? (mesa.tipo === 'barra' ? `🍺 ${t('mesa.label.barra')} ${mesa.numero}` : `${t('mesa.label.mesa')} ${mesa.numero}`) : ''

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
      if (!res.ok) throw new Error(data.error || t('common.auth.error'))
      localStorage.setItem('clienteSession', JSON.stringify(data.cliente))
      setCliente(data.cliente)
      setStep('datos')
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : t('common.auth.error'))
    } finally {
      setAuthLoading(false)
    }
  }

  const continuarComoInvitado = () => {
    setStep('datos')
  }

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const nombre = cliente?.nombre || guestNombre || undefined
      const num = await createPedido('mesa', items, {
        mesa_id: mesaId,
        cliente_nombre: nombre,
        notas: notas || undefined,
      })
      setNumPedido(num)
      clearCart()
      setStep('confirmado')
    } catch {
      alert(t('common.errors.order'))
    } finally {
      setLoading(false)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('clienteSession')
    setCliente(null)
  }

  // ── PANTALLA CONFIRMADO ───────────────────────────────────────
  if (step === 'confirmado') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">✅</div>
        <h1 className="text-2xl font-black mb-1">{t('mesa.confirmed.title')}</h1>
        <p className="text-gray-500 mb-4">{mesaLabel}</p>
        <div className="bg-accent/10 rounded-2xl px-10 py-5 mb-5">
          <p className="text-sm text-gray-500 mb-1">{t('common.orderNumber')}</p>
          <p className="text-5xl font-black text-accent">#{numPedido}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4 mb-6 max-w-xs">
          <p className="text-sm font-bold text-orange-800 mb-1">{t('mesa.confirmed.pendingTitle')}</p>
          <p className="text-xs text-orange-600 leading-relaxed">
            {t('mesa.confirmed.pendingDesc')}
          </p>
        </div>
        <button onClick={() => setStep('menu')} className="text-accent font-semibold text-sm">
          {t('mesa.confirmed.addMore')}
        </button>
      </div>
    )
  }

  // ── PANTALLA AUTH ─────────────────────────────────────────────
  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setStep('menu')} className="text-gray-400 hover:text-gray-900 text-sm font-medium">{t('common.back')}</button>
            <span className="font-black text-lg">{t('mesa.auth.title')}</span>
          </div>
        </header>
        <main className="max-w-sm mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setAuthMode(m); setAuthError('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${authMode === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                {m === 'login' ? t('common.auth.login') : t('common.auth.register')}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-500">{t('common.auth.name')}</label>
                  <input type="text" required value={authForm.nombre}
                    onChange={e => setAuthForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder={t('common.auth.namePlaceholder')}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-500">{t('common.auth.phone')}</label>
                  <input type="tel" value={authForm.telefono}
                    onChange={e => setAuthForm(f => ({ ...f, telefono: e.target.value }))}
                    placeholder={t('common.auth.phonePlaceholder')}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">{t('common.auth.email')}</label>
              <input type="email" required value={authForm.email}
                onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))}
                placeholder={t('common.auth.emailPlaceholder')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">{t('common.auth.password')}</label>
              <input type="password" required value={authForm.password}
                onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
            </div>
            {authError && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{authError}</p>}
            <button type="submit" disabled={authLoading}
              className="w-full bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent-dark transition-colors disabled:opacity-50">
              {authLoading ? t('common.auth.loading') : authMode === 'login' ? t('common.auth.submitLogin') : t('common.auth.submitRegister')}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400 text-center mb-3">{t('mesa.auth.preferGuest')}</p>
            <button onClick={continuarComoInvitado}
              className="w-full py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              {t('mesa.auth.continueGuest')}
            </button>
          </div>
        </main>
      </div>
    )
  }

  // ── PANTALLA DATOS / CONFIRMAR ────────────────────────────────
  if (step === 'datos') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setStep('menu')} className="text-gray-400 hover:text-gray-900 text-sm font-medium">{t('common.back')}</button>
            <span className="font-black text-lg">{t('mesa.datos.title')}</span>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-6">
          {/* Resumen */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('common.summary')}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{mesaLabel}</span>
            </div>
            <ul className="space-y-2 mb-3">
              {items.map(item => {
                const precio = Number(item.variante?.precio ?? item.producto.precio)
                const key = item.variante ? `${item.producto.id}-${item.variante.nombre}` : item.producto.id
                return (
                  <li key={key} className="flex items-center justify-between text-sm gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => updateQty(item.producto.id, item.cantidad - 1, item.variante)}
                          className="w-6 h-6 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">−</button>
                        <span className="font-bold w-4 text-center">{item.cantidad}</span>
                        <button onClick={() => updateQty(item.producto.id, item.cantidad + 1, item.variante)}
                          className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">+</button>
                      </div>
                      <span className="truncate">
                        {item.producto.nombre}
                        {item.variante && <span className="text-gray-400 text-xs ml-1">({item.variante.nombre})</span>}
                      </span>
                    </div>
                    <span className="text-gray-400 flex-shrink-0">{(precio * item.cantidad).toFixed(2)}€</span>
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-between font-bold pt-3 border-t">
              <span>{t('common.total')}</span>
              <span className="text-accent">{total.toFixed(2)}€</span>
            </div>
          </div>

          <form onSubmit={handleConfirmar} className="space-y-4">
            {/* Nombre si no está logado */}
            {!cliente && (
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-500">{t('mesa.datos.guestName')}</label>
                <input type="text" value={guestNombre}
                  onChange={e => setGuestNombre(e.target.value)}
                  placeholder={t('mesa.datos.guestNamePlaceholder')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" />
              </div>
            )}

            {cliente && (
              <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-green-800">👤 {cliente.nombre}</span>
                <button type="button" onClick={cerrarSesion} className="text-xs text-gray-400 hover:text-gray-600">{t('common.logoutLong')}</button>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">{t('mesa.datos.notes')}</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)}
                rows={2} placeholder={t('mesa.datos.notesPlaceholder')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent-dark transition-colors disabled:opacity-50 shadow-lg shadow-orange-200">
              {loading ? t('common.sending') : `${t('mesa.datos.submit')} · ${total.toFixed(2)}€`}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            {t('mesa.datos.footerNote')}
          </p>
        </main>
      </div>
    )
  }

  // ── PANTALLA MENÚ (PRINCIPAL) ─────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <AvisoComanda />
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <div>
              <span className="font-black text-lg">Frankfurt Els Tr3s</span>
              {mesa && <span className="ml-2 text-sm text-gray-400 font-medium">{mesaLabel}</span>}
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              {cliente ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                    👤 {cliente.nombre}
                  </span>
                  <button onClick={cerrarSesion} className="text-xs text-gray-400 hover:text-gray-600">{t('common.logoutShort')}</button>
                </div>
              ) : (
                <button onClick={() => setStep('auth')} className="text-xs text-accent font-semibold">
                  {t('common.loginShort')}
                </button>
              )}
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">🟢 {t('mesa.menu.open')}</span>
            </div>
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

      <main className="max-w-2xl mx-auto px-4 py-3">
        {cat === '' && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">{t('mesa.menu.loading')}</p>
          </div>
        )}
        {cat !== '' && filtrados.length === 0 && (
          <p className="text-center text-gray-400 py-12 text-sm">{t('mesa.menu.empty')}</p>
        )}
        <div className="space-y-2">
          {filtrados.map(p => <MenuCard key={p.id} producto={p} suplementos={suplementos} />)}
        </div>
      </main>

      {/* Floating cart button */}
      {count > 0 && (
        <button
          onClick={() => cliente ? setStep('datos') : setStep('auth')}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-accent text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-semibold hover:bg-accent-dark transition-colors"
        >
          <span className="bg-white text-accent text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
          {t('mesa.menu.viewOrder')}
          <span className="font-bold">{total.toFixed(2)}€</span>
        </button>
      )}
    </div>
  )
}
