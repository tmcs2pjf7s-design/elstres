import { NextRequest, NextResponse } from 'next/server'

// Implementado con Web Crypto (crypto.subtle) en vez del módulo 'crypto' de
// Node a propósito: este código se ejecuta tanto en rutas de API (Node)
// como en middleware.ts (Edge Runtime), y solo Web Crypto está disponible
// en ambos entornos.

export const SESSION_COOKIE = 'staff_session'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12h

export type StaffRol = 'admin' | 'camarero' | 'cocina'

export interface SessionPayload {
  id: string
  nombre: string
  rol: StaffRol
  exp: number
}

function secret(): string {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET no está configurado')
  return s
}

function bytesToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  return bytes
}

function toBase64Url(s: string): string {
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(s: string): string {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(s.length + ((4 - (s.length % 4)) % 4), '=')
  return atob(padded)
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

async function sign(data: string): Promise<string> {
  const key = await getKey()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return bytesToHex(sig)
}

export async function createSessionToken(user: { id: string; nombre: string; rol: StaffRol }): Promise<string> {
  const payload: SessionPayload = { id: user.id, nombre: user.nombre, rol: user.rol, exp: Date.now() + SESSION_TTL_MS }
  const data = toBase64Url(JSON.stringify(payload))
  const sig = await sign(data)
  return `${data}.${sig}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null
  const [data, sig] = token.split('.')
  if (!data || !sig) return null

  const key = await getKey()
  let valid = false
  try {
    valid = await crypto.subtle.verify('HMAC', key, hexToBytes(sig) as BufferSource, new TextEncoder().encode(data))
  } catch {
    return null
  }
  if (!valid) return null

  try {
    const payload: SessionPayload = JSON.parse(fromBase64Url(data))
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)
}

/** Para usar dentro de un route handler de /api/data/*: devuelve la sesión válida o una NextResponse 401 lista para `return`. */
export async function requireRole(req: NextRequest, roles: StaffRol[]): Promise<SessionPayload | NextResponse> {
  const session = await getSession(req)
  if (!session || !roles.includes(session.rol)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return session
}

export function isSessionPayload(x: SessionPayload | NextResponse): x is SessionPayload {
  return !(x instanceof NextResponse)
}
