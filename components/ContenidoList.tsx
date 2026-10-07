'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getContenidos } from '@/lib/data'
import { Contenido, ContenidoTipo } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import CartaFooter from '@/components/CartaFooter'

interface Props {
  tipo: ContenidoTipo
  titleKey: string
  subtitleKey: string
  emptyKey: string
}

export default function ContenidoList({ tipo, titleKey, subtitleKey, emptyKey }: Props) {
  const { t } = useLanguage()
  const [items, setItems] = useState<Contenido[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getContenidos(tipo).then(data => { setItems(data); setLoaded(true) })
  }, [tipo])

  return (
    <div className="min-h-screen bg-ink font-sans flex flex-col">
      <header className="bg-surface border-b border-line">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-sand text-sm font-medium hover:text-parchment">{t('legal.backHome')}</Link>
          <span className="font-display text-xl text-parchment uppercase tracking-wide">{t(titleKey)}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 py-6 flex-1">
        <p className="text-sand text-sm leading-relaxed mb-6">{t(subtitleKey)}</p>

        {!loaded ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-line p-5 animate-pulse">
                <div className="h-4 bg-line rounded-lg w-2/5 mb-2" />
                <div className="h-3 bg-line/70 rounded-lg w-3/4" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">{tipo === 'sorteo' ? '🎁' : '🏷️'}</p>
            <p className="text-sand text-sm leading-relaxed max-w-xs mx-auto">{t(emptyKey)}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-surface rounded-2xl border border-line p-5">
                <h3 className="text-parchment font-bold text-base leading-snug">{item.titulo}</h3>
                {item.descripcion && (
                  <p className="text-sand text-sm mt-1.5 leading-relaxed whitespace-pre-line">{item.descripcion}</p>
                )}
                {item.enlace && (
                  <a href={item.enlace} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 text-amber text-sm font-semibold hover:underline">
                    {t('contenido.moreInfo')}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <CartaFooter />
      </main>
    </div>
  )
}
