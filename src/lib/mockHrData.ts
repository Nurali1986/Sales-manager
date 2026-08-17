export interface Vacancy {
  id: string
  title: string
  category: string
  specialty: string
  location: string
  address?: string
  workType: 'office' | 'remote' | 'hybrid'
  employmentType: 'full' | 'part' | 'internship' | 'temporary'
  schedule: string[]
  salaryType: 'range' | 'exact' | 'unspecified'
  minSalary?: number
  maxSalary?: number
  exactSalary?: number
  isTaxIncluded?: boolean
  hasBonus?: boolean
  bonusNotes?: string
  experience: string
  education: string
  skills: string[]
  responsibilities: string
  requirements: string
  offerings: string
  languages: { language: string; level: string }[]
  manager: string
  contactName: string
  contactPhone: string
  contactEmail: string
  showContacts: boolean
  status: 'active' | 'draft' | 'moderation' | 'rejected' | 'archived' | 'template'
  viewsCount: number
  applicationsCount: number
  daysLeft: number
  createdAt: string
}

export interface Candidate {
  id: string
  name: string
  title: string
  location: string
  matchRate: number
  experienceYears: number
  experienceCategory: string
  education: string
  expectedSalary: number
  skills: string[]
  languages: string[]
  status: 'new' | 'screening' | 'interview' | 'tech_interview' | 'offer' | 'hired' | 'rejected'
  rejectionReason?: string
  rejectionNote?: string
  isFavorite: boolean
  appliedVacancyId: string
  appliedVacancyTitle: string
  appliedDate: string
  phone: string
  email: string
  summary: string
}

export interface Interview {
  id: string
  candidateId: string
  candidateName: string
  vacancyTitle: string
  date: string
  time: string
  format: 'online' | 'office'
  linkOrAddress: string
  interviewer: string
}

export interface ChatMessage {
  id: string
  candidateId: string
  sender: 'hr' | 'candidate'
  text: string
  timestamp: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'HR Admin' | 'Recruiter' | 'Hiring Manager'
  permissions: {
    createVacancy: boolean
    editVacancy: boolean
    viewCandidates: boolean
    editCandidates: boolean
    viewBilling: boolean
    companySettings: boolean
  }
  status: 'Active' | 'Pending'
}

