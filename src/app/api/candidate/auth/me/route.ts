import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { decrypt } from '@/lib/auth/session'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('candidate_session')?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
    }

    const payload = await decrypt(sessionCookie)
    if (!payload || !payload.candidateId) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid session' } }, { status: 401 })
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: payload.candidateId as string }
    })

    if (!candidate) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Candidate not found' } }, { status: 404 })
    }

    return NextResponse.json({
      data: {
        candidate: {
          id: candidate.id,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          phone: candidate.phone,
          email: candidate.email,
          city: candidate.city
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message } }, { status: 500 })
  }
}
