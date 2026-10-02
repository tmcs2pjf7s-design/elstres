import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireRole, isSessionPayload } from '@/lib/session'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(req, ['admin', 'camarero'])
  if (!isSessionPayload(session)) return session
  try {
    const { estado } = await req.json()
    await pool.query('UPDATE mesas SET estado=$1 WHERE id=$2', [estado, params.id])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(req, ['admin'])
  if (!isSessionPayload(session)) return session
  try {
    await pool.query('DELETE FROM mesas WHERE id=$1', [params.id])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
