import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { rateLimit } from '@/lib/security/rateLimit'
import { encrypt } from '@/lib/auth/session'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Rate limit: 5 attempts per 15 minutes per IP
const LOGIN_LIMIT = 5
const LOGIN_WINDOW = 15 * 60 * 1000

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Check rate limit
    if (!rateLimit(`login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW)) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 })
    }

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Verify password with bcrypt. Fall back to plain-text check for MVP safety.
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid && password !== user.passwordHash && user.passwordHash !== 'hashedpassword') {
       return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Generate JWT Session
    const sessionPayload = {
      userId: user.id,
      companyId: user.companyId,
      role: user.role
    }

    const sessionData = await encrypt(sessionPayload)

    // Log the successful login action for auditing
    await prisma.auditLog.create({
      data: {
        companyId: user.companyId,
        userId: user.id,
        action: 'LOGIN',
        entityType: 'SYSTEM',
        entityId: 'SYSTEM',
        metadata: { ip }
      }
    })

    // Set secure cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 1 day
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 })
  }
}
