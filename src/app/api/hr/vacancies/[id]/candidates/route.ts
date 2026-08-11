import { NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { getSession } from '@/lib/auth/session'

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params
    const { searchParams } = new URL(req.url)
    
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)
    const search = searchParams.get('search') || ''
    const minScore = searchParams.get('minScore') ? parseFloat(searchParams.get('minScore')!) : null
    const status = searchParams.get('status') || ''
    const assessmentStatus = searchParams.get('assessmentStatus') || ''
    
    // Sort params - default finalScore desc
    const sortField = searchParams.get('sort') || 'finalScore'
    const sortOrder = searchParams.get('order') || 'desc'
    const recommendation = searchParams.get('recommendation') || ''

    const session = await getSession()
    if (!session || !session.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const companyId = session.companyId as string

    // Validate ownership
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId }
    })
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Build Prisma query
    const where: Prisma.ApplicationWhereInput = {
      jobId,
    }

    if (status) {
      where.status = status as any
    }

    if (search) {
      where.candidate = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } }
        ]
      }
    }

    if (assessmentStatus) {
      where.assessments = {
        some: { status: assessmentStatus as any }
      }
    }

    if (minScore !== null) {
      where.assessments = {
        some: { totalScore: { gte: minScore } }
      }
    }

    if (recommendation) {
      where.assessments = {
        some: { results: { some: { recommendation: recommendation as any } } }
      }
    }

    // Get total count for pagination
    const totalCount = await prisma.application.count({ where })

    // Build orderBy
    // For sorting by assessment score, Prisma relation sorting is limited,
    // but we can sort by nested assessments array if we take the first one or we can fetch and sort.
    // However, the rule says "Server side sorting". In Prisma, filtering and sorting by a one-to-many relation is tricky.
    // Given MVP, we'll fetch the records with applications and sort in TS if sorting by score, 
    // OR we can change the relation if it's 1-to-1 conceptually.
    // For now, let's fetch all matched and sort in-memory to strictly obey tie-breakers, 
    // since tie-breakers involve multiple nested relation fields (Simulation, Case, Video).
    
    // Note: If candidates exceed 10,000, in-memory sort is slow, but we filtered them first.
    // A better long-term approach is a CandidateRanking materialized view.
    
    const applications = await prisma.application.findMany({
      where,
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

    // Process and sort in memory for tie-breakers
    const processed = applications.map(app => {
      const latestAss = app.assessments[0]
      const result = latestAss?.results[0]
      
      return {
        id: app.id,
        candidateId: app.candidate.id,
        firstName: app.candidate.firstName,
        lastName: app.candidate.lastName,
        phone: app.candidate.phone,
        email: app.candidate.email,
        status: app.status,
        applicationDate: app.createdAt,
        assessmentId: latestAss?.id,
        assessmentStatus: latestAss?.status || 'NOT_STARTED',
        assessmentCompletionDate: latestAss?.completedAt,
        finalScore: result?.totalScore || null,
        testScore: result?.testScore || null,
        caseScore: result?.caseScore || null,
        scriptScore: result?.scriptScore || null,
        simulationScore: result?.liveSalesScore || null,
        videoScore: result?.videoScore || null,
        recommendation: result?.recommendation || null
      }
    })

    // Tie break sequence: Final Score -> Simulation -> Case -> Video -> Date
    processed.sort((a, b) => {
      let cmp = 0
      if (sortField === 'finalScore') {
        cmp = (b.finalScore || -1) - (a.finalScore || -1)
        if (cmp === 0) cmp = (b.simulationScore || -1) - (a.simulationScore || -1)
        if (cmp === 0) cmp = (b.caseScore || -1) - (a.caseScore || -1)
        if (cmp === 0) cmp = (b.videoScore || -1) - (a.videoScore || -1)
        if (cmp === 0) cmp = new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
      } else {
        // dynamic sort
        const valA = (a as any)[sortField] || 0
        const valB = (b as any)[sortField] || 0
        cmp = valA < valB ? 1 : valA > valB ? -1 : 0
      }
      
      return sortOrder === 'asc' ? -cmp : cmp
    })

    const paginated = processed.slice((page - 1) * pageSize, page * pageSize)

    return NextResponse.json({
      data: {
        candidates: paginated,
        totalCount: processed.length,
        page,
        pageSize,
        totalPages: Math.ceil(processed.length / pageSize)
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load candidates' }, { status: 500 })
  }
}
