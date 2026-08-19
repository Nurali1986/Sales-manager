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
  recommendation?: string
  cvScore?: number
  testScore?: number
  liveSalesScore?: number
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
    id: 'job-sales-manager-1',
    title: 'Sotuv Menejeri (Sales Manager)',
    category: 'Sotuv',
    specialty: 'Sales Manager',
    location: 'Toshkent',
    address: 'Chilonzor tumani, Bunyodkor ko\'chasi 15-uy',
    workType: 'office',
    employmentType: 'full',
    schedule: ['5/2'],
    salaryType: 'range',
    minSalary: 8000000,
    maxSalary: 18000000,
    isTaxIncluded: false,
    hasBonus: true,
    bonusNotes: '5 bosqichli sotuv skripti va KPI bo\'yicha bonus',
    experience: '1–3 yil',
    education: 'Oliy / Maxsus',
    skills: ['5 Bosqichli Sotuv Skripti', 'Ovozli AI Call', 'SPIN Selling', 'BANT', 'E\'tirozlar bilan ishlash'],
    responsibilities: 'Mebellar do\'koni uchun B2B/B2C mijozlar bilan muloqot va bitimlarni yopish.',
    requirements: 'Sotuv sohasida kamida 1 yillik tajriba va 5 bosqichli sotuv skriptini bilish.',
    offerings: 'Raqobatbardosh maosh + KPI bonus, bepul tushlik, shinam ofis.',
    languages: [{ language: 'O\'zbek tili', level: 'C2' }, { language: 'Rus tili', level: 'B2' }],
    manager: 'Madina Aliyeva',
    contactName: 'Madina Aliyeva',
    contactPhone: '+998 90 123 45 67',
    contactEmail: 'hr@pifagordemo.com',
    showContacts: true,
    status: 'active',
    viewsCount: 312,
    applicationsCount: 42,
    daysLeft: 20,
    createdAt: '2026-08-10'
  },
  {
    id: 'job-head-of-sales-2',
    title: 'Sotuv Bo\'limi Boshlig\'i (Head of Sales)',
    category: 'Sotuv',
    specialty: 'Head of Sales',
    location: 'Toshkent',
    address: 'Yashnobod tumani, Parkent ko\'chasi 45-uy',
    workType: 'office',
    employmentType: 'full',
    schedule: ['5/2'],
    salaryType: 'range',
    minSalary: 20000000,
    maxSalary: 40000000,
    isTaxIncluded: false,
    hasBonus: true,
    bonusNotes: 'Sotuv rejasi va bo\'lim foydasidan har choraklik ulush (% bonus)',
    experience: '3–6 yil',
    education: 'Oliy',
    skills: ['Sotuv Skripti Yaratish', 'KPI Boshqaruvi', 'Sales Funnel Audit', 'Unit Ekonomika', 'Jamoani Boshqarish'],
    responsibilities: 'Sotuv bo\'limi rahbari (Sales Director). 5 bosqichli sotuv skriptlari arxitekturasini tuzish va jamoani boshqarish.',
    requirements: 'Sotuv bo\'limi rahbari sifatida kamida 3 yillik tajriba hamda B2B sotuv skriptlari arxitekturasi bilimi.',
    offerings: 'Yuqori maosh + har choraklik ulush, korporativ mashina, tibbiy sug\'urta.',
    languages: [{ language: 'O\'zbek tili', level: 'C2' }, { language: 'Rus tili', level: 'C1' }],
    manager: 'Jasur Karimov',
    contactName: 'Jasur Karimov',
    contactPhone: '+998 93 987 65 43',
    contactEmail: 'hr@pifagordemo.com',
    showContacts: true,
    status: 'active',
    viewsCount: 245,
    applicationsCount: 18,
    daysLeft: 25,
    createdAt: '2026-08-12'
  }
]

