import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Spec §17 ga mos weights
const STAGE_CONFIGS = [
  { type: 'CV',         order: 2, weight: 10, maxScore: 100 },
  { type: 'TEST',       order: 3, weight: 15, maxScore: 10  },
  { type: 'CASE',       order: 4, weight: 15, maxScore: 20  },
  { type: 'SCRIPT',     order: 5, weight: 15, maxScore: 20  },
  { type: 'LIVE_SALES', order: 6, weight: 30, maxScore: 30  },
  { type: 'VIDEO',      order: 7, weight: 15, maxScore: 20  },
]

const STAGES_WITH_PROFILE = [
  { type: 'PROFILE', order: 1 },
  ...STAGE_CONFIGS.map(s => ({ type: s.type, order: s.order }))
]

// Demo test savollari — spec §8 ga mos (explanation maydoni bilan)
const SALES_QUESTIONS = [
  {
    category: 'Sales Basics',
    questionText: 'Sotuv jarayonining birinchi qadami nima?',
    options: ['Taklif qilish', 'Ehtiyojni aniqlash', 'Narx aytish', 'Shartnoma tuzish'],
    correctAnswer: 'Ehtiyojni aniqlash',
    explanation: 'SPIN va klassik sotuv metodologiyasida birinchi qadam har doim mijozning ehtiyojini aniqlashdir.',
    difficulty: 'EASY' as const,
    order: 1,
  },
  {
    category: 'Need Discovery',
    questionText: 'Mijoz "Menga o\'ylab ko\'rish kerak" desa qanday munosabat to\'g\'ri?',
    options: [
      'Shartnomani yopib ketish',
      'Chegirma taklif qilish',
      'Nima o\'ylatayotganini so\'rash',
      'Ertaga qayta qo\'ng\'iroq qilish'
    ],
    correctAnswer: 'Nima o\'ylatayotganini so\'rash',
    explanation: 'E\'tiroz ortida ko\'pincha aniqlanmagan savol yotadi. To\'g\'ri savol bilan asosiy muammoni topish kerak.',
    difficulty: 'MEDIUM' as const,
    order: 2,
  },
  {
    category: 'Objection Handling',
    questionText: '"Narxingiz juda qimmat" degan e\'tirozga eng yaxshi javob qaysi?',
    options: [
      'Darhol chegirma berish',
      'Raqobatchi narxlarini tanqid qilish',
      'Qiymat va afzalliklarni tushuntirish',
      'Suhbatni tugatish'
    ],
    correctAnswer: 'Qiymat va afzalliklarni tushuntirish',
    explanation: 'Narx e\'tirozi ko\'pincha qiymatni tushunmaslik natijasidir. Darhol chegirma berish foydani kamaytiradi va mijoz ishonchini susaytiradi.',
    difficulty: 'MEDIUM' as const,
    order: 3,
  },
  {
    category: 'CRM Discipline',
    questionText: 'CRM tizimini qaysi holatlarda yangilash kerak?',
    options: [
      'Haftada bir marta',
      'Har bir mijoz aloqasidan so\'ng',
      'Oy oxirida',
      'Rahbar so\'raganda'
    ],
    correctAnswer: 'Har bir mijoz aloqasidan so\'ng',
    explanation: 'Real-time CRM ma\'lumotlari prognoz aniqligini oshiradi va jamoa hamkorligini yaxshilaydi.',
    difficulty: 'EASY' as const,
    order: 4,
  },
  {
    category: 'Closing',
    questionText: 'Quyidagilardan qaysi biri "assumptive close" texnikasiga misol?',
    options: [
      '"Sotib olasizmi?"',
      '"Qachon yetkazib berishni boshlaylik?"',
      '"Boshqa savollaringiz bormi?"',
      '"Narx sizga mos keladimi?"'
    ],
    correctAnswer: '"Qachon yetkazib berishni boshlaylik?"',
    explanation: 'Assumptive close mijoz allaqachon qaror qilgan degan taxminda gapirish — bu yopishni tezlashtiradi.',
    difficulty: 'HARD' as const,
    order: 5,
  },
  {
    category: 'Customer Communication',
    questionText: 'Mijoz bilan suhbatda eng ko\'p vaqtni qanday taqsimlash kerak?',
    options: [
      '80% gapirish, 20% tinglash',
      '50% gapirish, 50% tinglash',
      '20% gapirish, 80% tinglash',
      'Faqat mijozning gapirishi kerak'
    ],
    correctAnswer: '20% gapirish, 80% tinglash',
    explanation: '"80/20 qoidasi" — professional sotuvchi ko\'proq tinglaydi, savollar beradi va mijozning muammosini tushunadi.',
    difficulty: 'MEDIUM' as const,
    order: 6,
  },
  {
    category: 'Negotiation',
    questionText: 'Narx muzokarasida eng kuchli pozitsiya qaysi?',
    options: [
      'Har qanday narxga rozi bo\'lish',
      'Qo\'shimcha qiymat qo\'shish',
      'Muzokaradan bosh tortish',
      'Raqobat narxini past ko\'rsatish'
    ],
    correctAnswer: 'Qo\'shimcha qiymat qo\'shish',
    explanation: 'Narxni tushirish o\'rniga qo\'shimcha xizmat yoki afzallik taklif qilish foydani saqlaydi va mijoz qoniqishini oshiradi.',
    difficulty: 'HARD' as const,
    order: 7,
  },
  {
    category: 'Sales Basics',
    questionText: 'BANT (Budget, Authority, Need, Timing) metodologiyasi nimaga xizmat qiladi?',
    options: [
      'Narx belgilashga',
      'Mijozni kvalifikatsiya qilishga',
      'Reklama kampaniyasiga',
      'Shartnoma tayyorlashga'
    ],
    correctAnswer: 'Mijozni kvalifikatsiya qilishga',
    explanation: 'BANT — potentsial mijozning sotib olish ehtimolini baholash uchun ishlatiladigan klassik kvalifikatsiya framework.',
    difficulty: 'EASY' as const,
    order: 8,
  },
  {
    category: 'Need Discovery',
    questionText: 'Ochiq savol (open question) va yopiq savolning farqi nima?',
    options: [
      'Ochiq savol "ha/yo\'q" javob oladi',
      'Ochiq savol kengaytirilgan javob oladi',
      'Yopiq savol chuqurroq ma\'lumot beradi',
      'Farqi yo\'q'
    ],
    correctAnswer: 'Ochiq savol kengaytirilgan javob oladi',
    explanation: 'Ochiq savollar ("Nima?", "Qanday?", "Nega?") mijozdan ko\'proq ma\'lumot olishga yordam beradi.',
    difficulty: 'EASY' as const,
    order: 9,
  },
  {
    category: 'Follow-up',
    questionText: 'Yig\'ilishdan keyin qachon follow-up qilish eng to\'g\'ri?',
    options: [
      'Bir haftadan keyin',
      'Bir oydan keyin',
      '24 soat ichida',
      'Mijoz o\'zi qo\'ng\'iroq qilguncha'
    ],
    correctAnswer: '24 soat ichida',
    explanation: '24 soat ichidagi follow-up professionalizmni ko\'rsatadi va yig\'ilish ta\'sirini yangi ushlab turadi.',
    difficulty: 'EASY' as const,
    order: 10,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

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
  console.log('✅ Company:', company.name)

  // HR User
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
  console.log('✅ HR User:', hrUser.email, '| Password: password123')

  // Sales Manager Job
  const existingJob = await prisma.job.findFirst({
    where: { companyId: company.id, title: 'Sales Manager' }
  })
  const job = existingJob ?? await prisma.job.create({
    data: {
      companyId: company.id,
      title: 'Sales Manager',
      description: 'B2B Sotuv menejeri lavozimi. Mebel ishlab chiqaruvchi fabrika uchun yangi mijozlar jalb qilish va mavjud mijozlar bilan ishlash.',
      department: 'Sales',
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
    },
  })
  console.log('✅ Job:', job.title)

  // Test savollari qo'shish — upsert emas, faqat yo'q bo'lsa yaratish
  const existingQuestions = await prisma.question.count({ where: { jobId: job.id } })
  if (existingQuestions === 0) {
    await prisma.question.createMany({
      data: SALES_QUESTIONS.map(q => ({
        jobId: job.id,
        type: 'SINGLE_CHOICE',
        category: q.category,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        points: 1.0,
        order: q.order,
      }))
    })
    console.log('✅ Questions: 10 ta savol yaratildi')
  } else {
    console.log(`ℹ️  Questions: ${existingQuestions} ta savol allaqachon mavjud`)
  }

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
  console.log('✅ Demo Candidate:', candidate.firstName, candidate.lastName)

  // Demo Assessment — agar mavjud bo'lsa, o'chirib qaytadan yaratmaymiz
  const rawToken = 'demo-assessment-token-123'
  const secureTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

  const existingAssessment = await prisma.assessment.findFirst({
    where: { candidateId: candidate.id, jobId: job.id }
  })

  if (!existingAssessment) {
    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: job.id,
        status: 'APPLIED',
      },
    })

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

    // Stage lar
    await prisma.assessmentStage.createMany({
      data: STAGES_WITH_PROFILE.map(s => ({
        assessmentId: assessment.id,
        type: s.type as any,
        order: s.order,
        status: 'NOT_STARTED' as any,
      }))
    })

    // AssessmentStageConfig — spec §17 ga mos weights
    await prisma.assessmentStageConfig.createMany({
      data: STAGE_CONFIGS.map(s => ({
        assessmentId: assessment.id,
        stageType: s.type as any,
        weight: s.weight,
        maxScore: s.maxScore,
      }))
    })

    console.log(`✅ Demo Assessment yaratildi`)
    console.log(`🔗 Assessment URL: http://localhost:3000/assessment/${rawToken}`)
  } else {
    console.log(`ℹ️  Demo Assessment allaqachon mavjud: ${existingAssessment.token}`)
    console.log(`🔗 Assessment URL: http://localhost:3000/assessment/${existingAssessment.token}`)
  }

  console.log('\n🎉 Seed tugadi!')
  console.log('📧 HR Login: hr@pifagordemo.com / password123')
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
