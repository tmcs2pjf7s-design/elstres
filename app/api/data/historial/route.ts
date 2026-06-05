import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fecha = searchParams.get('fecha') ?? new Date().toISOString().slice(0, 10)

  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        json_build_object('id', m.id, 'numero', m.numero, 'tipo', m.tipo) AS mesa,
        json_agg(
          json_build_object(
            'id', pi.id, 'cantidad', pi.cantidad, 'precio', pi.precio, 'notas', pi.notas,
            'producto', json_build_object('id', pr.id, 'nombre', pr.nombre)
          ) ORDER BY pi.created_at
        ) AS items
      FROM pedidos p
      LEFT JOIN mesas m ON p.mesa_id = m.id
      LEFT JOIN pedido_items pi ON pi.pedido_id = p.id
      LEFT JOIN productos pr ON pi.producto_id = pr.id
      WHERE p.created_at >= $1::date
        AND p.created_at <  $1::date + INTERVAL '1 day'
      GROUP BY p.id, m.id
      ORDER BY p.created_at DESC
    `, [fecha])

    const pedidos = rows.map((r: any) => ({
      ...r,
      total: parseFloat(r.total ?? 0),
      mesa: r.mesa?.id ? r.mesa : undefined,
      items: (r.items ?? []).filter((i: any) => i.id !== null)
        .map((i: any) => ({ ...i, precio: parseFloat(i.precio ?? 0) })),
    }))

    const resumen = {
      total_pedidos: pedidos.length,
      entregados: pedidos.filter((p: any) => p.estado === 'entregado').length,
      cancelados: pedidos.filter((p: any) => p.estado === 'cancelado').length,
      activos: pedidos.filter((p: any) => !['entregado', 'cancelado'].includes(p.estado)).length,
      ingresos: pedidos
        .filter((p: any) => p.estado !== 'cancelado')
        .reduce((s: number, p: any) => s + p.total, 0),
      ingresos_cobrados: pedidos
        .filter((p: any) => p.estado === 'entregado')
        .reduce((s: number, p: any) => s + p.total, 0),
      por_tipo: {
        mesa: pedidos.filter((p: any) => p.tipo === 'mesa' && p.estado !== 'cancelado').length,
        llevar: pedidos.filter((p: any) => p.tipo === 'llevar' && p.estado !== 'cancelado').length,
      },
    }

    return NextResponse.json({ pedidos, resumen, fecha })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ pedidos: [], resumen: {}, fecha }, { status: 500 })
  }
}
