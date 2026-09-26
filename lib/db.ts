import { Pool } from 'pg'

const g = globalThis as unknown as { _pool?: Pool }

const isSupabase = process.env.DATABASE_URL?.includes('supabase.co') ?? false

export const pool = g._pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
})

if (process.env.NODE_ENV !== 'production') g._pool = pool
