import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// 15 Savol — Sotuv Menejeri (Sales Manager)
const SALES_MANAGER_QUESTIONS = [
  {
    category: "Sales Basics",
    questionText: "Sotuv jarayonining birinchi qadami nima?",
    options: ["Taklif qilish", "Ehtiyojni aniqlash", "Narx aytish", "Shartnoma tuzish"],
    correctAnswer: "Ehtiyojni aniqlash",
    explanation: "SPIN va klassik sotuv metodologiyasida birinchi qadam mijozning ehtiyojini aniqlashdir.",
    difficulty: "EASY" as const, order: 1,
  },
  {
    category: "Need Discovery",
    questionText: 'Mijoz "Menga o\'ylab ko\'rish kerak" desa qanday munosabat to\'g\'ri?',
    options: ["Shartnomani yopib ketish", "Chegirma taklif qilish", "Nima o'ylatayotganini so'rash", "Ertaga qayta qo'ng'iroq qilish"],
    correctAnswer: "Nima o'ylatayotganini so'rash",
    explanation: "E'tiroz ortida aniqlanmagan shubha yotadi. To'g'ri savol bilan asosiy sababni topish kerak.",
    difficulty: "MEDIUM" as const, order: 2,
  },
  {
    category: "Objection Handling",
    questionText: '"Narxingiz juda qimmat" degan e\'tirozga eng yaxshi javob qaysi?',
    options: ["Darhol chegirma berish", "Raqobatchilarni tanqid qilish", "Qiymat va afzalliklarni tushuntirish", "Suhbatni tugatish"],
    correctAnswer: "Qiymat va afzalliklarni tushuntirish",
    explanation: "Narx e'tirozi qiymatni tushunmaslik natijasidir.",
    difficulty: "MEDIUM" as const, order: 3,
  },
  {
    category: "CRM Discipline",
    questionText: "CRM tizimini qaysi holatlarda yangilash kerak?",
    options: ["Haftada bir marta", "Har bir mijoz aloqasidan so'ng", "Oy oxirida", "Rahbar so'raganda"],
    correctAnswer: "Har bir mijoz aloqasidan so'ng",
    explanation: "Real-time CRM ma'lumotlari sotuv huniyligini to'g'ri aks ettiradi.",
    difficulty: "EASY" as const, order: 4,
  },
  {
    category: "Closing",
    questionText: 'Quyidagilardan qaysi biri "Assumptive Close" texnikasiga misol?',
    options: ['"Sotib olasizmi?"', '"Qachon yetkazib berishni boshlaylik?"', '"Boshqa savollaringiz bormi?"', '"Narx sizga mos keladimi?"'],
    correctAnswer: '"Qachon yetkazib berishni boshlaylik?"',
    explanation: "Assumptive close mijoz qaror qilib bo'lgan degan taxminda savol berishdir.",
    difficulty: "HARD" as const, order: 5,
  },
  {
    category: "Customer Communication",
    questionText: "Mijoz bilan suhbatda vaqtni taqsimlashning 80/20 qoidasi nima?",
    options: ["80% gapirish, 20% tinglash", "20% gapirish, 80% tinglash", "50% gapirish, 50% tinglash", "Faqat mijoz gapirishi kerak"],
    correctAnswer: "20% gapirish, 80% tinglash",
    explanation: "Professional sotuvchi 80% tinglaydi va to'g'ri savollar beradi.",
    difficulty: "MEDIUM" as const, order: 6,
  },
  {
    category: "Negotiation",
    questionText: "Narx muzokarasida eng kuchli yondashuv qaysi?",
    options: ["Har qanday narxga rozi bo'lish", "Qo'shimcha qiymat va servis qo'shish", "Muzokaradan bosh tortish", "Raqobat narxini past deyish"],
    correctAnswer: "Qo'shimcha qiymat va servis qo'shish",
    explanation: "Narxni tushirish o'rniga qo'shimcha qiymat taklif qilish marjani saqlaydi.",
    difficulty: "HARD" as const, order: 7,
  },
  {
    category: "BANT Qualification",
    questionText: 'BANT metodologiyasida "A" harfi nimani anglatadi?',
    options: ["Action", "Authority (Qaror qabul qiluvchi shaxs)", "Agreement", "Account"],
    correctAnswer: "Authority (Qaror qabul qiluvchi shaxs)",
    explanation: "Authority mijozning moliyaviy va shartnoma qarorini qabul qila olish vakolatidir.",
    difficulty: "EASY" as const, order: 8,
  },
  {
    category: "Questions Technique",
    questionText: "Ochiq savol berishning asosiy maqsadi nima?",
    options: ['Mijozdan "Ha/Yo\'q" javobini olish', "Mijozdan batafsil ehtiyoj ma'lumotlarini olish", "Mijozni shoshiltirish", "Suhbatni tugatish"],
    correctAnswer: "Mijozdan batafsil ehtiyoj ma'lumotlarini olish",
    explanation: "Ochiq savollar mijozning muammosini va istaklarini ochib beradi.",
    difficulty: "EASY" as const, order: 9,
  },
  {
    category: "Follow-up",
    questionText: "Mijozga birinchi uchrashuvdan so'ng follow-up qilishning optimal vaqti?",
    options: ["Bir haftadan keyin", "24 soat ichida", "Bir oydan keyin", "Mijoz o'zi qo'ng'iroq qilguncha"],
    correctAnswer: "24 soat ichida",
    explanation: "24 soat ichidagi follow-up suhbat ta'sirini yangi ushlab turadi.",
    difficulty: "EASY" as const, order: 10,
  },
  {
    category: "Presentation",
    questionText: "Mahsulot taqdimotida xususiyat (feature) va foyda (benefit) o'rtasidagi farq nima?",
    options: ["Farqi yo'q", "Xususiyat texnik parametr, foyda esa mijoz oladigan qulaylik", "Foyda narxni bildiradi", "Xususiyat faqat kafolatdir"],
    correctAnswer: "Xususiyat texnik parametr, foyda esa mijoz oladigan qulaylik",
    explanation: "Mijozlar texnik xususiyatni emas, u beradigan amaliy foydani sotib oladi.",
    difficulty: "MEDIUM" as const, order: 11,
  },
  {
    category: "Cold Calling",
    questionText: "Sovuq qo'ng'iroqda birinchi 10 soniyaning asosiy maqsadi nima?",
    options: ["Darhol mahsulotni sotish", "Diqqatni tortish va suhbatga ruxsat olish", "Shartnoma yuborish", "Narxni aytish"],
    correctAnswer: "Diqqatni tortish va suhbatga ruxsat olish",
    explanation: "Sovuq qo'ng'iroqda birinchi maqsad darhol sotish emas, balki muloqotni davom ettirishga ilmoq berishdir.",
    difficulty: "MEDIUM" as const, order: 12,
  },
  {
    category: "SPIN Selling",
    questionText: 'SPIN sotuv usulida "P" (Problem) savollari nimaga qaratilgan?',
    options: ["Mijozning mavjud muammolari va qiyinchiliklarini yuzaga chiqarishga", "Mahsulot narxiga", "Kompaniya tarixiga", "Shartnoma shartlariga"],
    correctAnswer: "Mijozning mavjud muammolari va qiyinchiliklarini yuzaga chiqarishga",
    explanation: "Problem questions mijozga o'zidagi yashirin muammolarni anglashga yordam beradi.",
    difficulty: "HARD" as const, order: 13,
  },
  {
    category: "Cross-selling",
    questionText: "Cross-selling nima?",
    options: ["Asosiy xaridga qo'shimcha turdosh mahsulot taklif qilish", "Arzonroq mahsulot taklif qilish", "Mijozni rad etish", "Chegirma berish"],
    correctAnswer: "Asosiy xaridga qo'shimcha turdosh mahsulot taklif qilish",
    explanation: "Cross-sell o'rtacha chekni va mijoz qoniqishini oshiradi.",
    difficulty: "MEDIUM" as const, order: 14,
  },
  {
    category: "Deal Closing",
    questionText: 'Mijoz "O\'rnatib berish bepulmi?" desa sotuvchi qanday javob berishi to\'g\'ri?',
    options: ['"Yo\'q, pullik"', '"Ha, agar bugun shartnoma tuzsak bepul qilib beraman"', '"Bilmayman"', '"Farqi yo\'q"'],
    correctAnswer: '"Ha, agar bugun shartnoma tuzsak bepul qilib beraman"',
    explanation: "Har bir yon berish evaziga mijozdan qaror qabul qilish majburiyatini so'rash kerak.",
    difficulty: "HARD" as const, order: 15,
  }
]

