'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { ALERGENO_ICONOS } from '@/lib/alergenos'

export default function AlergenosPage() {
  const { t } = useLanguage()
  const codigos = Object.keys(ALERGENO_ICONOS)

  return (
    <div className="min-h-screen bg-ink font-sans flex flex-col">
      <header className="bg-surface border-b border-line">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/menu" aria-label={t('menu.categoria.back')}
            className="w-11 h-11 -ml-2 flex items-center justify-center text-parchment text-xl">
            ←
          </Link>
          <span className="font-display text-xl text-parchment uppercase tracking-wide">{t('menuCard.allergensTitle')}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 py-6 flex-1">
        <p className="text-sand text-sm leading-relaxed mb-6">{t('menuCard.allergensNote')}</p>
        <div className="grid grid-cols-2 gap-2.5">
          {codigos.map(codigo => (
            <div key={codigo} className="bg-surface border border-line rounded-xl px-3.5 py-3 flex items-center gap-2.5">
              <span className="text-xl" aria-hidden="true">{ALERGENO_ICONOS[codigo]}</span>
              <span className="text-parchment text-sm font-semibold">{t(`alergeno.${codigo}`)}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
