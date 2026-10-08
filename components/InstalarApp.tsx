'use client'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** Botón "Instalar app" del comandero (PWA). Se oculta si ya se abre como app. */
export default function InstalarApp() {
  const [evento, setEvento] = useState<BeforeInstallPromptEvent | null>(null)
  const [instalada, setInstalada] = useState(true)
  const [ayuda, setAyuda] = useState(false)

  useEffect(() => {
    setInstalada(window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true)
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw-comandero.js', { scope: '/comandero' }).catch(() => {})
    const onPrompt = (e: Event) => { e.preventDefault(); setEvento(e as BeforeInstallPromptEvent) }
    const onInstalled = () => { setInstalada(true); setEvento(null) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (instalada) return null

  const instalar = async () => {
    if (!evento) { setAyuda(true); return }
    await evento.prompt()
    const { outcome } = await evento.userChoice
    if (outcome === 'accepted') setInstalada(true)
    setEvento(null)
  }

  return (
    <>
      <button onClick={instalar}
        className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-gray-900 text-white hover:bg-black">
        📲 Instalar app
      </button>
      {ayuda && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4" onClick={() => setAyuda(false)}>
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 space-y-3" onClick={e => e.stopPropagation()}>
            <p className="font-black text-lg">Instalar el comandero</p>
            <div className="text-sm text-gray-600 space-y-2">
              <p><span className="font-bold text-gray-900">Android (Chrome):</span> pulsa el menú <span className="font-bold">⋮</span> arriba a la derecha y elige <span className="font-bold">“Instalar aplicación”</span> o <span className="font-bold">“Añadir a pantalla de inicio”</span>.</p>
              <p><span className="font-bold text-gray-900">iPhone (Safari):</span> pulsa <span className="font-bold">Compartir</span> y luego <span className="font-bold">“Añadir a pantalla de inicio”</span>.</p>
            </div>
            <button onClick={() => setAyuda(false)} className="w-full bg-accent text-white py-3 rounded-xl font-bold">Entendido</button>
          </div>
        </div>
      )}
    </>
  )
}
