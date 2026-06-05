import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { estado } = await req.json()
    await pool.query('UPDATE mesas SET estado=$1 WHERE id=$2', [estado, params.id])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await pool.query('DELETE FROM mesas WHERE id=$1', [params.id])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
