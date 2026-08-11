import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define paths that require HR authentication
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

    if (!isAuthenticated) {
      if (isHrApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      } else {
        // Redirect to login page for UI routes
        const loginUrl = new URL('/hr/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/hr/:path*',
    '/hr/:path*'
  ]
}
