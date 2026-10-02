'use client'
import { useRef, useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Categoria } from '@/lib/types'

interface Props {
  categorias: Categoria[]
  activeId: string
  onSelect: (id: string) => void
}

export default function CategoryScroller({ categorias, activeId, onSelect }: Props) {
  const { t } = useLanguage()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

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

  useEffect(() => {
    if (!activeId) return
    const el = scrollerRef.current?.querySelector<HTMLElement>(`[data-cat="${activeId}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeId, categorias])

  const scrollByAmount = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button onClick={() => scrollByAmount(-1)} aria-label={t('menu.scrollLeft')}
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-0.5 pr-4 bg-gradient-to-r from-surface via-surface/95 to-transparent">
          <span className="w-6 h-6 rounded-full bg-ink shadow-md border border-line flex items-center justify-center text-amber text-sm leading-none">‹</span>
        </button>
      )}
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-1 scroll-smooth snap-x snap-mandatory"
      >
        {categorias.map(c => (
          <button key={c.id} data-cat={c.id} onClick={() => onSelect(c.id)}
            className={`flex-shrink-0 snap-start h-11 px-4 rounded-full text-sm font-bold transition-colors whitespace-nowrap border-2 ${
              activeId === c.id ? 'bg-amber border-amber text-amber-ink' : 'border-amber text-amber'
            }`}>
            {c.nombre}
          </button>
        ))}
      </div>
      {canScrollRight && (
        <button onClick={() => scrollByAmount(1)} aria-label={t('menu.scrollRight')}
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-0.5 pl-4 bg-gradient-to-l from-surface via-surface/95 to-transparent">
          <span className="w-6 h-6 rounded-full bg-ink shadow-md border border-line flex items-center justify-center text-amber text-sm leading-none">›</span>
        </button>
      )}
    </div>
  )
}
