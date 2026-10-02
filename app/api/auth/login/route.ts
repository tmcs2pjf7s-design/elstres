import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { pool } from '@/lib/db'
import { createSessionToken, SESSION_COOKIE, StaffRol } from '@/lib/session'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'ruslanurbano@outlook.es'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '.12//Musica'

const STAFF_ROLES: StaffRol[] = ['admin', 'camarero', 'cocina']

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const { rows } = await pool.query(
      'SELECT id, nombre, rol, activo, password_hash, salt FROM usuarios WHERE email=$1',
      [email]
    )

    let user: { id: string; nombre: string; rol: StaffRol } | null = null

    if (rows.length > 0) {
      const row = rows[0]
      if (row.activo && STAFF_ROLES.includes(row.rol) && verifyPassword(password, row.password_hash, row.salt)) {
        user = { id: row.id, nombre: row.nombre, rol: row.rol }
      }
    } else if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Primer arranque: crea la cuenta admin inicial a partir de las env vars.
      const { hash, salt } = hashPassword(password)
      const inserted = await pool.query(
        `INSERT INTO usuarios (nombre, email, password_hash, salt, rol)
         VALUES ('Admin', $1, $2, $3, 'admin') RETURNING id, nombre, rol`,
        [ADMIN_EMAIL, hash, salt]
      )
      user = inserted.rows[0]
    }

    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const token = await createSessionToken(user)
    const res = NextResponse.json({ ok: true, nombre: user.nombre, rol: user.rol })
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
