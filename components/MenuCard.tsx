'use client'
import { useState } from 'react'
import { Producto, Variante } from '@/lib/types'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'

interface Props {
  producto: Producto
  suplementos?: Producto[]
}

export default function MenuCard({ producto, suplementos = [] }: Props) {
  const { t } = useLanguage()
  const { addItem, items, updateQty } = useCart()
  const [showVariantes, setShowVariantes] = useState(false)
  const [showSups, setShowSups] = useState(false)
  const [supsSel, setSupsSel] = useState<Set<string>>(new Set())
  const [variantePendiente, setVariantePendiente] = useState<Variante | undefined>(undefined)

  const tieneVariantes = !!producto.variantes?.length
  const precioBase = Number(tieneVariantes ? producto.variantes![0].precio : producto.precio)
  const cartItems = items.filter(i => i.producto.id === producto.id)
  const totalQty = cartItems.reduce((s, i) => s + i.cantidad, 0)

  const esBocadillo = (producto as any).categoria_nombre?.toLowerCase().includes('bocadillo')
  const tieneSups = esBocadillo && suplementos.length > 0

  const confirmarConSups = (variante?: Variante) => {
    addItem(producto, variante)
    supsSel.forEach(id => {
      const sup = suplementos.find(s => s.id === id)
      if (sup) addItem(sup)
    })
    setSupsSel(new Set())
    setShowSups(false)
    setShowVariantes(false)
    setVariantePendiente(undefined)
  }

  const handleAnadir = () => {
    if (tieneVariantes) {
      setShowVariantes(true)
    } else if (tieneSups) {
      setShowSups(true)
    } else {
      addItem(producto)
    }
  }

  const handleVariante = (v: Variante) => {
    if (tieneSups) {
      setVariantePendiente(v)
      setShowVariantes(false)
      setShowSups(true)
    } else {
      addItem(producto, v)
      setShowVariantes(false)
    }
  }

  const toggleSup = (id: string) => {
    setSupsSel(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <>
      <div className={`bg-white rounded-2xl border shadow-sm flex items-center gap-4 p-4 transition-colors ${totalQty > 0 ? 'border-accent/30 bg-accent/[0.02]' : 'border-gray-100'}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{producto.nombre}</h3>
            {totalQty > 0 && (
              <span className="flex-shrink-0 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalQty}</span>
            )}
          </div>
          {producto.descripcion && (
            <p className="text-gray-400 text-xs mt-0.5 line-clamp-2 leading-relaxed">{producto.descripcion}</p>
          )}
          {tieneVariantes ? (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {producto.variantes!.map(v => (
                <span key={v.nombre} className="text-xs bg-orange-50 text-accent px-2 py-0.5 rounded-lg font-semibold">
                  {v.nombre} {Number(v.precio).toFixed(2)}€
                </span>
              ))}
            </div>
          ) : (
            <p className="text-accent font-black text-base mt-1.5">{precioBase.toFixed(2)}€</p>
          )}
        </div>

        <div className="flex-shrink-0">
          {totalQty === 0 ? (
            <button onClick={handleAnadir}
              className="w-11 h-11 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shadow-orange-200 active:scale-90 transition-transform">
              +
            </button>
          ) : (
            <div className="flex flex-col items-end gap-1.5">
              {cartItems.map(item => (
                <div key={item.variante?.nombre ?? 'base'} className="flex items-center gap-2">
                  {item.variante && <span className="text-xs text-gray-500 font-medium">{item.variante.nombre}</span>}
                  <button onClick={() => updateQty(producto.id, item.cantidad - 1, item.variante)}
                    className="w-9 h-9 rounded-full border-2 border-gray-200 text-gray-600 flex items-center justify-center font-bold text-base active:scale-90 transition-transform">
                    −
                  </button>
                  <span className="w-5 text-center font-black text-sm">{item.cantidad}</span>
                  <button onClick={() => tieneVariantes ? setShowVariantes(true) : tieneSups ? setShowSups(true) : addItem(producto)}
                    className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-base active:scale-90 transition-transform">
                    +
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL VARIANTES ──────────────────────────────────── */}
      {showVariantes && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={() => setShowVariantes(false)}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="font-black text-xl mb-1">{producto.nombre}</h3>
            {producto.descripcion && <p className="text-gray-400 text-sm mb-5">{producto.descripcion}</p>}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('menuCard.chooseSize')}</p>
            <div className="space-y-3 mb-2">
              {producto.variantes!.map(v => (
                <button key={v.nombre} onClick={() => handleVariante(v)}
                  className="w-full flex items-center justify-between bg-gray-50 hover:bg-accent/5 active:bg-accent/10 border-2 border-transparent hover:border-accent rounded-2xl px-5 py-4 transition-all">
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-base">{v.nombre}</p>
                  </div>
                  <span className="text-2xl font-black text-accent">{Number(v.precio).toFixed(2)}€</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowVariantes(false)} className="w-full py-4 text-gray-400 text-sm font-semibold">{t('menuCard.cancel')}</button>
          </div>
        </div>
      )}

      {/* ── MODAL SUPLEMENTOS ────────────────────────────────── */}
      {showSups && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={() => { setShowSups(false); setSupsSel(new Set()) }}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="font-black text-xl mb-1">{producto.nombre}</h3>
            {variantePendiente && (
              <span className="inline-block text-xs bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-lg mb-3">{variantePendiente.nombre}</span>
            )}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('menuCard.addSupplements')}</p>

            <div className="space-y-2 mb-5">
              {suplementos.map(sup => {
                const sel = supsSel.has(sup.id)
                return (
                  <button key={sup.id} onClick={() => toggleSup(sup.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${
                      sel ? 'border-accent bg-accent/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        sel ? 'bg-accent border-accent' : 'border-gray-300'
                      }`}>
                        {sel && <span className="text-white text-xs font-black">✓</span>}
                      </div>
                      <span className="font-semibold text-sm text-gray-800">{sup.nombre}</span>
                    </div>
                    <span className="text-sm font-bold text-accent">+{Number(sup.precio).toFixed(2)}€</span>
                  </button>
                )
              })}
            </div>

            {supsSel.size > 0 && (
              <p className="text-xs text-gray-500 text-center mb-3">
                +{suplementos.filter(s => supsSel.has(s.id)).reduce((sum, s) => sum + Number(s.precio), 0).toFixed(2)}€ {t('menuCard.supplementsTotal')}
              </p>
            )}

            <button onClick={() => confirmarConSups(variantePendiente)}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-base hover:bg-accent-dark transition-colors active:scale-95">
              {supsSel.size > 0 ? t('menuCard.addWithSupplements') : t('menuCard.addWithoutSupplements')}
            </button>
            <button onClick={() => { setShowSups(false); setSupsSel(new Set()) }}
              className="w-full py-3 text-gray-400 text-sm font-semibold mt-1">
              {t('menuCard.cancel')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
