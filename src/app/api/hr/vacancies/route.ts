import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getSession()
    let companyId = session?.companyId as string | undefined

    if (!companyId) {
      const firstCompany = await prisma.company.findFirst()
      if (firstCompany) {
        companyId = firstCompany.id
      }
    }

    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized: No company found' }, { status: 401 })
    }

    const vacancies = await prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            applications: true
          }
        },
        applications: {
          select: { status: true }
        },
        assessments: {
          select: { status: true, totalScore: true }
        }
      }
    })

    const formatted = vacancies.map(v => {
      const completedCount = v.assessments.filter(a => a.status === 'COMPLETED').length
      const shortlistedCount = v.applications.filter(a => a.status === 'SHORTLISTED').length
      const completedAssessmentsWithScore = v.assessments.filter(a => a.totalScore !== null)
      const avgScore = completedAssessmentsWithScore.length > 0 
        ? completedAssessmentsWithScore.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / completedAssessmentsWithScore.length 
        : null

      return {
        id: v.id,
        title: v.title,
        status: v.status,
        createdAt: v.createdAt,
        totalApplications: v._count.applications,
        completedAssessments: completedCount,
        shortlisted: shortlistedCount,
        averageScore: avgScore
      }
    })

    return NextResponse.json({ data: formatted })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load vacancies' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || !session.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const companyId = session.companyId as string

    const body = await req.json()
    const { title, description, department, employmentType, salaryMin, salaryMax, currency } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const job = await prisma.job.create({
      data: {
        companyId,
        title,
        description,
        department,
        employmentType: employmentType || 'FULL_TIME',
        status: 'ACTIVE',
        salaryMin,
        salaryMax,
        currency
      }
    })

    return NextResponse.json({ data: job })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create vacancy' }, { status: 500 })
  }
}
