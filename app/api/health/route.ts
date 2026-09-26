import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  const raw = process.env.DATABASE_URL ?? ''
  let host = null, port = null, database = null
  try {
    const u = new URL(raw)
    host = u.hostname
    port = u.port
    database = u.pathname.replace('/', '')
  } catch {}

  const result: Record<string, unknown> = {
    database_url_set: raw.length > 0,
    database_url_looks_quoted: raw.startsWith('"') || raw.startsWith("'"),
    host, port, database,
  }

  try {
    await pool.query('SELECT 1')
    result.db_connection = 'ok'
  } catch (e) {
    result.db_connection = 'error'
    result.db_error = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json(result)
}
