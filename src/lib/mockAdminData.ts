export interface AdminCompany {
  id: string
  name: string
  legalName: string
  inn: string
  phone: string
  email: string
  website: string
  city: string
  address: string
  industry: string
  employeeCount: string
  status: 'verified' | 'pending' | 'blocked' | 'rejected'
  hrManager: string
  vacanciesCount: number
  candidatesCount: number
  plan: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'
  registeredAt: string
  certificateDocUrl?: string
  licenseDocUrl?: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'Candidate' | 'HR' | 'Company Admin' | 'SuperAdmin'
  companyName?: string
  status: 'Active' | 'Blocked' | 'Pending'
  registeredAt: string
  lastLogin: string
  twoFactorEnabled: boolean
}

export interface AdminVacancy {
  id: string
  title: string
  companyName: string
  category: string
  location: string
  salaryText: string
  status: 'active' | 'moderation' | 'draft' | 'rejected' | 'archived' | 'reported'
  viewsCount: number
  applicationsCount: number
  createdAt: string
  checklist: {
    companyVerified: boolean
    jobTitleValid: boolean
    salaryValid: boolean
    categoryValid: boolean
    locationValid: boolean
    descriptionValid: boolean
    noProhibitedContent: boolean
  }
}

export interface AdminReport {
  id: string
  reporterName: string
  vacancyTitle: string
  companyName: string
  reason: string
  description: string
  status: 'open' | 'resolved' | 'ignored'
  createdAt: string
}

export interface AdminPayment {
  id: string
  transactionId: string
  companyName: string
  plan: string
  amount: string
  paymentMethod: string
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded'
  date: string
}

export interface AdminPlan {
  id: string
  name: string
  price: string
  period: string
  activeVacanciesLimit: number
  resumeViewsLimit: number
  teamLimit: number
  features: string[]
  isPopular?: boolean
}

export interface AdminCategory {
  id: string
  name: string
  subcategories: string[]
}

export interface AdminLocation {
  id: string
  region: string
  districts: string[]
}

export interface AdminSupportTicket {
  id: string
  ticketNumber: string
  userName: string
  userEmail: string
  subject: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved'
  createdAt: string
}

export interface AdminAuditLog {
  id: string
  adminName: string
  action: string
  target: string
  ip: string
  timestamp: string
  result: 'SUCCESS' | 'FAILED'
}

export const initialAdminStats = {
  totalCompanies: 1248,
  totalUsers: 84521,
  totalVacancies: 12482,
  totalApplications: 156430,
  todayRevenue: '4 500 000 so\'m',
  monthlyRevenue: '128 500 000 so\'m',
  pendingCompanies: 14,
  pendingVacancies: 27,
  unresolvedReports: 8,
  paymentIssues: 5,
  supportTickets: 32
}

export const initialAdminCompanies: AdminCompany[] = [
  {
    id: 'comp-1248',
    name: 'TechCompany LLC',
    legalName: 'TechCompany Mas\'uliyati Cheklangan Jamiyati',
    inn: '123456789',
    phone: '+998 71 200 00 00',
    email: 'info@techcompany.uz',
    website: 'https://techcompany.uz',
    city: 'Toshkent',
    address: 'Chilonzor tumani, Bunyodkor ko\'chasi 15-uy',
    industry: 'IT / Dasturlash',
    employeeCount: '50-100 kishi',
    status: 'verified',
    hrManager: 'Madina Aliyeva',
    vacanciesCount: 24,
    candidatesCount: 186,
    plan: 'PRO',
    registeredAt: '2025-11-10',
    certificateDocUrl: '/docs/certificate.pdf'
  },
  {
    id: 'comp-1249',
    name: 'ABC Logistics LLC',
    legalName: 'ABC Logistics MChJ',
    inn: '987654321',
    phone: '+998 90 987 65 43',
    email: 'hr@abclogistics.uz',
    website: 'https://abclogistics.uz',
    city: 'Samarqand',
    address: 'Registon ko\'chasi 45-uy',
    industry: 'Logistika va Transport',
    employeeCount: '20-50 kishi',
    status: 'pending',
    hrManager: 'Sardor Karimov',
    vacanciesCount: 5,
    candidatesCount: 32,
    plan: 'FREE',
    registeredAt: '2026-08-16',
    certificateDocUrl: '/docs/abc_cert.pdf'
  },
  {
    id: 'comp-1250',
    name: 'Global Trade Corp',
    legalName: 'Global Trade Corporation MChJ',
    inn: '456789123',
    phone: '+998 71 233 44 55',
    email: 'contact@globaltrade.uz',
    website: 'https://globaltrade.uz',
    city: 'Toshkent',
    address: 'Mirobod tumani, Nukus ko\'chasi 88-uy',
    industry: 'Sotuv va Eksport',
    employeeCount: '100+ kishi',
    status: 'verified',
    hrManager: 'Azizbek Karimov',
    vacanciesCount: 18,
    candidatesCount: 210,
    plan: 'BUSINESS',
    registeredAt: '2025-06-01'
  }
]

