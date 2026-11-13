import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  const user = token ? await verifySessionToken(token) : null

  const { pathname } = request.nextUrl

  // Proteksi route dashboard & admin — harus login
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Kalau sudah login dan akses /login → redirect ke dashboard
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|uploads|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
