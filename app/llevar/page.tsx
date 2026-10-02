'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getCategorias, getProductos, createPedido } from '@/lib/data'
import { Categoria, Producto } from '@/lib/types'
import MenuCard from '@/components/MenuCard'
import AvisoComanda from '@/components/AvisoComanda'
import CategoryScroller from '@/components/CategoryScroller'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

type Step = 'menu' | 'entrega' | 'auth' | 'datos' | 'confirmado'
type TipoEntrega = 'recogida' | 'domicilio'

interface Cliente { id: string; nombre: string; email: string; telefono: string }

const inputClass = 'w-full border border-line bg-ink text-parchment placeholder:text-sand/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber'

export default function LlevarPage() {
  const { t } = useLanguage()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cat, setCat] = useState('')
  const [step, setStep] = useState<Step>('menu')
  const [loading, setLoading] = useState(false)
  const [numPedido, setNumPedido] = useState(0)
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('recogida')
  const [direccion, setDireccion] = useState({ calle: '', piso: '', cp: '', ciudad: 'Terrassa', notas: '' })
  const [sugerencias, setSugerencias] = useState<any[]>([])
  const [showSugg, setShowSugg] = useState(false)
  const [buscandoDir, setBuscandoDir] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()
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
      if (cats.length) setCat(cats.filter(c => c.tipo !== 'suplemento')[0]?.id ?? '')
    })
    const saved = localStorage.getItem('clienteSession')
    if (saved) { try { setCliente(JSON.parse(saved)) } catch {} }
  }, [])

  useEffect(() => {
    if (cliente) setForm(f => ({ ...f, nombre: cliente.nombre, telefono: cliente.telefono ?? '' }))
  }, [cliente])

  const buscarDireccion = (q: string) => {
    setDireccion(d => ({ ...d, calle: q }))
    clearTimeout(searchTimer.current)
    if (q.length < 4) { setSugerencias([]); setShowSugg(false); return }
    setBuscandoDir(true)
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ' Terrassa')}&format=json&addressdetails=1&limit=8&countrycodes=es&viewbox=1.99,41.52,2.13,41.59&bounded=1`,
          { headers: { 'Accept-Language': 'es' } }
        )
        const data = await res.json()
        // Solo resultados dentro de Terrassa
        const terrassa = data.filter((item: any) => {
          const a = item.address ?? {}
          const ciudad = (a.city ?? a.town ?? a.municipality ?? a.village ?? '').toLowerCase()
          return ciudad.includes('terrassa') || ciudad.includes('tarrasa')
        })
        setSugerencias(terrassa)
        setShowSugg(terrassa.length > 0)
      } catch {}
      setBuscandoDir(false)
    }, 450)
  }

  const seleccionarSugerencia = (item: any) => {
    const a = item.address ?? {}
    const calle = [a.road, a.house_number].filter(Boolean).join(', ')
    setDireccion({
      calle: calle || item.display_name.split(',')[0],
      piso: '',
      cp: a.postcode ?? '',
      ciudad: a.city ?? a.town ?? a.municipality ?? a.village ?? 'Terrassa',
      notas: '',
    })
    setSugerencias([])
    setShowSugg(false)
  }

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
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
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

  const handleDatos = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const notasFinal = [
        form.notas,
        pago === 'online' ? '[Pago online]' : '[Paga al recoger/entregar]',
      ].filter(Boolean).join(' ')

      const direccionFinal = tipoEntrega === 'domicilio'
        ? `${direccion.calle}${direccion.piso ? `, ${direccion.piso}` : ''} · ${direccion.cp} ${direccion.ciudad}${direccion.notas ? ` · ${direccion.notas}` : ''}`
        : undefined

      const num = await createPedido('llevar', items, {
        cliente_nombre: form.nombre,
        cliente_telefono: form.telefono,
        notas: notasFinal,
        tipo_entrega: tipoEntrega,
        direccion_entrega: direccionFinal,
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

  const cerrarSesion = () => { localStorage.removeItem('clienteSession'); setCliente(null); setForm({ nombre: '', telefono: '', notas: '' }) }

  // ── CONFIRMADO ────────────────────────────────────────────────
  if (step === 'confirmado') {
    return (
      <div className="min-h-screen bg-ink font-sans flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-amber/15 rounded-full flex items-center justify-center text-4xl mb-6">
          {tipoEntrega === 'domicilio' ? '🛵' : '🏪'}
        </div>
        <h1 className="text-2xl font-black mb-1 text-parchment">{t('llevar.confirmed.title')}</h1>
        <p className="text-sand mb-4">
          {tipoEntrega === 'domicilio' ? t('llevar.confirmed.domicilio') : t('llevar.confirmed.recogida')} · {form.nombre}
        </p>
        <div className="bg-amber/10 rounded-2xl px-10 py-5 mb-4">
          <p className="text-sm text-sand mb-1">{t('common.orderNumber')}</p>
          <p className="text-5xl font-black text-amber">#{numPedido}</p>
        </div>
        {tipoEntrega === 'domicilio' ? (
          <div className="bg-surface border border-line rounded-2xl px-6 py-4 mb-4 max-w-xs">
            <p className="text-sm font-bold text-parchment mb-1">{t('llevar.confirmed.addressTitle')}</p>
            <p className="text-xs text-sand">{direccion.calle}{direccion.piso ? `, ${direccion.piso}` : ''}</p>
            <p className="text-xs text-sand">{direccion.cp} {direccion.ciudad}</p>
          </div>
        ) : (
          <p className="text-sm font-semibold mb-1 text-parchment">
            {pago === 'bar' ? t('llevar.confirmed.payBar') : t('llevar.confirmed.payOnline')}
          </p>
        )}
        {form.telefono && (
          <p className="text-sand/70 text-sm max-w-xs leading-relaxed mt-2">
            {t('llevar.confirmed.notifyPre')} <strong className="text-sand">{form.telefono}</strong> {t('llevar.confirmed.notifyPost')}
          </p>
        )}
        <Link href="/" className="mt-8 text-amber font-semibold text-sm">{t('llevar.confirmed.backHome')}</Link>
      </div>
    )
  }

  // ── ELEGIR TIPO DE ENTREGA ────────────────────────────────────
  if (step === 'entrega') {
    return (
      <div className="min-h-screen bg-ink font-sans">
        <header className="bg-surface border-b border-line">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setStep('menu')} className="text-sand hover:text-parchment text-sm font-medium">{t('common.back')}</button>
            <span className="font-black text-lg text-parchment">{t('llevar.entrega.title')}</span>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-4 mb-8">
            {/* Recogida */}
            <button
              onClick={() => setTipoEntrega('recogida')}
              className={`flex items-center gap-5 p-6 rounded-3xl border-2 text-left transition-all ${
                tipoEntrega === 'recogida' ? 'border-amber bg-amber/10' : 'border-line bg-surface hover:border-amber/40'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                tipoEntrega === 'recogida' ? 'bg-amber/15' : 'bg-ink'
              }`}>🏪</div>
              <div>
                <p className="font-black text-lg text-parchment">{t('llevar.entrega.pickupTitle')}</p>
                <p className="text-sand text-sm mt-0.5">Passeig de Lluís Muncunill, 9</p>
                <p className="text-sand/70 text-xs mt-1">{t('llevar.entrega.pickupTime')}</p>
              </div>
              <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                tipoEntrega === 'recogida' ? 'bg-amber border-amber' : 'border-line'
              }`}>
                {tipoEntrega === 'recogida' && <span className="text-amber-ink text-xs font-black">✓</span>}
              </div>
            </button>

            {/* Domicilio */}
            <button
              onClick={() => setTipoEntrega('domicilio')}
              className={`flex items-center gap-5 p-6 rounded-3xl border-2 text-left transition-all ${
                tipoEntrega === 'domicilio' ? 'border-amber bg-amber/10' : 'border-line bg-surface hover:border-amber/40'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                tipoEntrega === 'domicilio' ? 'bg-amber/15' : 'bg-ink'
              }`}>🛵</div>
              <div>
                <p className="font-black text-lg text-parchment">{t('llevar.entrega.domicilioTitle')}</p>
                <p className="text-sand text-sm mt-0.5">{t('llevar.entrega.domicilioDesc')}</p>
                <p className="text-sand/70 text-xs mt-1">{t('llevar.entrega.domicilioTime')}</p>
              </div>
              <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                tipoEntrega === 'domicilio' ? 'bg-amber border-amber' : 'border-line'
              }`}>
                {tipoEntrega === 'domicilio' && <span className="text-amber-ink text-xs font-black">✓</span>}
              </div>
            </button>
          </div>

          <button
            onClick={() => cliente ? setStep('datos') : setStep('auth')}
            className="w-full bg-amber text-amber-ink py-4 rounded-2xl font-bold text-lg hover:bg-amber-dark transition-colors shadow-lg shadow-black/30">
            {t('llevar.entrega.continue')} · {total.toFixed(2)}€
          </button>
        </main>
      </div>
    )
  }

  // ── AUTH ──────────────────────────────────────────────────────
  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-ink font-sans">
        <header className="bg-surface border-b border-line">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setStep('entrega')} className="text-sand hover:text-parchment text-sm font-medium">{t('common.back')}</button>
            <span className="font-black text-lg text-parchment">{t('llevar.auth.title')}</span>
          </div>
        </header>
        <main className="max-w-sm mx-auto px-4 py-8">
          <div className="flex bg-surface rounded-2xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setAuthMode(m); setAuthError('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${authMode === m ? 'bg-ink shadow-sm text-parchment' : 'text-sand'}`}>
                {m === 'login' ? t('common.auth.login') : t('common.auth.register')}
              </button>
            ))}
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-sand">{t('common.auth.name')}</label>
                  <input type="text" required value={authForm.nombre}
                    onChange={e => setAuthForm(f => ({ ...f, nombre: e.target.value }))} placeholder={t('common.auth.namePlaceholder')}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-sand">{t('common.auth.phone')}</label>
                  <input type="tel" value={authForm.telefono}
                    onChange={e => setAuthForm(f => ({ ...f, telefono: e.target.value }))} placeholder={t('common.auth.phonePlaceholder')}
                    className={inputClass} />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sand">{t('common.auth.email')}</label>
              <input type="email" required value={authForm.email}
                onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} placeholder={t('common.auth.emailPlaceholder')}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-sand">{t('common.auth.password')}</label>
              <input type="password" required value={authForm.password}
                onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••"
                className={inputClass} />
            </div>
            {authError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{authError}</p>}
            <button type="submit" disabled={authLoading}
              className="w-full bg-amber text-amber-ink py-3.5 rounded-2xl font-bold hover:bg-amber-dark transition-colors disabled:opacity-50">
              {authLoading ? t('common.auth.loading') : authMode === 'login' ? t('common.auth.submitLogin') : t('common.auth.submitRegister')}
            </button>
          </form>
          <button onClick={() => setStep('datos')} className="w-full mt-4 py-3 text-sand text-sm font-medium">
            {t('llevar.auth.continueWithoutAccount')}
          </button>
        </main>
      </div>
    )
  }

  // ── DATOS / CONFIRMAR ─────────────────────────────────────────
  if (step === 'datos') {
    return (
      <div className="min-h-screen bg-ink font-sans">
        <header className="bg-surface border-b border-line">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setStep('entrega')} className="text-sand hover:text-parchment text-sm font-medium">{t('common.back')}</button>
            <span className="font-black text-lg text-parchment">{t('common.confirmOrder')}</span>
            <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${
              tipoEntrega === 'domicilio' ? 'bg-amber/15 text-amber' : 'bg-ink text-sand border border-line'
            }`}>
              {tipoEntrega === 'domicilio' ? t('llevar.datos.badgeDomicilio') : t('llevar.datos.badgeRecogida')}
            </span>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {/* Resumen carrito */}
          <div className="bg-surface rounded-2xl p-4 border border-line">
            <h2 className="font-bold mb-3 text-sm text-sand uppercase tracking-wider">{t('common.summary')}</h2>
            <ul className="space-y-2 mb-3">
              {items.map(item => {
                const precio = Number(item.variante?.precio ?? item.producto.precio)
                const key = item.variante ? `${item.producto.id}-${item.variante.nombre}` : item.producto.id
                return (
                  <li key={key} className="flex justify-between text-sm text-parchment">
                    <span><span className="font-bold">{item.cantidad}×</span> {item.producto.nombre}
                      {item.variante && <span className="text-sand text-xs ml-1">({item.variante.nombre})</span>}
                    </span>
                    <span className="text-sand">{(precio * item.cantidad).toFixed(2)}€</span>
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-between font-bold pt-3 border-t border-line text-parchment">
              <span>{t('common.total')}</span>
              <span className="text-amber">{total.toFixed(2)}€</span>
            </div>
          </div>

          <form onSubmit={handleDatos} className="space-y-4">
            {/* Datos personales */}
            <div className="bg-surface rounded-2xl p-4 border border-line space-y-4">
              <h2 className="font-bold text-sm text-sand uppercase tracking-wider">{t('llevar.datos.yourData')}</h2>
              {cliente ? (
                <div className="flex items-center justify-between bg-emerald-500/10 rounded-xl px-4 py-3">
                  <span className="text-sm font-medium text-emerald-400">👤 {cliente.nombre}</span>
                  <button type="button" onClick={cerrarSesion} className="text-xs text-sand hover:text-parchment">{t('common.logoutShort')}</button>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-sand">{t('common.auth.name')}</label>
                  <input type="text" required value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder={t('common.auth.namePlaceholder')}
                    className={inputClass} />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-sand">{t('llevar.datos.phone')}</label>
                <input type="tel" required value={form.telefono}
                  onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} placeholder={t('common.auth.phonePlaceholder')}
                  className={inputClass} />
              </div>
            </div>

            {/* Dirección — solo si domicilio */}
            {tipoEntrega === 'domicilio' && (
              <div className="bg-surface rounded-2xl p-4 border border-amber/30 space-y-4">
                <h2 className="font-bold text-sm text-amber uppercase tracking-wider">{t('llevar.datos.addressSection')}</h2>
                <div className="relative">
                  <label className="block text-xs font-semibold mb-1.5 text-sand">{t('llevar.datos.searchAddress')}</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={direccion.calle}
                      onChange={e => buscarDireccion(e.target.value)}
                      onBlur={() => setTimeout(() => setShowSugg(false), 200)}
                      onFocus={() => sugerencias.length > 0 && setShowSugg(true)}
                      placeholder={t('llevar.datos.addressPlaceholder')}
                      className={`${inputClass} pr-10`}
                    />
                    {buscandoDir && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="w-4 h-4 border-2 border-amber border-t-transparent rounded-full animate-spin block" />
                      </span>
                    )}
                  </div>

                  {/* Dropdown sugerencias */}
                  {showSugg && sugerencias.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-line rounded-2xl shadow-xl z-50 overflow-hidden">
                      {sugerencias.map((item, i) => {
                        const a = item.address ?? {}
                        const linea1 = [a.road, a.house_number].filter(Boolean).join(', ') || item.display_name.split(',')[0]
                        const linea2 = [a.postcode, a.city ?? a.town ?? a.municipality ?? a.village].filter(Boolean).join(' ')
                        return (
                          <button
                            key={i}
                            type="button"
                            onMouseDown={() => seleccionarSugerencia(item)}
                            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-ink transition-colors text-left border-b border-line last:border-0">
                            <span className="text-sand mt-0.5 flex-shrink-0">📍</span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-parchment truncate">{linea1}</p>
                              {linea2 && <p className="text-xs text-sand truncate">{linea2}</p>}
                            </div>
                          </button>
                        )
                      })}
                      <div className="px-4 py-2 bg-ink flex items-center gap-1.5">
                        <span className="text-xs text-sand">{t('llevar.datos.resultsFrom')}</span>
                        <span className="text-xs font-semibold text-sand">OpenStreetMap</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-sand">{t('llevar.datos.floor')}</label>
                    <input type="text" value={direccion.piso}
                      onChange={e => setDireccion(d => ({ ...d, piso: e.target.value }))} placeholder={t('llevar.datos.floorPlaceholder')}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-sand">{t('llevar.datos.postalCode')}</label>
                    <input type="text" required value={direccion.cp}
                      onChange={e => setDireccion(d => ({ ...d, cp: e.target.value }))} placeholder="08225"
                      className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-sand">{t('llevar.datos.city')}</label>
                  <input type="text" required value={direccion.ciudad}
                    onChange={e => setDireccion(d => ({ ...d, ciudad: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-sand">{t('llevar.datos.deliveryNotes')}</label>
                  <input type="text" value={direccion.notas}
                    onChange={e => setDireccion(d => ({ ...d, notas: e.target.value }))} placeholder={t('llevar.datos.deliveryNotesPlaceholder')}
                    className={inputClass} />
                </div>
              </div>
            )}

            {/* Notas del pedido */}
            <div className="bg-surface rounded-2xl p-4 border border-line">
              <label className="block text-xs font-semibold mb-1.5 text-sand">{t('llevar.datos.orderNotes')}</label>
              <textarea value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                rows={2} placeholder={t('llevar.datos.orderNotesPlaceholder')}
                className={`${inputClass} resize-none`} />
            </div>

            {/* Método de pago */}
            <div className="bg-surface rounded-2xl p-4 border border-line">
              <label className="block text-xs font-semibold mb-2 text-sand">{t('llevar.datos.paymentMethod')}</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setPago('bar')}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${pago === 'bar' ? 'border-amber bg-amber/10' : 'border-line bg-ink'}`}>
                  <span className="text-2xl">💵</span>
                  <span className="text-sm font-semibold text-parchment">{tipoEntrega === 'domicilio' ? t('llevar.datos.payAtDelivery') : t('llevar.datos.payAtPickup')}</span>
                  <span className="text-xs text-sand">{t('llevar.datos.cashOrCard')}</span>
                </button>
                <button type="button" onClick={() => setPago('online')}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${pago === 'online' ? 'border-amber bg-amber/10' : 'border-line bg-ink'}`}>
                  <span className="text-2xl">💳</span>
                  <span className="text-sm font-semibold text-parchment">{t('llevar.datos.payOnline')}</span>
                  <span className="text-xs text-sand">{t('llevar.datos.comingSoon')}</span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || pago === 'online'}
              className="w-full bg-amber text-amber-ink py-4 rounded-2xl font-bold text-lg hover:bg-amber-dark transition-colors disabled:opacity-50 shadow-lg shadow-black/30">
              {loading ? t('common.sending') : `${t('llevar.datos.submit')} · ${total.toFixed(2)}€`}
            </button>
            {pago === 'online' && <p className="text-center text-xs text-sand">{t('llevar.datos.onlineNote')}</p>}
          </form>
        </main>
      </div>
    )
  }

  // ── MENÚ (PRINCIPAL) ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-ink font-sans">
      <AvisoComanda />
      <header className="bg-surface border-b border-line sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="min-h-14 py-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="text-sand hover:text-parchment text-sm font-medium">{t('menu.back')}</Link>
              <span className="font-black text-base sm:text-lg text-parchment">{t('llevar.menu.title')} 🛵</span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="dark" />
              {cliente ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-sand bg-ink border border-line px-3 py-1.5 rounded-full font-medium">👤 {cliente.nombre}</span>
                  <button onClick={cerrarSesion} className="text-xs text-sand hover:text-parchment">{t('common.logoutShort')}</button>
                </div>
              ) : (
                <button onClick={() => setStep('auth')} className="text-xs text-amber font-semibold">{t('common.loginShort')}</button>
              )}
            </div>
          </div>
          <div className="pb-3">
            <CategoryScroller categorias={categoriasVisibles} activeId={cat} onSelect={setCat} />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-3 pb-28">
        <div className="space-y-2">
          {filtrados.length === 0 && cat === '' && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
              <p className="text-sand text-sm">{t('llevar.menu.loading')}</p>
            </div>
          )}
          {filtrados.map(p => <MenuCard key={p.id} producto={p} suplementos={suplementos} />)}
        </div>
      </main>

      {count > 0 && (
        <button
          onClick={() => setStep('entrega')}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-amber text-amber-ink px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-semibold hover:bg-amber-dark transition-colors">
          <span className="bg-amber-ink text-amber text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
          {t('llevar.menu.continue')}
          <span className="font-bold">{total.toFixed(2)}€</span>
        </button>
      )}
    </div>
  )
}
