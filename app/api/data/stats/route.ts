import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireRole, isSessionPayload } from '@/lib/session'

export async function GET(req: NextRequest) {
  const session = await requireRole(req, ['admin'])
  if (!isSessionPayload(session)) return session
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)                                                        AS pedidos_hoy,
        COALESCE(SUM(total), 0)                                        AS ingresos_hoy,
        COUNT(*) FILTER (WHERE estado NOT IN ('entregado','cancelado')) AS pedidos_activos
      FROM pedidos
      WHERE created_at >= CURRENT_DATE
        AND estado != 'cancelado'
    `)
    const { rows: mesas } = await pool.query(
      `SELECT estado, COUNT(*) AS n FROM mesas GROUP BY estado`
    )
    const mesaMap = Object.fromEntries(mesas.map((r: any) => [r.estado, parseInt(r.n)]))
    return NextResponse.json({
      pedidos_hoy:    parseInt(rows[0].pedidos_hoy),
      ingresos_hoy:   parseFloat(rows[0].ingresos_hoy),
      pedidos_activos: parseInt(rows[0].pedidos_activos),
      mesas_ocupadas: mesaMap['ocupada'] ?? 0,
      mesas_total:    (mesaMap['libre'] ?? 0) + (mesaMap['ocupada'] ?? 0) + (mesaMap['reservada'] ?? 0),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ pedidos_hoy: 0, ingresos_hoy: 0, pedidos_activos: 0, mesas_ocupadas: 0, mesas_total: 0 }, { status: 500 })
  }
}
