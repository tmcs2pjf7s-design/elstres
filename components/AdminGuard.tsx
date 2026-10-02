'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) setOk(true)
        else router.replace('/admin/login')
      })
      .catch(() => router.replace('/admin/login'))
      .finally(() => setChecked(true))
  }, [router])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-gray-400 text-sm">Verificando acceso...</div>
      </div>
    )
  }

  if (!ok) return null
  return <>{children}</>
}
