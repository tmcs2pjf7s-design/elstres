'use client'
import { useLanguage } from '@/context/LanguageContext'
import { ALERGENO_ICONOS } from '@/lib/alergenos'

export default function AllergenBadges({ codigos, className = '' }: { codigos?: string[]; className?: string }) {
  const { t } = useLanguage()
  if (!codigos || codigos.length === 0) return null

  return (
    <div className={`flex gap-1 flex-wrap ${className}`}>
      {codigos.map(codigo => (
        <span
          key={codigo}
          title={t(`alergeno.${codigo}`)}
          className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md"
        >
          <span aria-hidden="true">{ALERGENO_ICONOS[codigo] ?? '⚠️'}</span>
          {t(`alergeno.${codigo}`)}
        </span>
      ))}
    </div>
  )
}
