import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth/session'

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params
    const session = await getSession()
    
    if (!session || !session.companyId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const companyId = session.companyId as string

    // Validate ownership
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId }
    })
    if (!job) {
      return new NextResponse('Job not found', { status: 404 })
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            results: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    })

    // Prepare CSV data
    const rows: string[] = []
    
    // Header
    rows.push(['Candidate Name', 'Phone', 'Email', 'Assessment Status', 'Overall Score', 'Test Score', 'Case Score', 'Script Score', 'Simulation Score', 'Video Score', 'AI Recommendation', 'HR Status'].join(','))

    // Body
    for (const app of applications) {
      const latestAss = app.assessments[0]
      const result = latestAss?.results[0]
      
      const row = [
        `"${app.candidate.firstName} ${app.candidate.lastName}"`,
        `"${app.candidate.phone || ''}"`,
        `"${app.candidate.email}"`,
        `"${latestAss?.status || 'NOT_STARTED'}"`,
        `"${result?.totalScore ? Math.round(result.totalScore) : '—'}"`,
        `"${result?.testScore ? Math.round(result.testScore) : '—'}"`,
        `"${result?.caseScore ? Math.round(result.caseScore) : '—'}"`,
        `"${result?.scriptScore ? Math.round(result.scriptScore) : '—'}"`,
        `"${result?.liveSalesScore ? Math.round(result.liveSalesScore) : '—'}"`,
        `"${result?.videoScore ? Math.round(result.videoScore) : '—'}"`,
        `"${result?.recommendation || '—'}"`,
        `"${app.status}"`
      ]
      rows.push(row.join(','))
    }

    const csvContent = rows.join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="candidates_${jobId}.csv"`,
      }
    })
  } catch (error: any) {
    return new NextResponse('Failed to export candidates', { status: 500 })
  }
}