export const initialVacancies: Vacancy[] = [
  {
    id: 'vac-1',
    title: 'QA Engineer',
    category: 'IT',
    specialty: 'Testing / QA',
    location: 'Toshkent',
    address: 'Chilonzor tumani, Bunyodkor ko\'chasi 15-uy',
    workType: 'office',
    employmentType: 'full',
    schedule: ['5/2'],
    salaryType: 'range',
    minSalary: 8000000,
    maxSalary: 15000000,
    isTaxIncluded: false,
    hasBonus: true,
    bonusNotes: 'KPI bo\'yicha har choraklik bonus',
    experience: '1–3 yil',
    education: 'O\'rta maxsus',
    skills: ['Postman', 'REST API', 'SQL', 'Git', 'Jira'],
    responsibilities: 'Avtomatlashtirilgan va qo\'lda testlash o\'tkazish, API funksionalligini tekshirish, bug reportlar tuzish.',
    requirements: 'Postman va SQL bilimlariga ega bo\'lish, REST API arxitekturasini tushunish.',
    offerings: 'Keng va yorug\' ofis, bepul tushlik, professional o\'sish imkoniyati.',
    languages: [{ language: 'O\'zbek tili', level: 'C1' }, { language: 'Rus tili', level: 'B2' }, { language: 'Ingliz tili', level: 'B1' }],
    manager: 'Azizbek Karimov',
    contactName: 'Azizbek Karimov',
    contactPhone: '+998 90 123 45 67',
    contactEmail: 'hr@company.uz',
    showContacts: true,
    status: 'active',
    viewsCount: 156,
    applicationsCount: 24,
    daysLeft: 18,
    createdAt: '2026-08-01'
  },
  {
    id: 'vac-2',
    title: 'SMM Manager',
    category: 'Marketing',
    specialty: 'Social Media',
    location: 'Toshkent',
    workType: 'hybrid',
    employmentType: 'full',
    schedule: ['5/2'],
    salaryType: 'range',
    minSalary: 6000000,
    maxSalary: 10000000,
    experience: '1–3 yil',
    education: 'Oliy',
    skills: ['Targeting', 'Copywriting', 'Photoshop', 'CapCut'],
    responsibilities: 'Ijtimoiy tarmoqlar uchun kontent-plan tuzish, targeting reklamalarni sozlash.',
    requirements: 'Kreativ fikrlash, o\'zbek va rus tillarida ravon yozish ko\'nikmasi.',
    offerings: 'Moslashuvchan grafik, zamonaviy uskunalar.',
    languages: [{ language: 'O\'zbek tili', level: 'C2' }, { language: 'Rus tili', level: 'C1' }],
    manager: 'Madina Aliyeva',
    contactName: 'Madina Aliyeva',
    contactPhone: '+998 93 987 65 43',
    contactEmail: 'madina@company.uz',
    showContacts: true,
    status: 'active',
    viewsCount: 87,
    applicationsCount: 12,
    daysLeft: 12,
    createdAt: '2026-08-05'
  },
  {
    id: 'vac-3',
    title: 'Sales Manager',
    category: 'Sotuv',
    specialty: 'B2B Sales',
    location: 'Toshkent',
    workType: 'office',
    employmentType: 'full',
    schedule: ['5/2'],
    salaryType: 'range',
    minSalary: 10000000,
    maxSalary: 25000000,
    experience: '3–6 yil',
    education: 'Oliy',
    skills: ['B2B Sales', 'CRM', 'Muzokaralar', 'Cold Calling'],
    responsibilities: 'Yangi korporativ mijozlarni jalb qilish va muzokaralar olib borish.',
    requirements: 'B2B sotuvlar sohasida kamida 2 yil muvaffaqiyatli tajriba.',
    offerings: 'Yuqori sotuv foizlari (% bonus), korporativ mashina.',
    languages: [{ language: 'O\'zbek tili', level: 'C2' }, { language: 'Rus tili', level: 'C2' }],
    manager: 'Azizbek Karimov',
    contactName: 'Azizbek Karimov',
    contactPhone: '+998 90 123 45 67',
    contactEmail: 'hr@company.uz',
    showContacts: true,
    status: 'active',
    viewsCount: 214,
    applicationsCount: 31,
    daysLeft: 5,
    createdAt: '2026-07-28'
  },
  {
    id: 'vac-4',
    title: 'Senior Frontend Developer (React/Next.js)',
    category: 'IT',
    specialty: 'Frontend',
    location: 'Toshkent',
    workType: 'remote',
    employmentType: 'full',
    schedule: ['Moslashuvchan'],
    salaryType: 'range',
    minSalary: 20000000,
    maxSalary: 35000000,
    experience: '3–6 yil',
    education: 'Oliy',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'State Management'],
    responsibilities: 'Murakkab web dasturlarning frontend qismini loyihalash va ishlab chiqish.',
    requirements: 'Next.js, TypeScript hamda UI/UX standartlarini yaxshi bilish.',
    offerings: 'Masofaviy ish, dollar ekvivalentida maosh, tibbiy sug\'urta.',
    languages: [{ language: 'Ingliz tili', level: 'B2' }],
    manager: 'Azizbek Karimov',
    contactName: 'Azizbek Karimov',
    contactPhone: '+998 90 123 45 67',
    contactEmail: 'hr@company.uz',
    showContacts: true,
    status: 'moderation',
    viewsCount: 45,
    applicationsCount: 8,
    daysLeft: 25,
    createdAt: '2026-08-14'
  },
  {
    id: 'vac-5',
    title: 'HR Generalist',
    category: 'HR',
    specialty: 'Recruitment',
    location: 'Samarqand',
    workType: 'office',
    employmentType: 'full',
    schedule: ['5/2'],
    salaryType: 'range',
    minSalary: 7000000,
    maxSalary: 12000000,
    experience: '1–3 yil',
    education: 'Oliy',
    skills: ['Recruitment', 'Adaptatsiya', 'KPI', 'Mehnat kodi'],
    responsibilities: 'Kompaniya uchun munosib kadrlarni saralash va moslashtirish.',
    requirements: 'HR jarayonlari va suhbat o\'tkazish texnikalarini mukammal bilish.',
    offerings: 'Karyera o\'sishi va doimiy treninglar.',
    languages: [{ language: 'O\'zbek tili', level: 'C1' }, { language: 'Rus tili', level: 'B2' }],
    manager: 'Madina Aliyeva',
    contactName: 'Madina Aliyeva',
    contactPhone: '+998 93 987 65 43',
    contactEmail: 'madina@company.uz',
    showContacts: true,
    status: 'draft',
    viewsCount: 0,
    applicationsCount: 0,
    daysLeft: 30,
    createdAt: '2026-08-15'
  }
]

