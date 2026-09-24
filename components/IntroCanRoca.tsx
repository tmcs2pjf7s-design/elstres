'use client'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'intro_can_roca_seen'
const AUTO_DISMISS_MS = 4200

export default function IntroCanRoca() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return
    } catch {}
    setVisible(true)
  }, [])

  useEffect(() => {
    if (!visible) return
    const dismissTimer = setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(dismissTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const dismiss = () => {
    setClosing(true)
    try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
    setTimeout(() => setVisible(false), 450)
  }

  if (!visible) return null

  return (
    <div
      onClick={dismiss}
      role="button"
      aria-label="Cerrar presentación"
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-[#0b1420] cursor-pointer transition-opacity duration-[450ms] ease-out ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative w-full h-full max-h-screen flex items-center justify-center overflow-hidden">
        {/* Wrapper mantiene la proporción exacta de la imagen para que los overlays encajen siempre */}
        <div
          className="intro-anim-enter intro-anim-float relative"
          style={{ width: '100%', maxWidth: '100vw', aspectRatio: '2080 / 756', maxHeight: '100vh' }}
        >
          <div className="intro-anim-breathe w-full h-full relative">
            <img
              src="/can-roca-proximamente.jpg"
              alt="Els tr3s Can Roca · Próximamente"
              className="absolute inset-0 w-full h-full object-cover select-none"
              draggable={false}
            />

            {/* Revelado suave de "Can Roca", ligeramente retrasado respecto al logo */}
            <div
              className="intro-anim-reveal-mask absolute pointer-events-none"
              style={{
                left: '30%', width: '40%', top: '39%', height: '20%',
                background: 'radial-gradient(ellipse at center, rgba(10,16,28,0.92) 0%, rgba(10,16,28,0.6) 55%, rgba(10,16,28,0) 100%)',
              }}
            />

            {/* Brillo/pulso muy sutil sobre "PRÓXIMAMENTE" */}
            <div
              className="intro-anim-glow absolute pointer-events-none"
              style={{
                left: '24%', width: '52%', top: '71%', height: '22%',
                background: 'radial-gradient(ellipse at center, rgba(232,93,4,0.5) 0%, rgba(232,93,4,0.15) 55%, rgba(232,93,4,0) 80%)',
                mixBlendMode: 'screen',
              }}
            />

            {/* Reflejo de luz que recorre la zona de la cerveza */}
            <div
              className="absolute pointer-events-none overflow-hidden"
              style={{ left: '0%', width: '22%', top: '0%', height: '82%' }}
            >
              <div
                className="intro-anim-shimmer absolute"
                style={{
                  left: '-30%', top: '-30%', width: '60%', height: '160%',
                  background: 'linear-gradient(75deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)',
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); dismiss() }}
          aria-label="Cerrar"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg backdrop-blur-sm transition-colors"
        >
          ✕
        </button>

        <p
          className={`intro-anim-hint absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs sm:text-sm font-medium tracking-wide transition-opacity duration-300 ${
            closing ? 'opacity-0' : ''
          }`}
        >
          Toca para continuar
        </p>
      </div>
    </div>
  )
}
