import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM mesas ORDER BY tipo, numero')
    return NextResponse.json(rows)
  } catch (e) {
    console.error('GET /api/data/mesas failed:', e)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { numero, capacidad, tipo } = await req.json()
    if (!numero || !tipo) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }
    const { rows } = await pool.query(
      `INSERT INTO mesas (numero, capacidad, tipo) VALUES ($1, $2, $3)
       ON CONFLICT (numero) DO NOTHING
       RETURNING *`,
      [numero, capacidad ?? 4, tipo]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Ya existe una mesa con ese número' }, { status: 409 })
    }
    return NextResponse.json(rows[0])
  } catch (e: any) {
    if (e?.code === '23505') {
      return NextResponse.json({ error: 'Ya existe una mesa con ese número' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al crear' }, { status: 500 })
  }
}