export const initialCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Muhammad Ali',
    title: 'QA Engineer',
    location: 'Toshkent',
    matchRate: 86,
    experienceYears: 3,
    experienceCategory: '1–3 yil',
    education: 'Oliy (TATU)',
    expectedSalary: 12000000,
    skills: ['Postman', 'REST API', 'SQL', 'Jira', 'Git', 'Python'],
    languages: ['O\'zbek (Native)', 'Rus (B2)', 'English (B2)'],
    status: 'new',
    isFavorite: true,
    appliedVacancyId: 'vac-1',
    appliedVacancyTitle: 'QA Engineer',
    appliedDate: '2026-08-16 14:20',
    phone: '+998 90 999 88 77',
    email: 'muhammad.ali@testmail.com',
    summary: '3 yillik tajribaga ega Manual & Automation QA engineer. Postman va SQL orqali backend va DB larni sinovdan o\'tkazish bo\'yicha yetarli tajribaga egaman.'
  },
  {
    id: 'cand-2',
    name: 'Sardor Karimov',
    title: 'Sales Manager',
    location: 'Toshkent',
    matchRate: 92,
    experienceYears: 4,
    experienceCategory: '3–6 yil',
    education: 'Oliy (VEST)',
    expectedSalary: 18000000,
    skills: ['B2B Sales', 'CRM', 'Muzokaralar', 'Cold Calling', 'Pitching'],
    languages: ['O\'zbek (C2)', 'Rus (C2)', 'English (B2)'],
    status: 'interview',
    isFavorite: true,
    appliedVacancyId: 'vac-3',
    appliedVacancyTitle: 'Sales Manager',
    appliedDate: '2026-08-14 10:15',
    phone: '+998 91 222 33 44',
    email: 'sardor.karimov@testmail.com',
    summary: 'B2B va Korporativ sotuvlar bo\'yicha 4 yillik tajriba. MoySklad hamda AmoCRM tizimlarida ishlashni mukammal bilaman.'
  },
  {
    id: 'cand-3',
    name: 'Dilshod Mamadaliyev',
    title: 'SMM Specialist',
    location: 'Toshkent',
    matchRate: 78,
    experienceYears: 2,
    experienceCategory: '1–3 yil',
    education: 'O\'rta maxsus',
    expectedSalary: 8000000,
    skills: ['Targeting', 'Copywriting', 'Photoshop', 'TikTok', 'Instagram'],
    languages: ['O\'zbek (Native)', 'Rus (B1)'],
    status: 'screening',
    isFavorite: false,
    appliedVacancyId: 'vac-2',
    appliedVacancyTitle: 'SMM Manager',
    appliedDate: '2026-08-15 18:40',
    phone: '+998 93 444 55 66',
    email: 'dilshod.smm@testmail.com',
    summary: 'Kreativ SMM menejeri. 10 dan ortiq muvaffaqiyatli loyihalarda kontent meykering hamda tarjeting olib borganman.'
  },
  {
    id: 'cand-4',
    name: 'Jasur Rahimov',
    title: 'Frontend Developer',
    location: 'Samarqand',
    matchRate: 94,
    experienceYears: 5,
    experienceCategory: '3–6 yil',
    education: 'Oliy (SamDU)',
    expectedSalary: 25000000,
    skills: ['React', 'Next.js', 'TypeScript', 'Redux Toolkit', 'TailwindCSS'],
    languages: ['O\'zbek (C1)', 'English (B2)'],
    status: 'tech_interview',
    isFavorite: false,
    appliedVacancyId: 'vac-4',
    appliedVacancyTitle: 'Senior Frontend Developer (React/Next.js)',
    appliedDate: '2026-08-13 09:30',
    phone: '+998 94 777 11 22',
    email: 'jasur.frontend@testmail.com',
    summary: 'Frontend mutaxassisi. Next.js App Router, SSR, Performance optimization va clean code prinsiplari bo\'yicha 5 yillik muammosiz tajriba.'
  },
  {
    id: 'cand-5',
    name: 'Nigora Yuldasheva',
    title: 'QA Tester',
    location: 'Toshkent',
    matchRate: 70,
    experienceYears: 1,
    experienceCategory: '1 yilgacha',
    education: 'Oliy (Inha)',
    expectedSalary: 7000000,
    skills: ['Manual QA', 'Test Cases', 'Jira', 'Bug Tracking'],
    languages: ['O\'zbek (C1)', 'Rus (C2)', 'English (C1)'],
    status: 'offer',
    isFavorite: true,
    appliedVacancyId: 'vac-1',
    appliedVacancyTitle: 'QA Engineer',
    appliedDate: '2026-08-10 11:00',
    phone: '+998 97 888 33 22',
    email: 'nigora.qa@testmail.com',
    summary: 'Junior/Middle QA tester. TestKeys va Jira bilan ishlash tajribam bor.'
  },
  {
    id: 'cand-6',
    name: 'Bekzod Tursunov',
    title: 'Sales Representative',
    location: 'Buxoro',
    matchRate: 88,
    experienceYears: 3,
    experienceCategory: '1–3 yil',
    education: 'Oliy',
    expectedSalary: 12000000,
    skills: ['Sales', 'Negotiation', 'Presentation'],
    languages: ['O\'zbek (C2)', 'Rus (B2)'],
    status: 'hired',
    isFavorite: false,
    appliedVacancyId: 'vac-3',
    appliedVacancyTitle: 'Sales Manager',
    appliedDate: '2026-08-01 16:20',
    phone: '+998 99 111 00 99',
    email: 'bekzod.sales@testmail.com',
    summary: 'Sotuvlar mutaxassisi.'
  },
  {
    id: 'cand-7',
    name: 'Alisher Qodirov',
    title: 'QA Trainee',
    location: 'Toshkent',
    matchRate: 60,
    experienceYears: 0,
    experienceCategory: 'Tajribasiz',
    education: 'O\'rta maxsus',
    expectedSalary: 5000000,
    skills: ['HTML', 'CSS', 'Basic QA'],
    languages: ['O\'zbek (Native)'],
    status: 'rejected',
    rejectionReason: 'Tajriba yetarli emas',
    rejectionNote: 'Afsuski vakansiya talablariga mos tajriba aniqlanmadi.',
    isFavorite: false,
    appliedVacancyId: 'vac-1',
    appliedVacancyTitle: 'QA Engineer',
    appliedDate: '2026-08-08 12:00',
    phone: '+998 90 000 12 34',
    email: 'alisher@testmail.com',
    summary: 'Testing sohasini yangi o\'rganayotgan yosh mutaxassis.'
  }
]

