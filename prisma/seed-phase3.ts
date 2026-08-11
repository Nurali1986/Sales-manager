import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Create a demo company and user
  const company = await prisma.company.create({
    data: {
      name: 'Demo Company',
      slug: 'demo-company',
      description: 'A demo furniture manufacturing company',
      users: {
        create: {
          firstName: 'HR',
          lastName: 'Manager',
          email: 'hr@example.com',
          passwordHash: await bcrypt.hash('password123', 10),
        }
      }
    }
  })

  // 2. Create a Sales Manager Job
  const job = await prisma.job.create({
    data: {
      companyId: company.id,
      title: 'Sales Manager',
      description: 'We are looking for an experienced Sales Manager.',
      status: 'ACTIVE',
      questions: {
        create: Array.from({ length: 10 }).map((_, i) => ({
          category: 'Sales Process',
          questionText: `Sales Question ${i + 1}`,
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          points: 10,
          order: i
        }))
      }
    }
  })

  // 3. Create a Candidate
  const candidate = await prisma.candidate.create({
    data: {
      firstName: 'Test',
      lastName: 'Candidate',
      phone: '+998901234567',
      email: 'test@candidate.com'
    }
  })

  // 4. Create an Application
  const application = await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: job.id,
    }
  })

  // 5. Create an Assessment with Stages
  const rawToken = 'demo-token-123'
  const secureTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

  const assessment = await prisma.assessment.create({
    data: {
      jobId: job.id,
      candidateId: candidate.id,
      applicationId: application.id,
      token: rawToken, // legacy field
      secureTokenHash,
      status: 'NOT_STARTED',
      stages: {
        create: [
          { type: 'PROFILE', order: 1 },
          { type: 'CV', order: 2 },
          { type: 'TEST', order: 3 },
          { type: 'CASE', order: 4 },
          { type: 'SCRIPT', order: 5 },
          { type: 'LIVE_SALES', order: 6 },
          { type: 'VIDEO', order: 7 },
        ]
      }
    }
  })

  console.log('Seed Data Created!')
  console.log('Test Assessment URL: http://localhost:3000/assessment/' + rawToken)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
