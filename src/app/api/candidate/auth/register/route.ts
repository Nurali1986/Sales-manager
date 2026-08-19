import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth/session'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, phone, email, city, password } = body

    if (!firstName || !lastName || !phone || !password) {
      return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Ism, familiya, telefon va parol kiritilishi shart.' } }, { status: 400 })
    }

    const cleanPhone = phone.trim()
    const existingPhone = await prisma.candidate.findUnique({
      where: { phone: cleanPhone }
    })

    if (existingPhone) {
      return NextResponse.json({ error: { code: 'EXISTS', message: 'Ushbu telefon raqam allaqachon ro\'yxatdan o\'tgan.' } }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const candidate = await prisma.candidate.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: cleanPhone,
        email: email?.trim() || null,
        city: city || 'Toshkent',
        passwordHash
      }
    })

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
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi.' } }, { status: 500 })
  }
}
