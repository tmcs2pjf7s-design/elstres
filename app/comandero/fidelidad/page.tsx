'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { buscarTarjeta, anadirSello, canjearPremio } from '@/lib/data'
import { TarjetaFidelidad, SELLOS_PARA_PREMIO } from '@/lib/types'

type Estado = 'idle' | 'buscando' | 'encontrada' | 'error'

export default function FidelidadScannerPage() {
  const [codigoInput, setCodigoInput] = useState('')
  const [tarjeta, setTarjeta] = useState<TarjetaFidelidad | null>(null)
  const [estado, setEstado] = useState<Estado>('idle')
  const [mensaje, setMensaje] = useState('')
  const [accionando, setAccionando] = useState(false)
  const [escaneando, setEscaneando] = useState(false)
  const [soportaEscaneo, setSoportaEscaneo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    setSoportaEscaneo(typeof window !== 'undefined' && 'BarcodeDetector' in window)
  }, [])

  const buscar = useCallback(async (codigo: string) => {
    const cod = codigo.trim().toUpperCase()
    if (!cod) return
    setEstado('buscando')
    setMensaje('')
    const res = await buscarTarjeta(cod)
    if ('error' in res) {
      setTarjeta(null)
      setEstado('error')
      setMensaje(res.error)
    } else {
      setTarjeta(res)
      setEstado('encontrada')
    }
  }, [])

  const detenerCamara = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setEscaneando(false)
  }, [])

  const iniciarCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setEscaneando(true)
      const BarcodeDetectorCtor = (window as any).BarcodeDetector
      const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] })
      const tick = async () => {
        if (!videoRef.current) return
        try {
          const codes = await detector.detect(videoRef.current)
          if (codes.length > 0) {
            detenerCamara()
            buscar(codes[0].rawValue)
            return
          }
        } catch {}
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      setMensaje('No se pudo acceder a la cámara. Prueba a introducir el código a mano.')
    }
  }

  useEffect(() => () => detenerCamara(), [detenerCamara])

  const handleSello = async () => {
    if (!tarjeta) return
    setAccionando(true)
    const res = await anadirSello(tarjeta.codigo)
    if ('error' in res) {
      setMensaje(res.error)
    } else {
      setTarjeta({ ...res, cliente_nombre: tarjeta.cliente_nombre })
      setMensaje('✓ Sello añadido')
    }
    setAccionando(false)
  }

  const handleCanjear = async () => {
    if (!tarjeta) return
    if (!confirm(`¿Confirmar que ${tarjeta.cliente_nombre} se lleva un café gratis?`)) return
    setAccionando(true)
    const res = await canjearPremio(tarjeta.codigo)
    if ('error' in res) {
      setMensaje(res.error)
    } else {
      setTarjeta({ ...res, cliente_nombre: tarjeta.cliente_nombre })
      setMensaje('🎉 Premio canjeado')
    }
    setAccionando(false)
  }

  const reiniciar = () => {
    setTarjeta(null)
    setEstado('idle')
    setMensaje('')
    setCodigoInput('')
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center gap-3">
          <Link href="/comandero" className="text-gray-400 text-sm font-medium">← Comandero</Link>
          <span className="font-black text-lg">☕ Fidelidad</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6">
        {!tarjeta ? (
          <>
            {escaneando ? (
              <div className="rounded-2xl overflow-hidden bg-black relative mb-4">
                <video ref={videoRef} className="w-full aspect-square object-cover" muted playsInline />
                <button onClick={detenerCamara}
                  className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                  Cancelar
                </button>
              </div>
            ) : soportaEscaneo ? (
              <button onClick={iniciarCamara}
                className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-base hover:bg-accent-dark transition-colors mb-4">
                📷 Escanear código QR
              </button>
            ) : (
              <p className="text-xs text-gray-400 mb-4 text-center">
                Tu navegador no soporta escaneo de QR aquí — introduce el código a mano.
              </p>
            )}

            <form onSubmit={e => { e.preventDefault(); buscar(codigoInput) }} className="flex gap-2">
              <input
                type="text"
                value={codigoInput}
                onChange={e => setCodigoInput(e.target.value.toUpperCase())}
                placeholder="Código de la tarjeta"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-accent"
              />
              <button type="submit" disabled={estado === 'buscando'}
                className="bg-accent text-white px-5 rounded-xl font-semibold text-sm hover:bg-accent-dark transition-colors disabled:opacity-50">
                Buscar
              </button>
            </form>

            {estado === 'error' && (
              <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3 mt-4">{mensaje}</p>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Tarjeta de</p>
            <h2 className="text-2xl font-black mb-4">{tarjeta.cliente_nombre}</h2>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {Array.from({ length: SELLOS_PARA_PREMIO }).map((_, i) => (
                <div key={i} className={`aspect-square rounded-full flex items-center justify-center text-lg border-2 ${
                  i < tarjeta.sellos ? 'bg-accent border-accent' : 'border-gray-200'
                }`}>
                  {i < tarjeta.sellos ? '☕' : ''}
                </div>
              ))}
            </div>
            <p className="text-center font-bold mb-5">{Math.min(tarjeta.sellos, SELLOS_PARA_PREMIO)} de {SELLOS_PARA_PREMIO} sellos</p>

            {mensaje && <p className="text-center text-sm font-semibold text-accent mb-4">{mensaje}</p>}

            <div className="flex gap-3">
              <button onClick={handleSello} disabled={accionando}
                className="flex-1 bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent-dark transition-colors disabled:opacity-50">
                + Sello
              </button>
              <button onClick={handleCanjear} disabled={accionando || tarjeta.sellos < SELLOS_PARA_PREMIO}
                className="flex-1 bg-green-600 text-white py-3.5 rounded-2xl font-bold hover:bg-green-700 transition-colors disabled:opacity-40">
                Canjear premio
              </button>
            </div>

            <button onClick={reiniciar} className="w-full mt-4 py-2 text-gray-400 text-sm font-medium">
              ← Buscar otra tarjeta
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
