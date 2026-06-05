import { Categoria, Producto, Mesa, Pedido, EstadoPedido, CartItem, Impresora } from './types'
import { mockCategorias, mockProductos, mockMesas, mockPedidos } from './mockData'

const BASE = '/api/data'

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`)
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

async function post<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function getCategorias(): Promise<Categoria[]> {
  return (await get<Categoria[]>('/categorias')) ?? mockCategorias
}

export async function getProductos(): Promise<Producto[]> {
  return (await get<Producto[]>('/productos')) ?? mockProductos
}

export async function getMesas(): Promise<Mesa[]> {
  return (await get<Mesa[]>('/mesas')) ?? mockMesas
}

export async function getPedidosActivos(): Promise<Pedido[]> {
  return (await get<Pedido[]>('/pedidos')) ?? mockPedidos
}

export async function createPedido(
  tipo: 'mesa' | 'llevar',
  items: CartItem[],
  opts: { mesa_id?: string; cliente_nombre?: string; cliente_telefono?: string; notas?: string }
): Promise<number> {
  const total = parseFloat(
    items.reduce((s, i) => s + (i.variante?.precio ?? i.producto.precio) * i.cantidad, 0).toFixed(2)
  )
  const data = await post<{ numero_orden: number }>('/pedidos', {
    tipo, total, items, ...opts,
  })
  return data?.numero_orden ?? Math.floor(Math.random() * 900) + 100
}

export async function updateEstadoPedido(id: string, estado: EstadoPedido): Promise<void> {
  try {
    await fetch(`${BASE}/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
  } catch {}
}

export async function updateMesaEstado(id: string, estado: Mesa['estado']): Promise<void> {
  try {
    await fetch(`${BASE}/mesas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
  } catch {}
}

export async function createMesa(numero: number, capacidad: number, tipo: 'mesa' | 'barra'): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}/mesas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero, capacidad, tipo }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Error de conexión' }
  }
}

export async function deleteMesa(id: string): Promise<void> {
  try {
    await fetch(`${BASE}/mesas/${id}`, { method: 'DELETE' })
  } catch {}
}

export async function upsertProducto(p: Partial<Producto> & { nombre: string; precio: number }): Promise<void> {
  await post('/productos', p)
}

export async function deleteProducto(id: string): Promise<void> {
  try {
    await fetch(`${BASE}/productos/${id}`, { method: 'DELETE' })
  } catch {}
}

export async function getImpresoras(): Promise<Impresora[]> {
  return (await get<Impresora[]>('/impresoras')) ?? []
}

export async function upsertImpresora(imp: Partial<Impresora> & { nombre: string; ip: string; tipo: string }): Promise<void> {
  await post('/impresoras', imp)
}

export async function deleteImpresora(id: string): Promise<void> {
  try {
    await fetch(`${BASE}/impresoras/${id}`, { method: 'DELETE' })
  } catch {}
}
