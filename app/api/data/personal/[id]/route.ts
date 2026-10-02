import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireRole, isSessionPayload } from '@/lib/session'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(req, ['admin'])
  if (!isSessionPayload(session)) return session
  try {
    const { activo } = await req.json()
    await pool.query('UPDATE usuarios SET activo=$1 WHERE id=$2', [activo, params.id])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
