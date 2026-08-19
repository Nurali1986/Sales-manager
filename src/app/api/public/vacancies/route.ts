import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: { in: ['ACTIVE', 'DRAFT'] } },
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { name: true } },
        _count: { select: { applications: true } },
        assessments: {
          where: { status: 'NOT_STARTED' },
          take: 1,
          select: { token: true }
        }
      }
    })

    const formatted = jobs.map(j => ({
      id: j.id,
      title: j.title,
      description: j.description,
      company: j.company.name,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      department: j.department,
      employmentType: j.employmentType,
      createdAt: j.createdAt,
      applicationsCount: j._count.applications,
    }))

    return NextResponse.json({ data: formatted })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
