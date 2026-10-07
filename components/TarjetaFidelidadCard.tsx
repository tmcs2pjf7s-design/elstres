'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { getMiTarjeta } from '@/lib/data'
import { TarjetaFidelidad, SELLOS_PARA_PREMIO } from '@/lib/types'

interface Cliente { id: string; nombre: string; email: string; telefono: string }

export default function TarjetaFidelidadCard() {
  const { t } = useLanguage()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [checked, setChecked] = useState(false)
  const [tarjeta, setTarjeta] = useState<TarjetaFidelidad | null>(null)

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({ nombre: '', email: '', password: '', telefono: '' })
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('clienteSession')
      if (saved) setCliente(JSON.parse(saved))
    } catch {}
    setChecked(true)
  }, [])

  useEffect(() => {
    if (cliente) getMiTarjeta(cliente.id).then(setTarjeta)
  }, [cliente])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    try {
      const url = authMode === 'login' ? '/api/clientes/login' : '/api/clientes/register'
      const body = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : authForm
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t('common.auth.error'))
      localStorage.setItem('clienteSession', JSON.stringify(data.cliente))
      setCliente(data.cliente)
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : t('common.auth.error'))
    } finally {
      setAuthLoading(false)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('clienteSession')
    setCliente(null)
    setTarjeta(null)
  }

  if (!checked) return null

  const inputClass = 'w-full border border-line bg-ink text-parchment placeholder:text-sand/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber'

  if (!cliente) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-5 mb-6">
        <h2 className="text-parchment font-bold text-base mb-1">☕ {t('fidelidad.title')}</h2>
        <p className="text-sand text-sm mb-4">{t('fidelidad.loginPrompt')}</p>
        <div className="flex bg-ink rounded-xl p-1 mb-4">
          {(['login', 'register'] as const).map(m => (
            <button key={m} type="button" onClick={() => { setAuthMode(m); setAuthError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${authMode === m ? 'bg-surface text-parchment' : 'text-sand'}`}>
              {m === 'login' ? t('common.auth.login') : t('common.auth.register')}
            </button>
          ))}
        </div>
        <form onSubmit={handleAuth} className="space-y-3">
          {authMode === 'register' && (
            <>
              <input type="text" required placeholder={t('common.auth.namePlaceholder')} value={authForm.nombre}
                onChange={e => setAuthForm(f => ({ ...f, nombre: e.target.value }))} className={inputClass} />
              <input type="tel" placeholder={t('common.auth.phonePlaceholder')} value={authForm.telefono}
                onChange={e => setAuthForm(f => ({ ...f, telefono: e.target.value }))} className={inputClass} />
            </>
          )}
          <input type="email" required placeholder={t('common.auth.emailPlaceholder')} value={authForm.email}
            onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
          <input type="password" required placeholder="••••••••" value={authForm.password}
            onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} className={inputClass} />
          {authError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{authError}</p>}
          <button type="submit" disabled={authLoading}
            className="w-full bg-amber text-amber-ink py-2.5 rounded-xl font-bold text-sm hover:bg-amber-dark transition-colors disabled:opacity-50">
            {authLoading ? t('common.auth.loading') : authMode === 'login' ? t('common.auth.submitLogin') : t('common.auth.submitRegister')}
          </button>
        </form>
      </div>
    )
  }

  if (!tarjeta) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-5 mb-6 animate-pulse">
        <div className="h-4 bg-line rounded w-2/5 mb-3" />
        <div className="h-24 bg-line/60 rounded-xl" />
      </div>
    )
  }

  const completa = tarjeta.sellos >= SELLOS_PARA_PREMIO
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&bgcolor=3A2408&color=F2A93B&data=${encodeURIComponent(tarjeta.codigo)}`

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 mb-6">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h2 className="text-parchment font-bold text-base">☕ {t('fidelidad.title')}</h2>
        <button onClick={cerrarSesion} className="text-sand/60 text-xs hover:text-sand flex-shrink-0">{t('fidelidad.logout')}</button>
      </div>
      <p className="text-sand text-sm mb-4">{t('fidelidad.desc')}</p>

      <div className="grid grid-cols-5 gap-2 mb-3">
        {Array.from({ length: SELLOS_PARA_PREMIO }).map((_, i) => (
          <div key={i} className={`aspect-square rounded-full flex items-center justify-center text-base border-2 ${
            i < tarjeta.sellos ? 'bg-amber border-amber' : 'border-line'
          }`}>
            {i < tarjeta.sellos ? '☕' : ''}
          </div>
        ))}
      </div>

      <p className="text-center text-parchment font-bold text-sm mb-1">
        {Math.min(tarjeta.sellos, SELLOS_PARA_PREMIO)} {t('fidelidad.stampsOf')}
      </p>

      {completa && (
        <p className="text-center text-amber font-bold text-sm mb-3">🎉 {t('fidelidad.rewardReady')}</p>
      )}

      <div className="flex flex-col items-center gap-2 bg-ink rounded-2xl p-4 mt-3">
        <img src={qrUrl} alt="QR tarjeta de fidelidad" width={140} height={140} className="rounded-lg" />
        <p className="font-display text-xl tracking-widest text-amber">{tarjeta.codigo}</p>
        <p className="text-sand/70 text-xs text-center leading-relaxed">{t('fidelidad.showCode')}</p>
      </div>

      {tarjeta.premios_canjeados > 0 && (
        <p className="text-sand/60 text-xs text-center mt-3">{tarjeta.premios_canjeados} {t('fidelidad.rewardsRedeemed')}</p>
      )}
    </div>
  )
}