// 15 Savol — Sotuv Bo'limi Boshlig'i (Head of Sales)
const HEAD_OF_SALES_QUESTIONS = [
  {
    category: "Sales Strategy",
    questionText: "Sotuv rejasini (Sales Target) tuzishda eng birinchi qadam nima?",
    options: ["Retrospektiv va bozor hajmini tahlil qilish", "Xodimlarga maosh yozish", "Reklama berish", "Ofisni ko'chirish"],
    correctAnswer: "Retrospektiv va bozor hajmini tahlil qilish",
    explanation: "Sotuv rejasi o'tmish statistikasi va bozor imkoniyatlariga asoslanishi shart.",
    difficulty: "EASY" as const, order: 1,
  },
  {
    category: "KPI & Metrics",
    questionText: "Sotuv bo'limining LTV (Lifetime Value) ko'rsatkichi nimani bildiradi?",
    options: ["Bitta mijozning butun hamkorlik davrida keltirgan sof daromadi", "Bir kunlik sotuv hajmi", "Reklama xarajati", "Xodimlar maoshi"],
    correctAnswer: "Bitta mijozning butun hamkorlik davrida keltirgan sof daromadi",
    explanation: "LTV mijoz bilan uzoq muddatli hamkorlik qiymatini o'lchaydi.",
    difficulty: "MEDIUM" as const, order: 2,
  },
  {
    category: "CAC vs LTV",
    questionText: "Sog'lom biznesda LTV : CAC nisbati kamida qancha bo'lishi kerak?",
    options: ["1:1", "3:1", "0.5:1", "10:1"],
    correctAnswer: "3:1",
    explanation: "LTV CAC dan kamida 3 baravar yuqori bo'lsa sotuv tizimi foydali hisoblanadi.",
    difficulty: "HARD" as const, order: 3,
  },
  {
    category: "Team Leadership",
    questionText: "Sotuv menejerining motivatsiyasida KPI o'zgaruvchan qismi (bonus) qancha bo'lishi maqbul?",
    options: ["0%", "30-50%", "100%", "5%"],
    correctAnswer: "30-50%",
    explanation: "Fiksatsiyalangan ish haqi va 30-50% harakatlantiruvchi bonus balansi maksimal sotuv natijasini beradi.",
    difficulty: "MEDIUM" as const, order: 4,
  },
  {
    category: "Sales Pipeline",
    questionText: 'Sotuv huniyligida "Conversion Rate" past bo\'lsa rahbar birinchi nimani tekshirishi kerak?',
    options: ["Skriptlar va e'tirozlar bilan ishlash sifatini", "Internet tezligini", "Ofis mebellarini", "Xodimlarni darhol bo'shatish kerak"],
    correctAnswer: "Skriptlar va e'tirozlar bilan ishlash sifatini",
    explanation: "Konversiya pastligi sotuvchilarning bosqichma-bosqich ishlash ko'nikmasi yetishmasligidan dalolat beradi.",
    difficulty: "MEDIUM" as const, order: 5,
  },
  {
    category: "Sales Script Architecture",
    questionText: "Sotuv bo'limi uchun skript yaratishda 5 ta asosiy bosqichning ketma-ketligi qaysi?",
    options: [
      "Salomlashish ➔ Ehtiyojni aniqlash ➔ Taqdimot ➔ E'tirozlar ➔ Kelishuvni yakunlash",
      "Taqdimot ➔ Narx ➔ Salomlashish ➔ Yopish ➔ E'tiroz",
      "Narx ➔ Chegirma ➔ Taqdimot ➔ Yopish ➔ Xayrlashuv",
      "Salomlashish ➔ Yopish ➔ Narx ➔ Taqdimot ➔ E'tiroz"
    ],
    correctAnswer: "Salomlashish ➔ Ehtiyojni aniqlash ➔ Taqdimot ➔ E'tirozlar ➔ Kelishuvni yakunlash",
    explanation: "Bu sotuvning universal va eng samarali 5 bosqichli oltin zanjiridir.",
    difficulty: "EASY" as const, order: 6,
  },
  {
    category: "CRM & Audit",
    questionText: 'Sotuv bo\'limi auditida "Bitimlarning sababsiz osilib qolishi" nimadan darak beradi?',
    options: ["CRM reglamentining yo'qligi va nazoratsizlikdan", "Mijozlar yo'qligidan", "Yuqori maoshdan", "Yaxshi reklamadan"],
    correctAnswer: "CRM reglamentining yo'qligi va nazoratsizlikdan",
    explanation: "Aniq keyingi qadam (Next Action Date) qo'yilmasa bitimlar yopilmaydi.",
    difficulty: "MEDIUM" as const, order: 7,
  },
  {
    category: "Recruiting Sales",
    questionText: "Sotuvchilikka nomzod saralashda eng muhim soft-skill nima?",
    options: ["Empatiya va muloqotga kirishuvchanlik (Communicative Drive)", "Ofisda jim o'tirish", "Faqat Excel bilish", "Diplom baholari"],
    correctAnswer: "Empatiya va muloqotga kirishuvchanlik (Communicative Drive)",
    explanation: "Sotuvchi mijoz bilan aloqa o'rnatishi va empatiya qila olishi shart.",
    difficulty: "EASY" as const, order: 8,
  },
  {
    category: "Challenger Sale",
    questionText: "Challenger Sale sotuv modelida sotuvchining asosiy harakati nima?",
    options: ["Mijozga ta'lim berish, uning qarashlariga chaqiruv tashlash (Teach, Tailor, Take Control)", "Darhol chegirma berish", "Faqat javob kutish", "Har qanday talabga xo'p deyish"],
    correctAnswer: "Mijozga ta'lim berish, uning qarashlariga chaqiruv tashlash (Teach, Tailor, Take Control)",
    explanation: "Challenger sotuvchi mijozga yangi biznes imkoniyatlarini ko'rsatib beradi.",
    difficulty: "HARD" as const, order: 9,
  },
  {
    category: "Unit Economics",
    questionText: "Sotuv bo'limi uchun Unit-ekonomika nimani hisoblaydi?",
    options: ["Bitta mahsulot yoki mijoz kesimidagi tushum va xarajat balansini", "Butun kompaniya binosi ijarasini", "Faqat soliqni", "Faqat elektr energiyasini"],
    correctAnswer: "Bitta mahsulot yoki mijoz kesimidagi tushum va xarajat balansini",
    explanation: "Unit ekonomika har bir sotuv birligidan tushadigan haqiqiy marjani ko'rsatadi.",
    difficulty: "HARD" as const, order: 10,
  },
  {
    category: "Sales Forecasting",
    questionText: "Weighted Sales Pipeline yordamida sotuvni bashorat qilishda bitim summasi nimaga ko'paytiriladi?",
    options: ["Bitim joylashgan bosqich ehtimollik foiziga (Win Rate %)", "Xodim yoshiga", "Hafta kuniga", "Valyuta kursiga"],
    correctAnswer: "Bitim joylashgan bosqich ehtimollik foiziga (Win Rate %)",
    explanation: "Ehtimollik asosida hisoblangan sotuv prognozi moliyaviy rejalashtirishni aniq qiladi.",
    difficulty: "HARD" as const, order: 11,
  },
  {
    category: "Upselling & Cross-selling",
    questionText: "Sotuv bo'limi rahbari jamoada o'rtacha chekni oshirish uchun nimani joriy qilishi kerak?",
    options: ["Cross-sell va Up-sell skriptlari hamda motivatsiyasini", "Narxlarni tushirishni", "Qo'ng'iroqlarni taqiqlashni", "Faqat elektron pochta ishlatishni"],
    correctAnswer: "Cross-sell va Up-sell skriptlari hamda motivatsiyasini",
    explanation: "Tizimli taklif qilish ko'nikmasi o'rtacha chekni 20-40% ga oshiradi.",
    difficulty: "MEDIUM" as const, order: 12,
  },
  {
    category: "Handling Sales Burnout",
    questionText: "Sotuvchi sovuq qo'ng'iroqlarda ketma-ket rad etishlardan so'ng ruhiy tushkunlikka tushsa rahbar nima qilishi kerak?",
    options: ["1:1 muloqot o'tkazib, rolevoy o'yin (roleplay) orqali ko'nikmasini oshirish", "Darhol jazolash", "E'tiborsiz qoldirish", "Maoshini kesish"],
    correctAnswer: "1:1 muloqot o'tkazib, rolevoy o'yin (roleplay) orqali ko'nikmasini oshirish",
    explanation: "O'rgatuvchi muloqot va qo'llab-quvvatlash xodimning ishonchini tiklaydi.",
    difficulty: "MEDIUM" as const, order: 13,
  },
  {
    category: "Commission Structure",
    questionText: "Progressiv komissiya stavkasi nima?",
    options: ["Plan bajarilgan sari sotuvchi oladigan bonus foizining oshib borishi", "Doimiy fiksatsiyalangan summa", "Bonus berilmasligi", "Faqat jarima solish"],
    correctAnswer: "Plan bajarilgan sari sotuvchi oladigan bonus foizining oshib borishi",
    explanation: "Progressiv stavka sotuvchilarni plandan oshirib bajarishga ruhan undaydi.",
    difficulty: "EASY" as const, order: 14,
  },
  {
    category: "Sales Plan Execution",
    questionText: "Oyning 20-kunasida reja 50% bajarilgan bo'lsa, rahbar qanday tezkor chora ko'radi?",
    options: ["Aksiya launch qilish, issiq mijozlarga spets-taklif berish va aktivlikni 2x oshirish", "Hamma narsani to'xtatish", "Keyingi oyga surish", "Ofisni yopish"],
    correctAnswer: "Aksiya launch qilish, issiq mijozlarga spets-taklif berish va aktivlikni 2x oshirish",
    explanation: "Tezkor taktika sotuv huniyligining pastki qismidagi bitimlarni zudlik bilan yopishga qaratiladi.",
    difficulty: "HARD" as const, order: 15,
  }
]

