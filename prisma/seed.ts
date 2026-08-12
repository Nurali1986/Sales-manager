import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Demo Company
  const company = await prisma.company.upsert({
    where: { slug: 'pifagor-demo' },
    update: {},
    create: {
      name: 'Pifagor Demo Company',
      slug: 'pifagor-demo',
      description: 'Demo environment for HR Assessment Platform',
    },
  })

  // HR User
  // Hash password for demo (e.g. "password123")
  const passwordHash = await bcrypt.hash('password123', 10)
  
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@pifagordemo.com' },
    update: {},
    create: {
      companyId: company.id,
      firstName: 'Demo',
      lastName: 'HR',
      email: 'hr@pifagordemo.com',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  })

  // Sales Manager Job
  const job = await prisma.job.create({
    data: {
      companyId: company.id,
      title: 'Sales Manager',
      description: 'We are looking for a highly skilled B2B Sales Manager to join our growing team.',
      department: 'Sales',
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
    },
  })

  // Demo Candidate
  const candidate = await prisma.candidate.upsert({
    where: { phone: '+998901234567' },
    update: {},
    create: {
      firstName: 'Ali',
      lastName: 'Valiyev',
      phone: '+998901234567',
      email: 'ali.valiyev@example.com',
    },
  })

  // Demo Application
  const application = await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: job.id,
      status: 'APPLIED',
    },
  })

  // Demo Assessment
  const rawToken = 'demo-assessment-token-123'
  const secureTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

  const assessment = await prisma.assessment.create({
    data: {
      applicationId: application.id,
      candidateId: candidate.id,
      jobId: job.id,
      token: rawToken,
      secureTokenHash: secureTokenHash,
      status: 'NOT_STARTED',
    },
  })

  // Create standard stages
  const DEFAULT_STAGES = [
    { type: 'PROFILE', order: 1 },
    { type: 'CV', order: 2 },
    { type: 'TEST', order: 3 },
    { type: 'CASE', order: 4 },
    { type: 'SCRIPT', order: 5 },
    { type: 'LIVE_SALES', order: 6 },
    { type: 'VIDEO', order: 7 }
  ]

  const stageData = DEFAULT_STAGES.map(s => ({
    assessmentId: assessment.id,
    type: s.type as any,
    order: s.order,
    status: 'NOT_STARTED' as any
  }))

  await prisma.assessmentStage.createMany({
    data: stageData
  })

  // Assessment Config linked to the Assessment
  await prisma.assessmentStageConfig.createMany({
    data: DEFAULT_STAGES.map(s => ({
      assessmentId: assessment.id,
      stageType: s.type as any,
      weight: 10,
      maxScore: 100
    }))
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
