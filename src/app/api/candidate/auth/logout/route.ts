import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('candidate_session')
  return NextResponse.json({ data: { success: true } })
}
