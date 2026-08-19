import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { name: true } },
        _count: { select: { applications: true } }
      }
    })

    const formatted = jobs.map(j => ({
      id: j.id,
      title: j.title,
      description: j.description,
      company: j.company.name,
      status: j.status,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      department: j.department,
      createdAt: j.createdAt,
      applicationsCount: j._count.applications,
    }))

    return NextResponse.json({ data: formatted })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { jobId, status } = body

    if (!jobId || !status) {
      return NextResponse.json({ error: 'jobId and status required' }, { status: 400 })
    }

    const validStatuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: { status }
    })

    return NextResponse.json({ data: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
