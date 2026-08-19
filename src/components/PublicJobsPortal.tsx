'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export interface JobItem {
  id: string
  title: string
  company: string
  companyLogoBg: string
  location: string
  salary: string
  experience: string
  format: string
  employment: string
  category: string
  skills: string[]
  description: string
  responsibilities: string[]
  requirements: string[]
  offerings: string[]
  postedAt: string
  isHot?: boolean
  hrName: string
  assessmentToken: string
}

const PUBLIC_JOBS: JobItem[] = []

const CITIES = [
  'Toshkent', 'Samarqand', 'Farg\'ona', 'Andijon', 'Namangan',
  'Buxoro', 'Navoiy', 'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Qoraqalpog\'iston'
]

export function PublicJobsPortal() {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('Barchasi')

  // DB Jobs State
  const [dbJobs, setDbJobs] = useState<JobItem[]>([])
  const [applyLoading, setApplyLoading] = useState(false)

  // Auth User State
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [candidateProfile, setCandidateProfile] = useState<{ id: string; firstName: string; lastName: string; phone: string; email?: string; city?: string } | null>(null)

  // Modals State
  const [selectedJobDetails, setSelectedJobDetails] = useState<JobItem | null>(null)
  const [targetJobForApply, setTargetJobForApply] = useState<JobItem | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showApplyWarningModal, setShowApplyWarningModal] = useState(false)

  // Auth Modal State (Register vs Login)
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register')
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regCity, setRegCity] = useState('Toshkent')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  const [loginInput, setLoginInput] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [showPasswordText, setShowPasswordText] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  // Fetch logged in candidate profile on mount
  useEffect(() => {
    fetch('/api/candidate/auth/me')
      .then(res => res.json())
      .then(res => {
        if (res.data?.candidate) {
          setCandidateProfile(res.data.candidate)
          setIsLoggedIn(true)
        }
      })
      .catch(() => {})
  }, [])

  // Fetch real vacancies from DB
  useEffect(() => {
    fetch('/api/public/vacancies')
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped: JobItem[] = res.data.map((j: any) => {
            const isSM = j.title?.includes('Sales Manager') || j.title?.includes('Sotuv Menejeri')
            return {
              id: j.id,
              title: j.title,
              company: j.company || 'Pifagor Sales Academy',
              companyLogoBg: isSM ? '#dc2626' : '#2563eb',
              location: 'Toshkent',
              salary: j.salaryMin && j.salaryMax ? `${(j.salaryMin / 1000000).toFixed(0)} 000 000 – ${(j.salaryMax / 1000000).toFixed(0)} 000 000 so'm` : 'Kelishilgan',
              experience: isSM ? '1–3 yil' : '3–6 yil',
              format: 'Ofis',
              employment: 'To\'liq stavka',
              category: isSM ? 'Sotuv Menejeri' : 'Sotuv Bo\'limi Boshlig\'i',
              skills: isSM
                ? ['5 Bosqichli Sotuv Skripti', 'Ovozli AI Call', 'SPIN Selling', 'BANT', 'E\'tirozlar bilan ishlash']
                : ['Sotuv Skripti Yaratish', 'KPI Boshqaruvi', 'Sales Funnel Audit', 'Unit Ekonomika', 'Jamoani Boshqarish'],
              description: j.description || j.title,
              responsibilities: isSM
                ? ['Mijozlar bilan 5 bosqichli sotuv skripti bo\'yicha muloqot qilish', 'E\'tirozlarni yengib bitimni yopish', 'CRM tizimida bitimlar tarixini yuritish']
                : ['Sotuv bo\'limi uchun skriptlar va yo\'riqnomalar yaratish', 'Sotuvchilar jamoasini boshqarish', 'Sales Funnel auditini doimiy o\'tkazish'],
              requirements: isSM
                ? ['Sotuv sohasida kamida 1 yillik tajriba', 'Muloqotga kirishuvchanlik', '5 bosqichli sotuv metodologiyasi bilimi']
                : ['Sotuv bo\'limi rahbari sifatida kamida 3 yillik tajriba', 'B2B skriptlar arxitekturasi bilimi'],
              offerings: isSM
                ? ['Raqobatbardosh maosh + KPI bonus', 'Shinam ofis, bepul tushlik']
                : ['Yuqori maosh + har choraklik ulush', 'Korporativ avtomobil va tibbiy sug\'urta'],
              postedAt: new Date(j.createdAt).toLocaleDateString('uz'),
              isHot: true,
              hrName: isSM ? 'Madina Aliyeva' : 'Jasur Karimov',
              assessmentToken: '' // Will be created dynamically via API
            }
          })
          setDbJobs(mapped)
        }
      })
      .catch(() => {})
  }, [])

  // Use DB jobs if available, otherwise fallback to hardcoded
  const allJobs = dbJobs.length > 0 ? dbJobs : PUBLIC_JOBS
  const filteredJobs = allJobs.filter(job => {
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && !job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    if (selectedRole !== 'Barchasi' && job.category !== selectedRole) return false
    return true
  })

  // Candidate Clicks "Ariza Topshirish"
  const handleInitiateApply = (job: JobItem) => {
    setTargetJobForApply(job)
    setSelectedJobDetails(null)

    if (!isLoggedIn) {
      setAuthError(null)
      setShowAuthModal(true)
    } else {
      setShowApplyWarningModal(true)
    }
  }

  // Handle Full Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    if (regPassword !== regConfirmPassword) {
      setAuthError('Parollar bir-biriga mos kelmadi!')
      return
    }

    if (regPassword.length < 6) {
      setAuthError('Parol kamida 6 ta belgidan iborat bo\'lishi shart.')
      return
    }

    setAuthLoading(true)

    try {
      const res = await fetch('/api/candidate/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regFirstName,
          lastName: regLastName,
          phone: regPhone,
          email: regEmail,
          city: regCity,
          password: regPassword
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi.')
      }

      setCandidateProfile(data.data.candidate)
      setIsLoggedIn(true)
      setShowAuthModal(false)

      if (targetJobForApply) {
        setShowApplyWarningModal(true)
      }
    } catch (err: any) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)

    try {
      const res = await fetch('/api/candidate/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneOrEmail: loginInput,
          password: loginPassword
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || 'Kirishda xatolik yuz berdi.')
      }

      setCandidateProfile(data.data.candidate)
      setIsLoggedIn(true)
      setShowAuthModal(false)

      if (targetJobForApply) {
        setShowApplyWarningModal(true)
      }
    } catch (err: any) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  // Handle Logout
  const handleLogout = async () => {
    await fetch('/api/candidate/auth/logout', { method: 'POST' })
    setIsLoggedIn(false)
    setCandidateProfile(null)
  }

  // Candidate Accepts Notice & Proceeds to AI Assessment (via DB API)
  const handleProceedToAssessment = async () => {
    if (!targetJobForApply || !candidateProfile) return
    setApplyLoading(true)

    try {
      // If job has a hardcoded assessmentToken (fallback), use it directly
      if (targetJobForApply.assessmentToken) {
        setShowApplyWarningModal(false)
        router.push(`/assessment/${targetJobForApply.assessmentToken}`)
        return
      }

      // Otherwise, call the apply API to create Application + Assessment in DB
      const res = await fetch('/api/candidate/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: targetJobForApply.id,
          candidateId: candidateProfile.id
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ariza topshirishda xatolik.')

      const token = data.data?.assessmentToken
      if (token) {
        setShowApplyWarningModal(false)
        router.push(`/assessment/${token}`)
      } else {
        throw new Error('Assessment token olinmadi.')
      }
    } catch (err: any) {
      alert(err.message || 'Ariza topshirishda xatolik yuz berdi.')
    } finally {
      setApplyLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                hh
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
                Sales<span style={{ color: '#dc2626' }}>Recruit.uz</span>
              </span>
            </Link>

            <nav style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', fontWeight: 700 }}>
              <Link href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>🎯 Sotuv E'lonlari</Link>
              <Link href="http://localhost:3001" target="_blank" style={{ color: '#2563eb', textDecoration: 'none' }}>🏢 HR Kabinet (:3001)</Link>
              <Link href="http://localhost:3002" target="_blank" style={{ color: '#dc2626', textDecoration: 'none' }}>🛡️ SuperAdmin (:3002)</Link>
            </nav>
          </div>

          <div>
            {!isLoggedIn ? (
              <button
                onClick={() => { setTargetJobForApply(null); setAuthError(null); setShowAuthModal(true) }}
                style={{ padding: '0.6rem 1.35rem', borderRadius: '9999px', backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(220,38,38,0.3)' }}
              >
                👤 Ro'yxatdan o'tish / Kirish
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065f46', backgroundColor: '#ecfdf5', padding: '0.45rem 0.95rem', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                  🟢 {candidateProfile?.firstName} {candidateProfile?.lastName} ({candidateProfile?.city})
                </div>
                <button
                  onClick={handleLogout}
                  style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Chiqish
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '3rem 1.5rem 3.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 800, display: 'inline-block', marginBottom: '1.25rem' }}>
            🎯 Sotuv Menejeri & Sotuv Bo'limi Boshlig'i Portal
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
            Sotuv Sohasi bo'yicha <span style={{ color: '#ef4444' }}>AI Saralash</span> Portali
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', marginBottom: '2rem' }}>
            Vakansiya talablarini ko'ring va bevosita platformadan ariza topshiring.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', maxWidth: '750px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Qidiruv: Sotuv Menejeri yoki Sotuv Boshlig'i..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', outline: 'none', fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}
            />
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: 800, backgroundColor: '#ffffff', color: '#0f172a' }}
            >
              <option value="Barchasi">Barcha Lavozimlar</option>
              <option value="Sotuv Menejeri">Sotuv Menejeri (Sales Manager)</option>
              <option value="Sotuv Bo'limi Boshlig'i">Sotuv Bo'limi Boshlig'i (Head of Sales)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Jobs Feed */}
      <section style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          Mavjud Sotuv Vakansiyalari ({filteredJobs.length})
        </h2>

        {filteredJobs.map(job => (
          <div
            key={job.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3
                  onClick={() => setSelectedJobDetails(job)}
                  style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0, cursor: 'pointer' }}
                >
                  {job.title}
                </h3>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981', marginTop: '0.3rem' }}>
                  {job.salary}
                </div>
              </div>
              <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 900, fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '8px' }}>
                🔥 HOT SALES ROLE
              </span>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>
              🏢 {job.company} • 📍 {job.location} • 🎓 {job.experience}
            </div>

            <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: 1.5 }}>
              {job.description}
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {job.skills.map(s => (
                <span key={s} style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700 }}>
                  {s}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                E'lon berildi: {job.postedAt} • HR: {job.hrName}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setSelectedJobDetails(job)}
                  style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', color: '#1e293b' }}
                >
                  📄 Vakansiya talablarini ko'rish
                </button>

                <button
                  onClick={() => handleInitiateApply(job)}
                  style={{
                    padding: '0.65rem 1.35rem',
                    borderRadius: '10px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  📩 Ariza topshirish ➔
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Modal 1: Job Details Modal */}
      {selectedJobDetails && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '680px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  {selectedJobDetails.title}
                </h2>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981', marginTop: '0.3rem' }}>
                  {selectedJobDetails.salary}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginTop: '0.2rem' }}>
                  🏢 {selectedJobDetails.company} • 📍 {selectedJobDetails.location}
                </div>
              </div>
              <button onClick={() => setSelectedJobDetails(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div>
                <h4 style={modalSectionTitleStyle}>📋 Majburiyatlar:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                  {selectedJobDetails.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>

              <div>
                <h4 style={modalSectionTitleStyle}>🎓 Nomzodga qo'yiladigan talablar:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                  {selectedJobDetails.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>

              <div>
                <h4 style={modalSectionTitleStyle}>🎁 Kompaniya taklif qiladi:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                  {selectedJobDetails.offerings.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setSelectedJobDetails(null)} style={backBtnStyle}>Yopish</button>
              <button
                onClick={() => handleInitiateApply(selectedJobDetails)}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem' }}
              >
                📩 Ariza topshirish ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Full Candidate Registration & Login System */}
      {showAuthModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.35rem', color: '#0f172a' }}>
                👤 Nomzod Hisobi
              </h3>
              <button onClick={() => setShowAuthModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            {/* Register / Login Tab Switcher */}
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setAuthError(null) }}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: authTab === 'register' ? '#ffffff' : 'transparent',
                  color: authTab === 'register' ? '#dc2626' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: authTab === 'register' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                ⚡ Ro'yxatdan o'tish
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(null) }}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: authTab === 'login' ? '#ffffff' : 'transparent',
                  color: authTab === 'login' ? '#dc2626' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: authTab === 'login' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                🔑 Tizimga kirish
              </button>
            </div>

            {authError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', padding: '0.75rem', borderRadius: '10px', color: '#991b1b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
                ⚠️ {authError}
              </div>
            )}

            {/* Registration Form */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={filterLabelStyle}>Ismingiz *</label>
                    <input type="text" required placeholder="Ali" value={regFirstName} onChange={e => setRegFirstName(e.target.value)} style={filterInputStyle} />
                  </div>
                  <div>
                    <label style={filterLabelStyle}>Familiyangiz *</label>
                    <input type="text" required placeholder="Valiyev" value={regLastName} onChange={e => setRegLastName(e.target.value)} style={filterInputStyle} />
                  </div>
                </div>

                <div>
                  <label style={filterLabelStyle}>Telefon raqam *</label>
                  <input type="text" required placeholder="+998 90 123 45 67" value={regPhone} onChange={e => setRegPhone(e.target.value)} style={filterInputStyle} />
                </div>

                <div>
                  <label style={filterLabelStyle}>Elektron pochta (ixtiyoriy)</label>
                  <input type="email" placeholder="ali.valiyev@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={filterInputStyle} />
                </div>

                <div>
                  <label style={filterLabelStyle}>Hudud / Shahar *</label>
                  <select value={regCity} onChange={e => setRegCity(e.target.value)} style={filterInputStyle}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={filterLabelStyle}>Parol *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      required
                      placeholder="Kamida 6 belgi"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      style={filterInputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      {showPasswordText ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={filterLabelStyle}>Parolni tasdiqlang *</label>
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    required
                    placeholder="Parolni qayta kiriting"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    style={filterInputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '12px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
                    marginTop: '0.5rem'
                  }}
                >
                  {authLoading ? 'Ro\'yxatdan o\'tilmoqda...' : '⚡ Ro\'yxatdan o\'tish va Saqlash'}
                </button>
              </form>
            )}

            {/* Login Form */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={filterLabelStyle}>Telefon raqam yoki Email *</label>
                  <input
                    type="text"
                    required
                    placeholder="+998901234567 yoki email"
                    value={loginInput}
                    onChange={e => setLoginInput(e.target.value)}
                    style={filterInputStyle}
                  />
                </div>

                <div>
                  <label style={filterLabelStyle}>Parol *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      required
                      placeholder="Parolingizni kiriting"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      style={filterInputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      {showPasswordText ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '12px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
                    marginTop: '0.5rem'
                  }}
                >
                  {authLoading ? 'Kirilmoqda...' : '🔑 Tizimga kirish'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal 3: AI Assessment Warning Notice Modal */}
      {showApplyWarningModal && targetJobForApply && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '520px', padding: '2rem', border: '2px solid #ef4444' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚠️</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Ariza Topshirish va AI Sinov Ogohlantirish
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#dc2626', fontWeight: 800 }}>
                Lavozim: {targetJobForApply.title}
              </div>
            </div>

            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.25rem', color: '#991b1b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 600 }}>
              Ushbu lavozimga ariza topshirish ko'p bosqichli <strong>AI Assessment</strong> sinovidan o'tishni talab etadi.
              <br /><br />
              Rozi bo'lsangiz, quyidagi <strong>AI Assessment Sinovidan o'tish</strong> tugmasini bosing.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handleProceedToAssessment}
                disabled={applyLoading}
                style={{
                  padding: '0.9rem',
                  borderRadius: '12px',
                  backgroundColor: applyLoading ? '#9ca3af' : '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '1rem',
                  cursor: applyLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(220,38,38,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {applyLoading ? '⏳ Ariza topshirilmoqda...' : '🎯 AI Assessment Sinovidan o\'tish ➔'}
              </button>

              <button
                onClick={() => setShowApplyWarningModal(false)}
                style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontWeight: 700, cursor: 'pointer' }}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const filterLabelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem' }
const filterInputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.75rem', width: '90%' }
const modalSectionTitleStyle: React.CSSProperties = { margin: '0 0 0.4rem 0', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }
const backBtnStyle: React.CSSProperties = { padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#fff', color: '#64748b', border: '1px solid #cbd5e1', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }
