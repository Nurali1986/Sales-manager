import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearAllVacancies() {
  console.log('Cleaning all jobs, applications, assessments and questions...')

  const ca = await prisma.candidateAnswer.deleteMany({})
  const ts = await prisma.textSubmission.deleteMany({})
  const air = await prisma.aIResult.deleteMany({})
  const sb = await prisma.scoreBreakdown.deleteMany({})
  const asc = await prisma.assessmentStageConfig.deleteMany({})
  const ast = await prisma.assessmentStage.deleteMany({})
  const ar = await prisma.assessmentResult.deleteMany({})
  const ass = await prisma.assessment.deleteMany({})
  const app = await prisma.application.deleteMany({})
  const q = await prisma.question.deleteMany({})
  const cf = await prisma.candidateFile.deleteMany({})
  const c = await prisma.candidate.deleteMany({})
  const j = await prisma.job.deleteMany({})

  console.log(`Deleted ${j.count} jobs from database!`)
  console.log(`Deleted ${c.count} candidates from database!`)
  console.log(`Deleted ${app.count} applications from database!`)

  const remaining = await prisma.job.count()
  console.log(`Remaining jobs in DB count: ${remaining}`)
}

clearAllVacancies()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
