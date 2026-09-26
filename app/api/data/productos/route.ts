import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

function parseProducto(row: any) {
  return {
    ...row,
    precio: parseFloat(row.precio),
    variantes: row.variantes
      ? row.variantes.map((v: any) => ({ ...v, precio: parseFloat(v.precio) }))
      : null,
  }
}

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, c.tipo AS categoria_tipo, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.nombre
    `)
    return NextResponse.json(rows.map(parseProducto))
  } catch (e) {
    console.error('GET /api/data/productos failed:', e)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const p = await req.json()
    if (p.id) {
      await pool.query(
        `UPDATE productos SET categoria_id=$1, nombre=$2, descripcion=$3, precio=$4,
         imagen=$5, disponible=$6, tiempo_prep=$7, variantes=$8 WHERE id=$9`,
        [p.categoria_id, p.nombre, p.descripcion ?? '', p.precio,
         p.imagen ?? null, p.disponible ?? true, p.tiempo_prep ?? 10,
         p.variantes ? JSON.stringify(p.variantes) : null, p.id]
      )
    } else {
      await pool.query(
        `INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, disponible, tiempo_prep, variantes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [p.categoria_id, p.nombre, p.descripcion ?? '', p.precio,
         p.imagen ?? null, p.disponible ?? true, p.tiempo_prep ?? 10,
         p.variantes ? JSON.stringify(p.variantes) : null]
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