export const initialAdminUsers: AdminUser[] = [
  {
    id: 'usr-9281',
    name: 'Elbek Abdullayev',
    email: 'elbek.candidate@example.com',
    phone: '+998 90 123 99 88',
    role: 'Candidate',
    status: 'Active',
    registeredAt: '2026-01-15',
    lastLogin: '2026-08-17 09:12',
    twoFactorEnabled: false
  },
  {
    id: 'usr-9282',
    name: 'Madina Aliyeva',
    email: 'madina@techcompany.uz',
    phone: '+998 93 987 65 43',
    role: 'HR',
    companyName: 'TechCompany LLC',
    status: 'Active',
    registeredAt: '2025-11-10',
    lastLogin: '2026-08-17 08:45',
    twoFactorEnabled: true
  },
  {
    id: 'usr-9283',
    name: 'SuperAdmin System',
    email: 'superadmin@platform.uz',
    phone: '+998 71 111 00 00',
    role: 'SuperAdmin',
    status: 'Active',
    registeredAt: '2025-01-01',
    lastLogin: '2026-08-17 09:50',
    twoFactorEnabled: true
  }
]

export const initialAdminVacancies: AdminVacancy[] = [
  {
    id: 'vac-18291',
    title: 'QA Engineer',
    companyName: 'TechCompany LLC',
    category: 'IT / Testing',
    location: 'Toshkent',
    salaryText: '8–15 mln so‘m',
    status: 'moderation',
    viewsCount: 156,
    applicationsCount: 24,
    createdAt: '2026-08-16 14:00',
    checklist: {
      companyVerified: true,
      jobTitleValid: true,
      salaryValid: true,
      categoryValid: true,
      locationValid: true,
      descriptionValid: true,
      noProhibitedContent: true
    }
  },
  {
    id: 'vac-18292',
    title: 'SMM Manager',
    companyName: 'Media Agency',
    category: 'Marketing',
    location: 'Toshkent',
    salaryText: '6–10 mln so‘m',
    status: 'active',
    viewsCount: 87,
    applicationsCount: 12,
    createdAt: '2026-08-15 10:30',
    checklist: {
      companyVerified: true,
      jobTitleValid: true,
      salaryValid: true,
      categoryValid: true,
      locationValid: true,
      descriptionValid: true,
      noProhibitedContent: true
    }
  }
]

export const initialAdminReports: AdminReport[] = [
  {
    id: 'R-12981',
    reporterName: 'Elbek Abdullayev (Candidate)',
    vacancyTitle: 'Sales Manager (Scam Report)',
    companyName: 'FakeCompany Ltd',
    reason: 'Yolg\'on vakansiya / Scam',
    description: 'Ko\'rsatilgan maosh real emas va telefon raqam javob bermayapti.',
    status: 'open',
    createdAt: '2026-08-16 18:20'
  }
]

