'use client'
import { useEffect, useState } from 'react'

export interface StaffSession {
  nombre: string
  rol: 'admin' | 'camarero' | 'cocina'
}

/** Lee la sesión de personal actual desde la cookie httpOnly vía /api/auth/me. */
export function useStaffSession() {
  const [session, setSession] = useState<StaffSession | null>(null)
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(setSession)
      .catch(() => setSession(null))
  }, [])
  return session
}

export async function logoutStaff() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } finally {
    window.location.href = '/admin/login'
  }
}
