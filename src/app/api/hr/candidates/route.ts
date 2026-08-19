import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        applications: {
          include: {
            job: true,
            assessments: {
              include: {
                results: true,
                stages: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formatted = candidates.map(c => {
      const latestApp = c.applications[0]
      const latestAssessment = latestApp?.assessments[0]
      const latestResult = latestAssessment?.results[0]

      // Only use REAL data from DB, no hardcoded fallbacks
      const hasAssessment = !!latestAssessment
      const hasResult = !!latestResult

      return {
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email || '',
        phone: c.phone,
        city: c.city || '',
        title: latestApp?.job?.title || 'Lavozim belgilanmagan',
        applicationStatus: latestApp?.status || 'APPLIED',
        assessmentStatus: latestAssessment?.status || null,
        totalScore: hasResult ? Math.round(latestResult.totalScore as number) : null,
        recommendation: hasResult ? latestResult.recommendation : null,
        cvScore: hasResult ? (latestResult as any).cvScore : null,
        testScore: hasResult ? (latestResult as any).testScore : null,
        liveSalesScore: hasResult ? (latestResult as any).liveSalesScore : null,
        strengths: hasResult ? (latestResult as any).strengths : null,
        weaknesses: hasResult ? (latestResult as any).weaknesses : null,
        hasAssessment,
        hasResult,
        createdAt: c.createdAt,
      }
    })

    return NextResponse.json({ data: { candidates: formatted } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