export const initialInterviews: Interview[] = [
  {
    id: 'int-1',
    candidateId: 'cand-1',
    candidateName: 'Muhammad Ali',
    vacancyTitle: 'QA Engineer',
    date: '2026-08-17',
    time: '09:00',
    format: 'online',
    linkOrAddress: 'https://meet.google.com/abc-defg-hij',
    interviewer: 'Azizbek Karimov'
  },
  {
    id: 'int-2',
    candidateId: 'cand-2',
    candidateName: 'Sardor Karimov',
    vacancyTitle: 'Sales Manager',
    date: '2026-08-17',
    time: '14:00',
    format: 'office',
    linkOrAddress: 'Toshkent, Chilonzor tumani 15-uy',
    interviewer: 'Azizbek Karimov'
  },
  {
    id: 'int-3',
    candidateId: 'cand-4',
    candidateName: 'Jasur Rahimov',
    vacancyTitle: 'Senior Frontend Developer',
    date: '2026-08-18',
    time: '11:00',
    format: 'online',
    linkOrAddress: 'https://meet.google.com/xyz-uvwx-rst',
    interviewer: 'Azizbek Karimov & Tech Lead'
  }
]

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    candidateId: 'cand-1',
    sender: 'candidate',
    text: 'Assalomu alaykum! QA Engineer vakansiyasi bo\'yicha rezyumemni yuborgandim.',
    timestamp: '14:20'
  },
  {
    id: 'msg-2',
    candidateId: 'cand-1',
    sender: 'hr',
    text: 'Vaalaykum assalom, Muhammad Ali! Arizangizni ko\'rib chiqdik, ertaga soat 09:00 da Google Meet orqali suhbatlashsak bo\'ladimi?',
    timestamp: '14:25'
  },
  {
    id: 'msg-3',
    candidateId: 'cand-1',
    sender: 'candidate',
    text: 'Ha, albatta! Vaqt ma\'qul. Havolani kutyapman.',
    timestamp: '14:28'
  },
  {
    id: 'msg-4',
    candidateId: 'cand-2',
    sender: 'candidate',
    text: 'Salom, suhbatimiz ofisda bo\'lishi tasdiqlandimi?',
    timestamp: '11:10'
  },
  {
    id: 'msg-5',
    candidateId: 'cand-2',
    sender: 'hr',
    text: 'Salom Sardor! Ha, ertaga soat 14:00 da ofisimizda kutyapmiz.',
    timestamp: '11:15'
  }
]

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Azizbek Karimov',
    email: 'azizbek@company.uz',
    role: 'HR Admin',
    permissions: {
      createVacancy: true,
      editVacancy: true,
      viewCandidates: true,
      editCandidates: true,
      viewBilling: true,
      companySettings: true
    },
    status: 'Active'
  },
  {
    id: 'team-2',
    name: 'Madina Aliyeva',
    email: 'madina@company.uz',
    role: 'Recruiter',
    permissions: {
      createVacancy: true,
      editVacancy: true,
      viewCandidates: true,
      editCandidates: true,
      viewBilling: false,
      companySettings: false
    },
    status: 'Active'
  },
  {
    id: 'team-3',
    name: 'Sardor Nuraliyev',
    email: 'sardor@company.uz',
    role: 'Recruiter',
    permissions: {
      createVacancy: true,
      editVacancy: false,
      viewCandidates: true,
      editCandidates: true,
      viewBilling: false,
      companySettings: false
    },
    status: 'Pending'
  }
]

