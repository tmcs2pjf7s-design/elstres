import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { requireRole, isSessionPayload } from '@/lib/session'

const STAFF_ROLES = ['admin', 'camarero', 'cocina']

export async function GET(req: NextRequest) {
  const session = await requireRole(req, ['admin'])
  if (!isSessionPayload(session)) return session
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, email, telefono, rol, activo, created_at FROM usuarios
       WHERE rol IN ('admin','camarero','cocina') ORDER BY created_at DESC`
    )
    return NextResponse.json(rows)
  } catch (e) {
    console.error('GET /api/data/personal failed:', e)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await requireRole(req, ['admin'])
  if (!isSessionPayload(session)) return session
  try {
    const { nombre, email, telefono, password, rol } = await req.json()
    if (!nombre || !email || !password || !STAFF_ROLES.includes(rol)) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }
    const { hash, salt } = hashPassword(password)
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, email, telefono, password_hash, salt, rol)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, nombre, email, telefono, rol, activo, created_at`,
      [nombre, email, telefono ?? null, hash, salt, rol]
    )
    return NextResponse.json(rows[0])
  } catch (e: any) {
    if (e?.code === '23505') {
      return NextResponse.json({ error: 'Ya existe una cuenta con ese email' }, { status: 409 })
    }
    console.error('POST /api/data/personal failed:', e)
    return NextResponse.json({ error: 'Error al crear' }, { status: 500 })
  }
}
