import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

function parsePedido(row: any) {
  return {
    ...row,
    total: parseFloat(row.total ?? 0),
    mesa: row.mesa?.id ? row.mesa : undefined,
    items: (row.items ?? [])
      .filter((i: any) => i.id !== null)
      .map((i: any) => ({ ...i, precio: parseFloat(i.precio ?? 0) })),
  }
}

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        json_build_object('id', m.id, 'numero', m.numero, 'capacidad', m.capacidad, 'estado', m.estado, 'tipo', m.tipo) AS mesa,
        json_agg(
          json_build_object(
            'id', pi.id, 'pedido_id', pi.pedido_id, 'producto_id', pi.producto_id,
            'cantidad', pi.cantidad, 'precio', pi.precio, 'notas', pi.notas,
            'producto', json_build_object(
              'id', pr.id, 'nombre', pr.nombre, 'categoria_id', pr.categoria_id,
              'precio', pr.precio, 'variantes', pr.variantes
            )
          ) ORDER BY pi.created_at
        ) AS items
      FROM pedidos p
      LEFT JOIN mesas m ON p.mesa_id = m.id
      LEFT JOIN pedido_items pi ON pi.pedido_id = p.id
      LEFT JOIN productos pr ON pi.producto_id = pr.id
      WHERE p.estado NOT IN ('entregado','cancelado')
      GROUP BY p.id, m.id
      ORDER BY p.created_at ASC
    `)
    return NextResponse.json(rows.map(parsePedido))
  } catch (e) {
    console.error(e)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const client = await pool.connect()
  try {
    const { tipo, total, items, mesa_id, cliente_nombre, cliente_telefono, notas, tipo_entrega, direccion_entrega } = await req.json()
    // Mesa orders wait for waiter verification; takeaway goes straight to kitchen
    const estadoInicial = tipo === 'llevar' ? 'confirmado' : 'pendiente'
    await client.query('BEGIN')
    const { rows } = await client.query(
      `INSERT INTO pedidos (tipo, total, mesa_id, cliente_nombre, cliente_telefono, notas, estado, tipo_entrega, direccion_entrega)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, numero_orden`,
      [tipo, total, mesa_id ?? null, cliente_nombre ?? null, cliente_telefono ?? null, notas ?? null, estadoInicial,
       tipo_entrega ?? 'recogida', direccion_entrega ?? null]
    )
    const pedido = rows[0]
    for (const item of items) {
      await client.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio, notas)
         VALUES ($1,$2,$3,$4,$5)`,
        [pedido.id, item.producto.id, item.cantidad,
         item.variante?.precio ?? item.producto.precio, item.variante?.nombre ?? null]
      )
    }
    await client.query('COMMIT')
    return NextResponse.json({ numero_orden: pedido.numero_orden })
  } catch (e) {
    await client.query('ROLLBACK')
    console.error(e)
    return NextResponse.json({ error: 'Error al crear pedido' }, { status: 500 })
  } finally {
    client.release()
  }
}