export const initialCompanyInfo = {
  name: 'TechSolutions Co.',
  logoUrl: '/favicon.ico',
  website: 'https://techsolutions.uz',
  phone: '+998 71 200 00 00',
  email: 'hr@techsolutions.uz',
  city: 'Toshkent',
  address: 'Chilonzor tumani, Bunyodkor ko\'chasi 15-uy',
  industry: 'Axborot texnologiyalari / Dasturlash',
  employeeCount: '50-100 kishi',
  description: 'TechSolutions Co. — O\'zbekistondagi yetakchi IT va konsalting kompaniyalaridan biri bo\'lib, korporativ mijozlar uchun zamonaviy dasturiy ta\'minot va HR yechimlarini ishlab chiqadi.'
}

export const initialBillingInfo = {
  currentPlan: 'PRO',
  pricePerMonth: '1 500 000 so\'m',
  renewsAt: '2026-09-15',
  activeVacanciesUsed: 8,
  activeVacanciesLimit: 20,
  resumeViewsUsed: 245,
  resumeViewsLimit: 500,
  paymentHistory: [
    { id: 'pay-1', date: '2026-08-15', amount: '1 500 000 so\'m', plan: 'PRO 1 Oylik', status: 'To\'langan', invoiceUrl: '#' },
    { id: 'pay-2', date: '2026-07-15', amount: '1 500 000 so\'m', plan: 'PRO 1 Oylik', status: 'To\'langan', invoiceUrl: '#' },
    { id: 'pay-3', date: '2026-06-15', amount: '1 500 000 so\'m', plan: 'PRO 1 Oylik', status: 'To\'langan', invoiceUrl: '#' }
  ]
}
