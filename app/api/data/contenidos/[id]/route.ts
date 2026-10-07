import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireRole, isSessionPayload } from '@/lib/session'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(req, ['admin'])
  if (!isSessionPayload(session)) return session
  try {
    const body = await req.json()
    const fields: string[] = []
    const values: any[] = []
    for (const key of ['titulo', 'descripcion', 'enlace', 'imagen', 'activo', 'orden']) {
      if (key in body) {
        values.push(body[key])
        fields.push(`${key} = $${values.length}`)
      }
    }
    if (fields.length === 0) {
      return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
    }
    values.push(params.id)
    await pool.query(`UPDATE contenidos SET ${fields.join(', ')} WHERE id = $${values.length}`, values)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('PATCH /api/data/contenidos/[id] failed:', e)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(req, ['admin'])
  if (!isSessionPayload(session)) return session
  try {
    await pool.query('DELETE FROM contenidos WHERE id=$1', [params.id])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
