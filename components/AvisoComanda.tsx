'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const STORAGE_KEY = 'aviso_comanda_ok'

export default function AvisoComanda() {
  const { t } = useLanguage()
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
            <h2 className="text-lg font-black leading-snug">{t('avisoComanda.title')}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-700 text-sm leading-relaxed">
            {t('avisoComanda.p1Pre')} <strong>{t('avisoComanda.p1Bold')}</strong>.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mt-3">
            {t('avisoComanda.p2Pre')} <strong>{t('avisoComanda.p2Bold')}</strong> {t('avisoComanda.p2Post')}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            {t('avisoComanda.p3')}
          </p>

          <button
            onClick={aceptar}
            className="mt-6 w-full bg-accent hover:bg-accent-dark text-white py-4 rounded-2xl font-bold text-base transition-colors active:scale-95"
          >
            {t('avisoComanda.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
