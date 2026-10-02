'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getCategorias, getProductos } from '@/lib/data'
import { Categoria, Producto } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import AllergenBadges from '@/components/AllergenBadges'

export default function MenuPage() {
  const { t } = useLanguage()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cat, setCat] = useState('')
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    Promise.all([getCategorias(), getProductos()]).then(([cats, prods]) => {
      setCategorias(cats)
      setProductos(prods)
      if (cats.length) setCat(cats[0].id)
    })
  }, [])

  const updateScrollState = () => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
    return () => window.removeEventListener('resize', updateScrollState)
  }, [categorias])

  const scrollByAmount = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' })
  }

  const selectCat = (id: string) => {
    setCat(id)
    const el = scrollerRef.current?.querySelector<HTMLElement>(`[data-cat="${id}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  const categoriasVisibles = categorias.filter(c => c.tipo !== 'suplemento')
  const filtrados = productos.filter(p => p.disponible && p.categoria_id === cat && (p as any).categoria_tipo !== 'suplemento')
  const suplementos = productos.filter(p => p.disponible && (p as any).categoria_tipo === 'suplemento')

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-14 flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-900 font-medium text-sm p-1">{t('menu.back')}</Link>
            <span className="text-lg font-black">{t('menu.title')}</span>
            <LanguageSwitcher className="ml-auto" />
          </div>
          <div className="relative">
            {canScrollLeft && (
              <button onClick={() => scrollByAmount(-1)} aria-label={t('menu.scrollLeft')}
                className="absolute left-0 top-0 bottom-3 z-10 flex items-center pl-0.5 pr-4 bg-gradient-to-r from-white via-white/95 to-transparent">
                <span className="w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 text-sm leading-none">‹</span>
              </button>
            )}
            <div
              ref={scrollerRef}
              onScroll={updateScrollState}
              className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-1 px-1 scroll-smooth snap-x snap-mandatory"
            >
              {categoriasVisibles.map(c => (
                <button key={c.id} data-cat={c.id} onClick={() => selectCat(c.id)}
                  className={`flex-shrink-0 snap-start flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${cat === c.id ? 'bg-accent text-white shadow-sm' : 'bg-gray-100 text-gray-600'}`}>
                  <span>{c.icono}</span>
                  <span>{c.nombre}</span>
                </button>
              ))}
            </div>
            {canScrollRight && (
              <button onClick={() => scrollByAmount(1)} aria-label={t('menu.scrollRight')}
                className="absolute right-0 top-0 bottom-3 z-10 flex items-center pr-0.5 pl-4 bg-gradient-to-l from-white via-white/95 to-transparent">
                <span className="w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 text-sm leading-none">›</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 pb-8">
        <p className="text-gray-400 text-[11px] leading-relaxed mb-3 px-0.5">
          ℹ️ {t('menuCard.allergensNote')}
        </p>
        {cat === '' ? (
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 px-4 py-3.5 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg w-2/5" />
                  <div className="h-3 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-14 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="space-y-2">
          {filtrados.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 px-4 py-3.5">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{p.nombre}</h3>
                {p.descripcion && (
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-2 leading-relaxed">{p.descripcion}</p>
                )}
                {p.variantes ? (
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 mt-1">
                    {p.variantes.map(v => (
                      <p key={v.nombre} className="text-accent font-black text-base">
                        {v.precio.toFixed(2)}€<span className="text-gray-400 font-semibold text-xs ml-1">{v.nombre}</span>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-accent font-black text-base mt-1">{p.precio.toFixed(2)}€</p>
                )}
                <AllergenBadges codigos={p.alergenos} className="mt-1.5" />
              </div>
            </div>
          ))}
        </div>
        )}

        {suplementos.length > 0 && (
          <p className="text-[10px] text-gray-400 leading-relaxed mt-6 px-0.5">
            {t('home.footer.suplementos')}: {suplementos.map(s => `${s.nombre} ${Number(s.precio).toFixed(2)}€`).join(' · ')}
          </p>
        )}
      </main>
    </div>
  )
}
