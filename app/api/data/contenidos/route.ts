import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireRole, isSessionPayload } from '@/lib/session'

const TIPOS = ['sorteo', 'promocion']

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tipo = searchParams.get('tipo')
    const soloActivos = searchParams.get('activos') !== 'false'

    const conditions: string[] = []
    const params: any[] = []
    if (tipo && TIPOS.includes(tipo)) {
      params.push(tipo)
      conditions.push(`tipo = $${params.length}`)
    }
    if (soloActivos) {
      conditions.push('activo = true')
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const { rows } = await pool.query(
      `SELECT * FROM contenidos ${where} ORDER BY orden ASC, created_at DESC`,
      params
    )
    return NextResponse.json(rows)
  } catch (e) {
    console.error('GET /api/data/contenidos failed:', e)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await requireRole(req, ['admin'])
  if (!isSessionPayload(session)) return session
  try {
    const { tipo, titulo, descripcion, enlace, orden } = await req.json()
    if (!TIPOS.includes(tipo) || !titulo) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }
    const { rows } = await pool.query(
      `INSERT INTO contenidos (tipo, titulo, descripcion, enlace, orden)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [tipo, titulo, descripcion ?? '', enlace || null, orden ?? 0]
    )
    return NextResponse.json(rows[0])
  } catch (e) {
    console.error('POST /api/data/contenidos failed:', e)
    return NextResponse.json({ error: 'Error al crear' }, { status: 500 })
  }
}
