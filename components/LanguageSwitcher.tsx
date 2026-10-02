'use client'
import { useLanguage } from '@/context/LanguageContext'
import { LOCALES } from '@/lib/i18n/translations'

interface Props {
  className?: string
  variant?: 'light' | 'dark'
}

export default function LanguageSwitcher({ className = '', variant = 'light' }: Props) {
  const { locale, setLocale } = useLanguage()

  if (variant === 'dark') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {LOCALES.map(l => (
          <button
            key={l.code}
            onClick={() => setLocale(l.code)}
            className={`w-11 h-11 flex items-center justify-center rounded-full border-2 border-amber text-xs font-bold transition-colors ${
              locale === l.code ? 'bg-amber text-amber-ink' : 'text-amber'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5 ${className}`}>
      {LOCALES.map(l => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${
            locale === l.code ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