export const initialAdminPayments: AdminPayment[] = [
  {
    id: 'pay-101',
    transactionId: 'TX-928182',
    companyName: 'TechCompany LLC',
    plan: 'PRO (1 Oylik)',
    amount: '1 500 000 UZS',
    paymentMethod: 'Payme',
    status: 'Paid',
    date: '2026-08-15'
  },
  {
    id: 'pay-102',
    transactionId: 'TX-928183',
    companyName: 'ABC Logistics LLC',
    plan: 'PRO (1 Oylik)',
    amount: '1 500 000 UZS',
    paymentMethod: 'Click',
    status: 'Failed',
    date: '2026-08-16'
  }
]

export const initialAdminPlans: AdminPlan[] = [
  {
    id: 'plan-free',
    name: 'FREE',
    price: '0 UZS',
    period: 'oyiga',
    activeVacanciesLimit: 3,
    resumeViewsLimit: 50,
    teamLimit: 1,
    features: ['3 ta faol vakansiya', '50 ta rezyume ko\'rish', 'Standart support']
  },
  {
    id: 'plan-pro',
    name: 'PRO',
    price: '1 500 000 UZS',
    period: 'oyiga',
    activeVacanciesLimit: 20,
    resumeViewsLimit: 500,
    teamLimit: 5,
    features: ['20 ta faol vakansiya', '500 ta rezyume ko\'rish', '5 ta recruiter', 'Kengaytirilgan analitika'],
    isPopular: true
  },
  {
    id: 'plan-business',
    name: 'BUSINESS',
    price: '3 500 000 UZS',
    period: 'oyiga',
    activeVacanciesLimit: 50,
    resumeViewsLimit: 2000,
    teamLimit: 15,
    features: ['50 ta faol vakansiya', '2000 ta rezyume ko\'rish', '15 ta recruiter', 'VIP Support']
  }
]

export const initialAdminCategories: AdminCategory[] = [
  {
    id: 'cat-1',
    name: 'IT va Dasturlash',
    subcategories: ['QA / Testing', 'Frontend', 'Backend', 'DevOps', 'Mobile Development', 'Data Science']
  },
  {
    id: 'cat-2',
    name: 'Marketing va PR',
    subcategories: ['SMM', 'SEO / SEM', 'Copywriting', 'Targeting', 'Brand Manager']
  },
  {
    id: 'cat-3',
    name: 'Sotuv va Xaridlar',
    subcategories: ['B2B Sales', 'Retail Sales', 'Account Manager', 'Cold Calling']
  }
]

export const initialAdminLocations: AdminLocation[] = [
  {
    id: 'loc-1',
    region: 'Toshkent shahri',
    districts: ['Chilonzor', 'Yunusobod', 'Mirobod', 'Mirzo Ulug\'bek', 'Shayxontohur', 'Yakkasaroy']
  },
  {
    id: 'loc-2',
    region: 'Samarqand viloyati',
    districts: ['Samarqand shahri', 'Kattaqo\'rg\'on', 'Jomboy', 'Urgut']
  },
  {
    id: 'loc-3',
    region: 'Buxoro viloyati',
    districts: ['Buxoro shahri', 'G\'ijduvon', 'Kogon']
  }
]

export const initialAdminTickets: AdminSupportTicket[] = [
  {
    id: 't-1',
    ticketNumber: 'SUP-19282',
    userName: 'Madina Aliyeva',
    userEmail: 'madina@techcompany.uz',
    subject: 'Vakansiyani tahrirlashda xatolik',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-08-17 08:30'
  }
]

export const initialAdminAuditLogs: AdminAuditLog[] = [
  {
    id: 'log-1',
    adminName: 'SuperAdmin System',
    action: 'APPROVE_COMPANY',
    target: 'Company #comp-1248 (TechCompany LLC)',
    ip: '195.158.12.44',
    timestamp: '2026-08-17 09:30',
    result: 'SUCCESS'
  },
  {
    id: 'log-2',
    adminName: 'SuperAdmin System',
    action: 'APPROVE_VACANCY',
    target: 'Vacancy #vac-18292 (SMM Manager)',
    ip: '195.158.12.44',
    timestamp: '2026-08-17 09:15',
    result: 'SUCCESS'
  }
]
