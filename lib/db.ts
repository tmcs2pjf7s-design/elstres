import { Pool } from 'pg'

const g = globalThis as unknown as { _pool?: Pool }

// Acepta DATABASE_URL o, si no está, las variables que la integración
// Vercel↔Supabase crea automáticamente. POSTGRES_URL usa el pooler
// (pgbouncer), recomendado para entornos serverless como Vercel.
const rawConnectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING

function resolveConnection(cs?: string) {
  if (!cs) return { connectionString: cs, ssl: undefined as { rejectUnauthorized: boolean } | undefined }
  try {
    const u = new URL(cs)
    const isRemote = u.hostname !== '' && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1'
    // El parámetro sslmode de la URL tiene prioridad sobre la opción `ssl`
    // que pasemos al Pool, así que lo quitamos y dejamos que `ssl` mande.
    u.searchParams.delete('sslmode')
    return { connectionString: u.toString(), ssl: isRemote ? { rejectUnauthorized: false } : undefined }
  } catch {
    return { connectionString: cs, ssl: undefined }
  }
}

const { connectionString, ssl } = resolveConnection(rawConnectionString)
export { connectionString }

export const pool = g._pool ?? new Pool({ connectionString, ssl })

if (process.env.NODE_ENV !== 'production') g._pool = pool
