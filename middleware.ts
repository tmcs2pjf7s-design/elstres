import { NextRequest, NextResponse } from 'next/server'
import { getSession, StaffRol } from '@/lib/session'

const RULES: { prefix: string; roles: StaffRol[] }[] = [
  { prefix: '/comandero', roles: ['admin', 'camarero'] },
  { prefix: '/cocina', roles: ['admin', 'cocina'] },
  { prefix: '/admin', roles: ['admin'] },
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const rule = RULES.find(r => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`))
  if (!rule) return NextResponse.next()

  const session = await getSession(req)
  if (!session || !rule.roles.includes(session.rol)) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/comandero/:path*', '/cocina/:path*'],
}
