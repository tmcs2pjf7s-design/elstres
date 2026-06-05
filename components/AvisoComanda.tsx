'use client'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'aviso_comanda_ok'

export default function AvisoComanda() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show once per session
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  const aceptar = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-accent px-6 pt-6 pb-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🍽️</span>
            <h2 className="text-lg font-black leading-snug">Antes de realizar tu pedido</h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-700 text-sm leading-relaxed">
            Le informamos que <strong>una vez solicitada la comanda, no se podrán realizar cambios</strong>.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mt-3">
            Por respeto a la calidad y la integridad de nuestros platos, <strong>no realizamos cambios en los ingredientes o la preparación</strong> de los mismos.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            Agradecemos su comprensión y esperamos que disfrute su experiencia culinaria en nuestro establecimiento.
          </p>

          <button
            onClick={aceptar}
            className="mt-6 w-full bg-accent hover:bg-accent-dark text-white py-4 rounded-2xl font-bold text-base transition-colors active:scale-95"
          >
            Entendido, continuar
          </button>
        </div>
      </div>
    </div>
  )
}
