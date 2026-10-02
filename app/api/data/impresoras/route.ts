import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireRole, isSessionPayload } from '@/lib/session'

export async function GET(req: NextRequest) {
  const session = await requireRole(req, ['admin', 'cocina'])
  if (!isSessionPayload(session)) return session
  try {
    const { rows } = await pool.query('SELECT * FROM impresoras ORDER BY created_at')
    return NextResponse.json(rows)
  } catch (e) {
    console.error('GET /api/data/impresoras failed:', e)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await requireRole(req, ['admin'])
  if (!isSessionPayload(session)) return session
  try {
    const imp = await req.json()
    if (imp.id) {
      await pool.query(
        `UPDATE impresoras SET nombre=$1, ip=$2, puerto=$3, tipo=$4, protocolo=$5, activa=$6, categorias_ids=$7 WHERE id=$8`,
        [imp.nombre, imp.ip, imp.puerto, imp.tipo, imp.protocolo ?? 'ventana',
         imp.activa ?? true, imp.categorias_ids ?? [], imp.id]
      )
    } else {
      await pool.query(
        `INSERT INTO impresoras (nombre, ip, puerto, tipo, protocolo, activa, categorias_ids)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [imp.nombre, imp.ip, imp.puerto, imp.tipo, imp.protocolo ?? 'ventana',
         imp.activa ?? true, imp.categorias_ids ?? []]
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
