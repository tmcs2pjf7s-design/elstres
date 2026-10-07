import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { generarCodigoTarjeta } from '@/lib/fidelidad'

// Público: el cliente solo necesita su propio id (guardado en su sesión
// local tras iniciar sesión) para ver o crear su tarjeta.
export async function POST(req: NextRequest) {
  try {
    const { cliente_id } = await req.json()
    if (!cliente_id) {
      return NextResponse.json({ error: 'Falta cliente_id' }, { status: 400 })
    }

    const existente = await pool.query('SELECT * FROM tarjetas_fidelidad WHERE cliente_id=$1', [cliente_id])
    if (existente.rows.length > 0) {
      return NextResponse.json(existente.rows[0])
    }

    for (let intento = 0; intento < 5; intento++) {
      try {
        const codigo = generarCodigoTarjeta()
        const { rows } = await pool.query(
          'INSERT INTO tarjetas_fidelidad (cliente_id, codigo) VALUES ($1,$2) RETURNING *',
          [cliente_id, codigo]
        )
        return NextResponse.json(rows[0])
      } catch (e: any) {
        if (e?.code === '23505' && e?.constraint === 'tarjetas_fidelidad_codigo_key') continue
        if (e?.code === '23505') {
          // Carrera: otra petición la creó a la vez — devolvemos la existente.
          const { rows } = await pool.query('SELECT * FROM tarjetas_fidelidad WHERE cliente_id=$1', [cliente_id])
          return NextResponse.json(rows[0])
        }
        throw e
      }
    }
    return NextResponse.json({ error: 'Error al crear la tarjeta' }, { status: 500 })
  } catch (e) {
    console.error('POST /api/data/fidelidad/mi-tarjeta failed:', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
