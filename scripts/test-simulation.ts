/**
 * Test script: Demo assessment bosqichlarini COMPLETED qiladi
 * va Gemini AI simulation API ni sinab ko'radi.
 * 
 * Ishlatish: npx tsx scripts/test-simulation.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const BASE_URL = 'http://localhost:3001'
const TOKEN = 'demo-assessment-token-123'

async function main() {
  console.log('🔧 Test: PROFILE, CV, TEST, CASE, SCRIPT bosqichlarini COMPLETED qilamiz...')

  // Barcha bosqichlarni topib COMPLETED qilamiz (simulation va video bundan mustasno)
  await prisma.assessmentStage.updateMany({
    where: {
      assessment: { token: TOKEN },
      type: { in: ['PROFILE', 'CV', 'TEST', 'CASE', 'SCRIPT'] }
    },
    data: { status: 'COMPLETED', completedAt: new Date(), score: 15, maxScore: 20 }
  })

  // Assessment IN_PROGRESS qilish
  await prisma.assessment.updateMany({
    where: { token: TOKEN },
    data: { status: 'IN_PROGRESS', startedAt: new Date() }
  })

  console.log('✅ Bosqichlar COMPLETED qilindi')
  console.log('\n🤖 Gemini AI Simulation API ni sinayapmiz...')

  const res = await fetch(`${BASE_URL}/api/assessment/${TOKEN}/simulation/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Assalomu alaykum! Bizning eng yangi oshxona mebellarimiz haqida aytib bersam?',
      history: []
    })
  })

  const data = await res.json()
  
  if (res.ok) {
    console.log('✅ Gemini AI javob berdi:')
    console.log(`💬 AI Mijoz: "${data.data?.response}"`)
    console.log('\n✅ Gemini API ISHLAYAPTI!')
  } else {
    console.log('❌ Xatolik:', JSON.stringify(data, null, 2))
  }

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
