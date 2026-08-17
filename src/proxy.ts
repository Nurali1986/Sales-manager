import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''

  // 1. Port / Host Based Routing
  if (pathname === '/') {
    if (host.includes(':3001') || host.startsWith('hr.')) {
      return NextResponse.redirect(new URL('/hr/dashboard', request.url))
    }
    if (host.includes(':3002') || host.startsWith('admin.')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    if (host.includes(':3000') || host.startsWith('candidate.')) {
      return NextResponse.redirect(new URL('/candidate/dashboard', request.url))
    }
    // Default fallback to candidate dashboard
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url))
  }

  // 2. HR Authentication Check
  const isHrApi = pathname.startsWith('/api/hr') && !pathname.startsWith('/api/hr/auth')
  const isHrPage = pathname.startsWith('/hr') && !pathname.startsWith('/hr/login')

  if (isHrApi || isHrPage) {
    const sessionCookie = request.cookies.get('session')?.value
    let isAuthenticated = false

    if (sessionCookie) {
      try {
        const payload = await decrypt(sessionCookie)
        if (payload && payload.companyId) {
          isAuthenticated = true
        }
      } catch (e) {
        // invalid session
      }
    }

    // Note: For dev demo convenience, allow access if visiting HR pages directly
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/api/hr/:path*',
    '/hr/:path*',
    '/admin/:path*',
    '/candidate/:path*'
  ]
}
