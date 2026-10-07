export type ContenidoTipo = 'sorteo' | 'promocion'

export interface Contenido {
  id: string
  tipo: ContenidoTipo
  titulo: string
  descripcion: string
  enlace?: string
  activo: boolean
  orden: number
  created_at: string
}

export interface Categoria {
  id: string
  nombre: string
  orden: number
  icono: string
  tipo: 'normal' | 'suplemento'
}

export interface Producto {
  id: string
  categoria_id: string
  nombre: string
  descripcion: string
  precio: number
  imagen?: string
  disponible: boolean
  tiempo_prep: number
  variantes?: Variante[]
  alergenos?: string[]
}

export type StaffRol = 'admin' | 'camarero' | 'cocina'

export interface Usuario {
  id: string
  nombre: string
  email: string
  telefono?: string
  rol: StaffRol
  activo: boolean
  created_at: string
}

export interface Mesa {
  id: string
  numero: number
  capacidad: number
  estado: 'libre' | 'ocupada' | 'reservada'
  tipo: 'mesa' | 'barra'
}

export type TipoPedido = 'mesa' | 'llevar'
export type EstadoPedido =
  | 'pendiente'
  | 'confirmado'
  | 'en_preparacion'
  | 'listo'
  | 'entregado'
  | 'cancelado'

export interface PedidoItem {
  id: string
  pedido_id: string
  producto_id: string
  producto?: Producto
  cantidad: number
  precio: number
  notas?: string
}

export type TipoEntrega = 'recogida' | 'domicilio'

export interface Pedido {
  id: string
  tipo: TipoPedido
  tipo_entrega?: TipoEntrega
  direccion_entrega?: string
  mesa_id?: string
  mesa?: Mesa
  estado: EstadoPedido
  total: number
  cliente_nombre?: string
  cliente_telefono?: string
  notas?: string
  numero_orden: number
  items?: PedidoItem[]
  created_at: string
}

export interface Variante {
  nombre: string
  precio: number
}

export interface CartItem {
  producto: Producto
  cantidad: number
  variante?: Variante
  notas?: string
}

export type TipoImpresora = 'cocina' | 'barra' | 'ticket'
export type ProtocoloImpresora = 'bixolon' | 'epson' | 'ventana'

export interface Impresora {
  id: string
  nombre: string
  ip: string
  puerto: number
  tipo: TipoImpresora
  protocolo: ProtocoloImpresora
  activa: boolean
  categorias_ids: string[]
}
