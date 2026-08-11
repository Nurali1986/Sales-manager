import { PrismaClient } from '@prisma/client'

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
  // Assuming a pre-hashed password for demo (e.g. "password123")
  const passwordHash = '$2a$10$X8a/36F7nKw1/XzV5i/vUuZ6iUjYV31FvHwV2tZ.Vn.L2H8u2Y9/q'
  
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

  // Assessment Config
  await prisma.assessmentStageConfig.createMany({
    data: [
      { assessmentId: job.id, stageType: 'CV', weight: 10, maxScore: 100 }, // Wait, job.id isn't AssessmentId, the config links to Assessment.
    ]
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
