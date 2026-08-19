import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth/session'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneOrEmail, password } = body

    if (!phoneOrEmail || !password) {
      return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Telefon/Email va parol kiritilishi shart.' } }, { status: 400 })
    }

    const cleanInput = phoneOrEmail.trim()
    const candidate = await prisma.candidate.findFirst({
      where: {
        OR: [
          { phone: cleanInput },
          { email: cleanInput }
        ]
      }
    })

    if (!candidate || !candidate.passwordHash) {
      return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Telefon raqam yoki parol noto\'g\'ri.' } }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, candidate.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Telefon raqam yoki parol noto\'g\'ri.' } }, { status: 401 })
    }

    // Set Candidate Session Cookie
    const token = await encrypt({ candidateId: candidate.id, role: 'CANDIDATE' })
    const cookieStore = await cookies()
    cookieStore.set('candidate_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

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
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'Kirishda xatolik yuz berdi.' } }, { status: 500 })
  }
}
