import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// Sin esto Next genera la respuesta al compilar y la carta no ve los
// cambios de categorías hasta el siguiente despliegue.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM categorias ORDER BY orden')
    return NextResponse.json(rows)
  } catch (e) {
    console.error('GET /api/data/categorias failed:', e)
    return NextResponse.json([], { status: 500 })
  }
}
