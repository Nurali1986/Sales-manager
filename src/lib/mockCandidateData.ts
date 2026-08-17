export interface CandidateProfile {
  name: string
  location: string
  phone: string
  email: string
  completeness: number
  targetRole: string
  expectedSalary: number
  summary: string
  experience: {
    id: string
    company: string
    role: string
    startDate: string
    endDate: string
    description: string
  }[]
  education: {
    id: string
    institution: string
    degree: string
    year: string
  }[]
  skills: string[]
  languages: { language: string; level: string }[]
  portfolio: {
    github: string
    linkedin: string
    website: string
  }
}

export interface CandidateApplication {
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  appliedDate: string
  status: 'new' | 'screening' | 'interview' | 'tech_interview' | 'offer' | 'hired' | 'rejected'
  timeline: {
    step: string
    done: boolean
    current?: boolean
    date?: string
  }[]
}

export interface CandidateSavedJob {
  id: string
  jobTitle: string
  companyName: string
  salaryText: string
  location: string
  workType: string
  savedDate: string
}

export interface CandidateInterviewItem {
  id: string
  jobTitle: string
  companyName: string
  type: string
  date: string
  time: string
  duration: string
  interviewer: string
  format: 'online' | 'office'
  meetingLink: string
}

export interface CandidateMessageItem {
  id: string
  sender: 'candidate' | 'recruiter'
  recruiterName: string
  companyName: string
  text: string
  timestamp: string
}

export const initialCandidateProfile: CandidateProfile = {
  name: 'Elbek Abdullayev',
  location: 'Toshkent',
  phone: '+998 90 123 99 88',
  email: 'elbek.candidate@example.com',
  completeness: 80,
  targetRole: 'QA Engineer / Dasturchi',
  expectedSalary: 10000000,
  summary: '2 yillik tajribaga ega bo\'lgan QA Engineer va IT mutaxassisi. Postman, SQL, REST API va avtomatlashtirilgan testlash bo\'yicha amaliy bilimlarga egaman.',
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Solutions LLC',
      role: 'Junior QA Engineer',
      startDate: '2024-01',
      endDate: '2026-06',
      description: 'Web va Mobile ilovalarda manual testlar o\'tkazish, Jira-da bug reportlar yaratish.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Toshkent Axborot Texnologiyalari Universiteti (TATU)',
      degree: 'Bakalavr — Dasturiy Injiniring',
      year: '2020-2024'
    }
  ],
  skills: ['Postman', 'SQL', 'REST API', 'Git', 'Manual QA', 'Jira', 'Python basics'],
  languages: [
    { language: 'O\'zbek tili', level: 'C1' },
    { language: 'Rus tili', level: 'B2' },
    { language: 'Ingliz tili', level: 'B1' }
  ],
  portfolio: {
    github: 'https://github.com/elbek-qa',
    linkedin: 'https://linkedin.com/in/elbek-abdullayev',
    website: 'https://elbek-portfolio.uz'
  }
}

export const initialCandidateApplications: CandidateApplication[] = [
  {
    id: 'app-1',
    jobId: 'vac-1',
    jobTitle: 'QA Engineer',
    companyName: 'TechCompany LLC',
    appliedDate: '16 avgust 2026',
    status: 'screening',
    timeline: [
      { step: 'Ariza yuborildi', done: true, date: '16 avgust' },
      { step: 'HR ko‘rib chiqdi', done: true, date: '16 avgust' },
      { step: 'HR interview', done: false, current: true },
      { step: 'Technical interview', done: false },
      { step: 'Offer', done: false },
      { step: 'Ishga qabul qilindi', done: false }
    ]
  },
  {
    id: 'app-2',
    jobId: 'vac-2',
    jobTitle: 'SMM Manager',
    companyName: 'Media Agency',
    appliedDate: '12 avgust 2026',
    status: 'interview',
    timeline: [
      { step: 'Ariza yuborildi', done: true, date: '12 avgust' },
      { step: 'HR ko‘rib chiqdi', done: true, date: '13 avgust' },
      { step: 'HR interview', done: true, date: '15 avgust' },
      { step: 'Technical interview', done: false, current: true },
      { step: 'Offer', done: false },
      { step: 'Ishga qabul qilindi', done: false }
    ]
  },
  {
    id: 'app-3',
    jobId: 'vac-3',
    jobTitle: 'Sales Representative',
    companyName: 'Global Trade',
    appliedDate: '01 avgust 2026',
    status: 'hired',
    timeline: [
      { step: 'Ariza yuborildi', done: true, date: '01 avgust' },
      { step: 'HR ko‘rib chiqdi', done: true, date: '02 avgust' },
      { step: 'HR interview', done: true, date: '04 avgust' },
      { step: 'Technical interview', done: true, date: '07 avgust' },
      { step: 'Offer', done: true, date: '10 avgust' },
      { step: 'Ishga qabul qilindi', done: true, date: '12 avgust' }
    ]
  }
]

export const initialCandidateSavedJobs: CandidateSavedJob[] = [
  {
    id: 'vac-1',
    jobTitle: 'QA Engineer',
    companyName: 'TechCompany LLC',
    salaryText: '8–15 mln so‘m',
    location: 'Toshkent',
    workType: 'Gibrid',
    savedDate: '15 avgust'
  },
  {
    id: 'vac-4',
    jobTitle: 'Frontend Developer (React)',
    companyName: 'Startup X',
    salaryText: '10–18 mln so‘m',
    location: 'Remote',
    workType: 'Remote',
    savedDate: '14 avgust'
  }
]

export const initialCandidateInterviews: CandidateInterviewItem[] = [
  {
    id: 'int-cand-1',
    jobTitle: 'QA Engineer',
    companyName: 'TechCompany LLC',
    type: 'HR Interview',
    date: '20 avgust 2026',
    time: '15:00',
    duration: '30 daqiqa',
    interviewer: 'Madina Aliyeva',
    format: 'online',
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  }
]

export const initialCandidateMessages: CandidateMessageItem[] = [
  {
    id: 'c-msg-1',
    sender: 'recruiter',
    recruiterName: 'Madina Aliyeva',
    companyName: 'TechCompany LLC',
    text: 'Salom, Elbek! QA Engineer vakansiyasi bo\'yicha arizangizni ko\'rib chiqdik. 20-avgust soat 15:00 da intervyu o\'tkaza olamizmi?',
    timestamp: '14:20'
  },
  {
    id: 'c-msg-2',
    sender: 'candidate',
    recruiterName: 'Madina Aliyeva',
    companyName: 'TechCompany LLC',
    text: 'Assalomu alaykum Madina opa! Ha, albatta, vaqt ma\'qul.',
    timestamp: '14:25'
  }
]
