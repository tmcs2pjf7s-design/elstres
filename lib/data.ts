import { Categoria, Producto, Mesa, Pedido, EstadoPedido, CartItem, Impresora, Usuario, StaffRol, Contenido, ContenidoTipo, TarjetaFidelidad } from './types'
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

// Por defecto excluye los productos solo_comandero para que la carta del
// cliente no los muestre. El comandero y el admin piden { incluirSoloComandero: true }.
export async function getProductos(opts: { incluirSoloComandero?: boolean } = {}): Promise<Producto[]> {
  const productos = (await get<Producto[]>('/productos')) ?? mockProductos
  return opts.incluirSoloComandero ? productos : productos.filter(p => !p.solo_comandero)
}

export async function getMesas(): Promise<Mesa[]> {
  return (await get<Mesa[]>('/mesas')) ?? mockMesas
}

export async function getPedidosActivos(): Promise<Pedido[]> {
  return (await get<Pedido[]>('/pedidos')) ?? mockPedidos
}

// Todos los pedidos de una fecha (incluye entregados y cancelados) —
// necesario para facturar una mesa, ya que getPedidosActivos() excluye
// los pedidos ya entregados.
export async function getPedidosDelDia(fecha: string): Promise<Pedido[]> {
  const data = await get<{ pedidos: Pedido[] }>(`/historial?fecha=${fecha}`)
  return data?.pedidos ?? []
}

export async function createPedido(
  tipo: 'mesa' | 'llevar',
  items: CartItem[],
  opts: { mesa_id?: string; cliente_nombre?: string; cliente_telefono?: string; notas?: string; tipo_entrega?: 'recogida' | 'domicilio'; direccion_entrega?: string }
): Promise<number> {
  const total = parseFloat(
    items.reduce((s, i) => s + (i.variante?.precio ?? i.producto.precio) * i.cantidad, 0).toFixed(2)
  )
  const data = await post<{ numero_orden: number }>('/pedidos', { tipo, total, items, ...opts })
  return data?.numero_orden ?? Math.floor(Math.random() * 900) + 100
}

export async function updateEstadoPedido(id: string, estado: EstadoPedido): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    return res.ok
  } catch {
    return false
  }
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

export async function getPersonal(): Promise<Usuario[]> {
  return (await get<Usuario[]>('/personal')) ?? []
}

export async function createPersonal(data: { nombre: string; email: string; telefono?: string; password: string; rol: StaffRol }): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}/personal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) return { ok: false, error: body.error }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Error de conexión' }
  }
}

export async function setPersonalActivo(id: string, activo: boolean): Promise<void> {
  try {
    await fetch(`${BASE}/personal/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo }),
    })
  } catch {}
}

export async function getContenidos(tipo: ContenidoTipo, soloActivos = true): Promise<Contenido[]> {
  return (await get<Contenido[]>(`/contenidos?tipo=${tipo}&activos=${soloActivos}`)) ?? []
}

export async function createContenido(data: { tipo: ContenidoTipo; titulo: string; descripcion?: string; enlace?: string; imagen?: string; orden?: number }): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}/contenidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) return { ok: false, error: body.error }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Error de conexión' }
  }
}

export async function updateContenido(id: string, data: Partial<Pick<Contenido, 'titulo' | 'descripcion' | 'enlace' | 'imagen' | 'activo' | 'orden'>>): Promise<void> {
  try {
    await fetch(`${BASE}/contenidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {}
}

export async function deleteContenido(id: string): Promise<void> {
  try {
    await fetch(`${BASE}/contenidos/${id}`, { method: 'DELETE' })
  } catch {}
}

export async function getMiTarjeta(clienteId: string): Promise<TarjetaFidelidad | null> {
  try {
    const res = await fetch(`${BASE}/fidelidad/mi-tarjeta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente_id: clienteId }),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function buscarTarjeta(codigo: string): Promise<TarjetaFidelidad | { error: string }> {
  try {
    const res = await fetch(`${BASE}/fidelidad/buscar?codigo=${encodeURIComponent(codigo)}`)
    const body = await res.json()
    if (!res.ok) return { error: body.error ?? 'Error' }
    return body
  } catch {
    return { error: 'Error de conexión' }
  }
}

export async function anadirSello(codigo: string): Promise<TarjetaFidelidad | { error: string }> {
  try {
    const res = await fetch(`${BASE}/fidelidad/sello`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo }),
    })
    const body = await res.json()
    if (!res.ok) return { error: body.error ?? 'Error' }
    return body
  } catch {
    return { error: 'Error de conexión' }
  }
}

export async function canjearPremio(codigo: string): Promise<TarjetaFidelidad | { error: string }> {
  try {
    const res = await fetch(`${BASE}/fidelidad/canjear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo }),
    })
    const body = await res.json()
    if (!res.ok) return { error: body.error ?? 'Error' }
    return body
  } catch {
    return { error: 'Error de conexión' }
  }
}
