'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategorias } from '@/lib/data'
import { Categoria } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function MenuPortada() {
  const { t } = useLanguage()
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    getCategorias().then(cats => setCategorias(cats.filter(c => c.tipo !== 'suplemento')))
  }, [])

  return (
    <div className="min-h-screen bg-ink flex flex-col font-sans">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col px-6 py-6">
        {/* Fila superior */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber flex-shrink-0" />
            <span className="text-parchment text-sm font-bold">{t('menu.openLabel')} · {t('menu.hours')}</span>
          </div>
          <LanguageSwitcher variant="dark" />
        </div>

        {/* Logo */}
        <img src="/logo-els-tr3s-solo.png" alt="Els Tr3s" className="w-full h-auto mt-8" />

        {/* Etiqueta LA CARTA */}
        <span className="font-display text-[28px] leading-none bg-amber text-amber-ink px-3.5 py-1.5 self-start -rotate-2 mt-6 inline-block">
          {t('menu.portada.badge')}
        </span>

        {/* Tagline */}
        <p className="text-parchment text-[17px] font-medium leading-[1.4] mt-5 max-w-sm">
          {t('menu.portada.tagline')}
        </p>

        {/* Rejilla de categorías */}
        <div className="grid grid-cols-2 gap-3 mt-7">
          {categorias.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[88px] rounded-[14px] bg-surface animate-pulse" />
              ))
            : categorias.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/menu/${c.id}`}
                  className={`h-[88px] rounded-[14px] p-3.5 flex items-end active:scale-[0.97] transition-transform ${
                    i === 0 ? 'bg-amber' : 'bg-surface'
                  }`}
                >
                  <span className={`font-display text-2xl leading-none uppercase ${i === 0 ? 'text-amber-ink' : 'text-parchment'}`}>
                    {c.nombre}
                  </span>
                </Link>
              ))}
        </div>

        {/* Ver toda la carta */}
        <Link
          href="/menu/todo"
          className="h-14 rounded-full bg-parchment text-ink font-bold text-[17px] flex items-center justify-center mt-6 active:scale-95 transition-transform"
        >
          {t('menu.portada.viewAll')}
        </Link>

        <div className="flex-1 min-h-6" />

        {/* Pie */}
        <div className="flex items-end justify-between gap-3 mt-10 pt-5 border-t border-line text-sand text-sm font-medium">
          <Link href="/alergenos" className="text-amber font-bold">{t('menu.portada.allergensLink')}</Link>
          <div className="text-right leading-relaxed">
            <p>Passeig de Lluís Muncunill, 9</p>
            <a href="tel:930042165" className="text-sand">930 042 165</a>
          </div>
        </div>
      </div>
    </div>
  )
}
