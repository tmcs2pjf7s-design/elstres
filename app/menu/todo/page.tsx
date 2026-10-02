'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategorias, getProductos } from '@/lib/data'
import { Categoria, Producto } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import AllergenBadges from '@/components/AllergenBadges'
import CategoryScroller from '@/components/CategoryScroller'
import CartaFooter from '@/components/CartaFooter'

export default function MenuTodoPage() {
  const { t } = useLanguage()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cat, setCat] = useState('')

  useEffect(() => {
    Promise.all([getCategorias(), getProductos()]).then(([cats, prods]) => {
      setCategorias(cats)
      setProductos(prods)
      const primera = cats.find(c => c.tipo !== 'suplemento')
      if (primera) setCat(primera.id)
    })
  }, [])

  const categoriasVisibles = categorias.filter(c => c.tipo !== 'suplemento')
  const filtrados = productos.filter(p => p.disponible && p.categoria_id === cat && (p as any).categoria_tipo !== 'suplemento')
  const suplementos = productos.filter(p => p.disponible && (p as any).categoria_tipo === 'suplemento')

  return (
    <div className="min-h-screen bg-ink font-sans">
      <header className="bg-surface border-b border-line sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4">
          <div className="h-14 flex items-center gap-3">
            <Link href="/menu" className="w-11 h-11 -ml-2 flex items-center justify-center text-parchment text-xl flex-shrink-0">←</Link>
            <span className="font-display text-xl text-parchment uppercase tracking-wide truncate">{t('menu.todo.title')}</span>
            <LanguageSwitcher className="ml-auto flex-shrink-0" variant="dark" />
          </div>
          <div className="pb-3">
            <CategoryScroller categorias={categoriasVisibles} activeId={cat} onSelect={setCat} />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-10">
        <p className="text-sand text-[11px] leading-relaxed mb-3 px-0.5">
          ℹ️ {t('menuCard.allergensNote')}
        </p>
        {cat === '' ? (
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-line px-4 py-3.5 animate-pulse">
                <div className="h-4 bg-line rounded-lg w-2/5 mb-2" />
                <div className="h-3 bg-line/70 rounded-lg w-3/4 mb-2" />
                <div className="h-4 bg-line/70 rounded-lg w-14" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtrados.map(p => (
              <div key={p.id} className="bg-surface rounded-2xl border border-line px-4 py-3.5">
                <h3 className="font-bold text-parchment text-[15px] leading-snug">{p.nombre}</h3>
                {p.descripcion && (
                  <p className="text-sand text-xs mt-0.5 leading-relaxed">{p.descripcion}</p>
                )}
                {p.variantes ? (
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {p.variantes.map(v => (
                      <span key={v.nombre} className="text-xs bg-amber/15 text-amber px-2 py-0.5 rounded-lg font-semibold">
                        {v.nombre} {v.precio.toFixed(2)}€
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="mt-1.5">
                    <span className="text-xs bg-amber/15 text-amber px-2 py-0.5 rounded-lg font-semibold">
                      {p.precio.toFixed(2)}€
                    </span>
                  </div>
                )}
                <AllergenBadges codigos={p.alergenos} className="mt-1.5" variant="dark" />
              </div>
            ))}
          </div>
        )}

        {suplementos.length > 0 && (
          <p className="text-[10px] text-sand leading-relaxed mt-6 px-0.5">
            {t('home.footer.suplementos')}: {suplementos.map(s => `${s.nombre} ${Number(s.precio).toFixed(2)}€`).join(' · ')}
          </p>
        )}

        <p className="text-sand/60 text-[11px] leading-relaxed mt-6 px-0.5">{t('menu.terraceSurcharge')}</p>

        <CartaFooter />
      </main>
    </div>
  )
}
