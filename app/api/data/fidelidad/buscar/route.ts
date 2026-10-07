import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireRole, isSessionPayload } from '@/lib/session'

export async function GET(req: NextRequest) {
  const session = await requireRole(req, ['admin', 'camarero'])
  if (!isSessionPayload(session)) return session
  try {
    const { searchParams } = new URL(req.url)
    const codigo = (searchParams.get('codigo') ?? '').trim().toUpperCase()
    if (!codigo) return NextResponse.json({ error: 'Falta el código' }, { status: 400 })

    const { rows } = await pool.query(
      `SELECT t.*, u.nombre AS cliente_nombre
       FROM tarjetas_fidelidad t
       JOIN usuarios u ON u.id = t.cliente_id
       WHERE t.codigo = $1`,
      [codigo]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No existe ninguna tarjeta con ese código' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (e) {
    console.error('GET /api/data/fidelidad/buscar failed:', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
