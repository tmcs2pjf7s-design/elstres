import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireRole, isSessionPayload } from '@/lib/session'

export async function POST(req: NextRequest) {
  const session = await requireRole(req, ['admin', 'camarero'])
  if (!isSessionPayload(session)) return session
  try {
    const { codigo } = await req.json()
    const cod = (codigo ?? '').trim().toUpperCase()
    if (!cod) return NextResponse.json({ error: 'Falta el código' }, { status: 400 })

    const { rows } = await pool.query(
      `UPDATE tarjetas_fidelidad SET sellos = sellos + 1, updated_at = now()
       WHERE codigo = $1
       RETURNING *`,
      [cod]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No existe ninguna tarjeta con ese código' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (e) {
    console.error('POST /api/data/fidelidad/sello failed:', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
