import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listJobs() {
  const jobs = await prisma.job.findMany({
    include: { company: true }
  })
  console.log(`TOTAL JOBS IN DATABASE: ${jobs.length}`)
  jobs.forEach(j => {
    console.log(`- ID: ${j.id} | Title: ${j.title} | Status: ${j.status} | Company: ${j.company?.name}`)
  })
}

listJobs().finally(() => prisma.$disconnect())
