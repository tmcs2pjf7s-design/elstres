'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCategorias, getProductos } from '@/lib/data'
import { Categoria, Producto } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import AllergenBadges from '@/components/AllergenBadges'
import CategoryScroller from '@/components/CategoryScroller'

export default function CategoriaPage({ params }: { params: { categoria: string } }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([getCategorias(), getProductos()]).then(([cats, prods]) => {
      setCategorias(cats.filter(c => c.tipo !== 'suplemento'))
      setProductos(prods)
      setLoaded(true)
    })
  }, [])

  const categoria = categorias.find(c => c.id === params.categoria)
  const productosCategoria = productos.filter(p => p.disponible && p.categoria_id === params.categoria)

  return (
    <div className="min-h-screen bg-ink font-sans flex flex-col">
      <header className="bg-surface border-b border-line sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4">
          <div className="h-14 relative flex items-center justify-center">
            <Link href="/menu" aria-label={t('menu.categoria.back')}
              className="absolute left-0 w-11 h-11 flex items-center justify-center text-parchment text-xl">
              ←
            </Link>
            <img src="/logo-els-tr3s-solo.png" alt="Els Tr3s" className="h-8 w-auto" />
          </div>
          {categorias.length > 0 && (
            <div className="pb-3">
              <CategoryScroller categorias={categorias} activeId={params.categoria} onSelect={id => router.push(`/menu/${id}`)} />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 py-5 pb-8 flex-1">
        <div className="flex items-end justify-between gap-3 border-b-[3px] border-amber pb-3 mb-1">
          <h1 className="font-display text-[26px] text-parchment uppercase leading-none">
            {categoria?.nombre ?? (loaded ? '' : '…')}
          </h1>
          {loaded && (
            <span className="text-sand text-sm flex-shrink-0">{productosCategoria.length} {t('menu.categoria.items')}</span>
          )}
        </div>

        {!loaded ? (
          <div className="space-y-0 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-4 border-b border-line animate-pulse">
                <div className="h-4 bg-surface rounded-lg w-2/5 mb-2" />
                <div className="h-3 bg-surface rounded-lg w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          productosCategoria.map(p => (
            <div key={p.id} className="py-4 border-b border-line flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-parchment font-bold text-[17px] leading-snug">{p.nombre}</h3>
                {p.descripcion && <p className="text-sand text-sm mt-1 leading-[1.4]">{p.descripcion}</p>}
                <AllergenBadges codigos={p.alergenos} className="mt-1.5" variant="dark" />
              </div>
              <div className="flex-shrink-0 text-right">
                {p.variantes ? (
                  <div className="space-y-0.5">
                    {p.variantes.map(v => (
                      <p key={v.nombre} className="whitespace-nowrap">
                        <span className="text-sand text-xs font-bold uppercase mr-1.5">{v.nombre}</span>
                        <span className="font-display text-lg text-amber">{v.precio.toFixed(2)}€</span>
                      </p>
                    ))}
                  </div>
                ) : (
                  <span className="font-display text-[22px] text-amber whitespace-nowrap">{p.precio.toFixed(2)}€</span>
                )}
              </div>
            </div>
          ))
        )}

        {categoria?.nombre === 'Cervezas' && (
          <p className="text-sand/60 text-[11px] leading-relaxed mt-6">{t('menu.terraceSurcharge')}</p>
        )}
      </main>

      <div className="sticky bottom-0 bg-surface border-t border-line px-4 py-3.5">
        <div className="max-w-lg mx-auto flex items-center justify-between text-sand text-sm">
          <span>{t('menu.categoria.vat')}</span>
          <Link href="/alergenos" className="text-amber font-bold">{t('menu.categoria.viewAllergens')}</Link>
        </div>
      </div>
    </div>
  )
}
