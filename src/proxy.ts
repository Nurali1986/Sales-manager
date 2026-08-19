import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''

  // 1. Port / Host Based Routing
  if (pathname === '/') {
    // Only redirect if specifically accessing port 3001 (HR) or port 3002 (SuperAdmin)
    if (host.includes(':3001') || host.startsWith('hr.')) {
      return NextResponse.redirect(new URL('/hr/dashboard', request.url))
    }
    if (host.includes(':3002') || host.startsWith('admin.')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // On Port 3000 (default localhost:3000), render the Public hh.uz Job Board landing page directly (NO REDIRECT!)
    return NextResponse.next()
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
