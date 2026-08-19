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
  totalCompanies: 1,
  totalUsers: 3,
  totalVacancies: 2,
  totalApplications: 42,
  todayRevenue: '1 500 000 so\'m',
  monthlyRevenue: '1 500 000 so\'m',
  pendingCompanies: 0,
  pendingVacancies: 1,
  unresolvedReports: 0,
  paymentIssues: 0,
  supportTickets: 0
}

export const initialAdminCompanies: AdminCompany[] = [
  {
    id: 'comp-101',
    name: 'Pifagor Sales Academy',
    legalName: 'Pifagor Sales Academy MChJ',
    inn: '309812744',
    phone: '+998 71 200 00 00',
    email: 'hr@pifagordemo.com',
    website: 'https://pifagordemo.com',
    city: 'Toshkent',
    address: 'Chilonzor tumani, Bunyodkor ko\'chasi 15-uy',
    industry: 'Sotuv va Konsalting',
    employeeCount: '50-100 kishi',
    status: 'verified',
    hrManager: 'Madina Aliyeva',
    vacanciesCount: 2,
    candidatesCount: 42,
    plan: 'PRO',
    registeredAt: '2026-08-01',
    certificateDocUrl: '/docs/pifagor_cert.pdf'
  }
]

export const initialAdminUsers: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Ali Valiyev',
    email: 'ali.valiyev@example.com',
    phone: '+998 90 123 45 67',
    role: 'Candidate',
    status: 'Active',
    registeredAt: '2026-08-16',
    lastLogin: '2026-08-17 11:30',
    twoFactorEnabled: false
  },
  {
    id: 'usr-2',
    name: 'Madina Aliyeva (HR)',
    email: 'hr@pifagordemo.com',
    phone: '+998 93 987 65 43',
    role: 'HR',
    companyName: 'Pifagor Sales Academy',
    status: 'Active',
    registeredAt: '2026-08-01',
    lastLogin: '2026-08-17 12:00',
    twoFactorEnabled: true
  },
  {
    id: 'usr-3',
    name: 'SuperAdmin System',
    email: 'superadmin@platform.uz',
    phone: '+998 71 111 00 00',
    role: 'SuperAdmin',
    status: 'Active',
    registeredAt: '2025-01-01',
    lastLogin: '2026-08-17 12:45',
    twoFactorEnabled: true
  }
]

export const initialAdminVacancies: AdminVacancy[] = [
  {
    id: 'job-sales-manager-1',
    title: 'Sotuv Menejeri (Sales Manager)',
    companyName: 'Pifagor Sales Academy',
    category: 'Sotuv',
    location: 'Toshkent',
    salaryText: '8–18 mln so‘m',
    status: 'active',
    viewsCount: 312,
    applicationsCount: 42,
    createdAt: '2026-08-16 10:15',
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
    id: 'job-head-of-sales-2',
    title: 'Sotuv Bo\'limi Boshlig\'i (Head of Sales)',
    companyName: 'Pifagor Sales Academy',
    category: 'Sotuv',
    location: 'Toshkent',
    salaryText: '20–40 mln so‘m',
    status: 'moderation',
    viewsCount: 145,
    applicationsCount: 18,
    createdAt: '2026-08-17 09:30',
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

export const initialAdminReports: AdminReport[] = []

export const initialAdminPayments: AdminPayment[] = [
  {
    id: 'pay-101',
    transactionId: 'TX-928182',
    companyName: 'Pifagor Sales Academy',
    plan: 'PRO (1 Oylik)',
    amount: '1 500 000 UZS',
    paymentMethod: 'Payme',
    status: 'Paid',
    date: '2026-08-15'
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
    features: ['3 ta faol sotuv vakansiyasi', '50 ta AI assessment ko\'rish', 'Standart support']
  },
  {
    id: 'plan-pro',
    name: 'PRO',
    price: '1 500 000 UZS',
    period: 'oyiga',
    activeVacanciesLimit: 20,
    resumeViewsLimit: 500,
    teamLimit: 5,
    features: ['20 ta faol sotuv vakansiyasi', '500 ta AI assessment ko\'rish', 'Ovozli AI Call simulyatsiyasi', '5 ta recruiter'],
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
    features: ['50 ta faol sotuv vakansiyasi', 'Cheksiz AI assessment', 'VIP Support']
  }
]

export const initialAdminCategories: AdminCategory[] = [
  {
    id: 'cat-sales',
    name: 'Sotuv va Boshqaruv (Sales & Management)',
    subcategories: ['Sotuv Menejeri (Sales Manager)', 'Sotuv Bo\'limi Boshlig\'i (Head of Sales)']
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
  }
]

export const initialAdminTickets: AdminSupportTicket[] = []

export const initialAdminAuditLogs: AdminAuditLog[] = [
  {
    id: 'log-1',
    adminName: 'SuperAdmin System',
    action: 'APPROVE_COMPANY',
    target: 'Company #comp-101 (Pifagor Sales Academy)',
    ip: '195.158.12.44',
    timestamp: '2026-08-17 09:30',
    result: 'SUCCESS'
  },
  {
    id: 'log-2',
    adminName: 'SuperAdmin System',
    action: 'APPROVE_VACANCY',
    target: 'Vacancy #job-sales-manager-1 (Sotuv Menejeri)',
    ip: '195.158.12.44',
    timestamp: '2026-08-17 10:15',
    result: 'SUCCESS'
  }
]