export const initialCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Ali Valiyev',
    title: 'Sotuv Menejeri (Sales Manager)',
    location: 'Toshkent',
    matchRate: 88,
    experienceYears: 3,
    experienceCategory: '1–3 yil',
    education: 'Oliy (VEST)',
    expectedSalary: 12000000,
    skills: ['5 Bosqichli Sotuv Skripti', 'Ovozli AI Call', 'SPIN Selling', 'BANT'],
    languages: ['O\'zbek (C2)', 'Rus (C1)'],
    status: 'screening',
    isFavorite: true,
    appliedVacancyId: 'job-sales-manager-1',
    appliedVacancyTitle: 'Sotuv Menejeri (Sales Manager)',
    appliedDate: '2026-08-16 14:20',
    phone: '+998 90 123 45 67',
    email: 'ali.valiyev@example.com',
    summary: '3 yillik sotuv tajribasiga ega sotuv menejeri. Ovozli AI call va 5 bosqichli sotuv skripti bo\'yicha yuqori ko\'nikmaga egaman.',
    recommendation: 'ADVANCE',
    cvScore: 92,
    testScore: 15,
    liveSalesScore: 28
  },
  {
    id: 'cand-2',
    name: 'Sardor Karimov',
    title: 'Sotuv Bo\'limi Boshlig\'i (Head of Sales)',
    location: 'Toshkent',
    matchRate: 94,
    experienceYears: 5,
    experienceCategory: '3–6 yil',
    education: 'Oliy (MGU)',
    expectedSalary: 25000000,
    skills: ['Sotuv Skripti Yaratish', 'KPI Boshqaruvi', 'Sales Funnel Audit', 'Unit Ekonomika'],
    languages: ['O\'zbek (C2)', 'Rus (C2)', 'English (B2)'],
    status: 'interview',
    isFavorite: true,
    appliedVacancyId: 'job-head-of-sales-2',
    appliedVacancyTitle: 'Sotuv Bo\'limi Boshlig\'i (Head of Sales)',
    appliedDate: '2026-08-14 10:15',
    phone: '+998 91 222 33 44',
    email: 'sardor.karimov@example.com',
    summary: 'Sotuv bo\'limi rahbari sifatida 5 yillik muvaffaqiyatli tajriba. Sotuv skriptlarini yaratish va sotuv huniyligini 3x oshirish ko\'nikmasi.',
    recommendation: 'ADVANCE',
    cvScore: 95,
    testScore: 15,
    liveSalesScore: 29
  }
]

export const initialInterviews: Interview[] = [
  {
    id: 'int-1',
    candidateId: 'cand-1',
    candidateName: 'Ali Valiyev',
    vacancyTitle: 'Sotuv Menejeri (Sales Manager)',
    date: '2026-08-18',
    time: '10:00',
    format: 'office',
    linkOrAddress: 'Toshkent, Chilonzor tumani 15-uy',
    interviewer: 'Madina Aliyeva'
  },
  {
    id: 'int-2',
    candidateId: 'cand-2',
    candidateName: 'Sardor Karimov',
    vacancyTitle: 'Sotuv Bo\'limi Boshlig\'i (Head of Sales)',
    date: '2026-08-18',
    time: '14:00',
    format: 'office',
    linkOrAddress: 'Toshkent, Yashnobod tumani 45-uy',
    interviewer: 'Jasur Karimov'
  }
]

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    candidateId: 'cand-1',
    sender: 'candidate',
    text: 'Assalomu alaykum! Sotuv Menejeri vakansiyasi bo\'yicha AI sinovlarini topshirdim.',
    timestamp: '14:20'
  },
  {
    id: 'msg-2',
    candidateId: 'cand-1',
    sender: 'hr',
    text: 'Vaalaykum assalom, Ali! AI natijalaringiz ajoyib (88% rating). Ertaga soat 10:00 da ofisimizda suhbat o\'tkazsak bo\'ladimi?',
    timestamp: '14:25'
  }
]

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Azizbek Karimov',
    email: 'hr@pifagordemo.com',
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
    email: 'madina@pifagordemo.com',
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
  }
]

export const initialCompanyInfo = {
  name: 'Pifagor Sales Academy',
  logoUrl: '/favicon.ico',
  website: 'https://pifagordemo.com',
  phone: '+998 71 200 00 00',
  email: 'hr@pifagordemo.com',
  city: 'Toshkent',
  address: 'Chilonzor tumani, Bunyodkor ko\'chasi 15-uy',
  industry: 'Sotuv Akademiyasi va Konsalting',
  employeeCount: '50-100 kishi',
  description: 'Pifagor Sales Academy — Sotuv menejerlari va Sotuv bo\'limi boshliqlarini avtomatlashtirilgan AI Assessment orqali saralovchi platforma.'
}

export const initialBillingInfo = {
  currentPlan: 'PRO',
  pricePerMonth: '1 500 000 so\'m',
  renewsAt: '2026-09-15',
  activeVacanciesUsed: 2,
  activeVacanciesLimit: 20,
  resumeViewsUsed: 45,
  resumeViewsLimit: 500,
  paymentHistory: [
    { id: 'pay-1', date: '2026-08-15', amount: '1 500 000 so\'m', plan: 'PRO 1 Oylik', status: 'To\'langan', invoiceUrl: '#' }
  ]
}
