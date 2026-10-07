'use client'
import ContenidoList from '@/components/ContenidoList'
import TarjetaFidelidadCard from '@/components/TarjetaFidelidadCard'

export default function PromocionesPage() {
  return (
    <ContenidoList
      tipo="promocion"
      titleKey="promociones.title"
      subtitleKey="promociones.subtitle"
      emptyKey="promociones.empty"
      topContent={<TarjetaFidelidadCard />}
    />
  )
}
