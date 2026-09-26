import { Pool } from 'pg'

const g = globalThis as unknown as { _pool?: Pool }

// Acepta DATABASE_URL o, si no está, las variables que la integración
// Vercel↔Supabase crea automáticamente. POSTGRES_URL usa el pooler
// (pgbouncer), recomendado para entornos serverless como Vercel.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING

const isSupabase = connectionString?.includes('supabase.') ?? false

export const pool = g._pool ?? new Pool({
  connectionString,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
})

if (process.env.NODE_ENV !== 'production') g._pool = pool
