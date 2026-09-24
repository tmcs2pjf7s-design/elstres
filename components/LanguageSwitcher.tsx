'use client'
import { useLanguage } from '@/context/LanguageContext'
import { LOCALES } from '@/lib/i18n/translations'

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

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
