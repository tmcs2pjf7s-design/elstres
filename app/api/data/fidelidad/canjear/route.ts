import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireRole, isSessionPayload } from '@/lib/session'

const SELLOS_PARA_PREMIO = 10

export async function POST(req: NextRequest) {
  const session = await requireRole(req, ['admin', 'camarero'])
  if (!isSessionPayload(session)) return session
  try {
    const { codigo } = await req.json()
    const cod = (codigo ?? '').trim().toUpperCase()
    if (!cod) return NextResponse.json({ error: 'Falta el código' }, { status: 400 })

    const { rows } = await pool.query(
      `UPDATE tarjetas_fidelidad
       SET sellos = sellos - $2, premios_canjeados = premios_canjeados + 1, updated_at = now()
       WHERE codigo = $1 AND sellos >= $2
       RETURNING *`,
      [cod, SELLOS_PARA_PREMIO]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Esta tarjeta no tiene sellos suficientes (o no existe)' }, { status: 409 })
    }
    return NextResponse.json(rows[0])
  } catch (e) {
    console.error('POST /api/data/fidelidad/canjear failed:', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