import { getSession } from '@/lib/auth/session'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, productName, salaryMin, salaryMax, location } = body
    let { companyId } = body

    if (!title) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 })
    }

    // 1. Try to get companyId from HR session
    if (!companyId) {
      const session = await getSession()
      if (session?.companyId) {
        companyId = session.companyId as string
      }
    }

    // 2. Fallback: Find the first company in database
    if (!companyId) {
      const firstCompany = await prisma.company.findFirst()
      if (firstCompany) {
        companyId = firstCompany.id
      }
    }

    if (!companyId) {
      return NextResponse.json({ error: 'No company found in database. Seed the database first.' }, { status: 400 })
    }

    // Create the job with ACTIVE status (live on public portal)
    const job = await prisma.job.create({
      data: {
        companyId,
        title,
        description: description || `${title} - ${productName || 'Sotuv mahsuloti'}. Shahar: ${location || 'Toshkent'}`,
        department: 'Sotuv',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        currency: 'UZS'
      }
    })

    // Determine which questions to seed based on the title
    const isSalesManager = title.includes('Sales Manager') || title.includes('Sotuv Menejeri')
    const questions = isSalesManager ? SALES_MANAGER_QUESTIONS : HEAD_OF_SALES_QUESTIONS

    // Seed 15 questions for this job
    await prisma.question.createMany({
      data: questions.map((q: any) => ({
        jobId: job.id,
        type: 'SINGLE_CHOICE',
        category: q.category,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1.0,
        difficulty: q.difficulty,
        order: q.order
      }))
    })

    return NextResponse.json({ data: { job, questionsCreated: questions.length } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
