'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DashboardVacancy {
  id: string
  title: string
  status: string
  totalApplications: number
  completedAssessments: number
  shortlisted: number
  averageScore: number | null
  createdAt: string
}

interface DashboardStats {
  totalVacancies: number
  activeVacancies: number
  draftVacancies: number
  totalApplications: number
  completedAssessments: number
  shortlisted: number
}

export default function HRDashboardPage() {
  const router = useRouter()
  const [vacancies, setVacancies] = useState<DashboardVacancy[]>([])
  const [dbStats, setDbStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetch('/api/hr/vacancies')
      .then(res => res.json())
      .then(res => {
        const data: DashboardVacancy[] = res.data || []
        setVacancies(data)
        const active = data.filter(v => v.status === 'ACTIVE')
        const drafts = data.filter(v => v.status === 'DRAFT')
        const totalApps = data.reduce((acc, v) => acc + (v.totalApplications || 0), 0)
        const completed = data.reduce((acc, v) => acc + (v.completedAssessments || 0), 0)
        const shortlisted = data.reduce((acc, v) => acc + (v.shortlisted || 0), 0)
        setDbStats({
          totalVacancies: data.length,
          activeVacancies: active.length,
          draftVacancies: drafts.length,
          totalApplications: totalApps,
          completedAssessments: completed,
          shortlisted,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = dbStats ? [
    { label: 'Faol vakansiyalar', count: dbStats.activeVacancies, color: '#2563eb', bg: '#eff6ff', link: '/hr/vacancies' },
    { label: 'Jami arizalar', count: dbStats.totalApplications, color: '#dc2626', bg: '#fef2f2', link: '/hr/candidates' },
    { label: 'Baholangan', count: dbStats.completedAssessments, color: '#d97706', bg: '#fffbeb', link: '/hr/candidates' },
    { label: 'Moderatsiyada', count: dbStats.draftVacancies, color: '#7c3aed', bg: '#f5f3ff', link: '/hr/vacancies' },
    { label: 'Shortlist', count: dbStats.shortlisted, color: '#0284c7', bg: '#f0f9ff', link: '/hr/candidates' },
    { label: 'Jami vakansiya', count: dbStats.totalVacancies, color: '#16a34a', bg: '#f0fdf4', link: '/hr/vacancies' },
  ] : []

  const activeVacancies = vacancies.filter(v => v.status === 'ACTIVE')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.25rem' : '2rem' }}>
      {/* Header & Actions */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '1rem' : '0',
        backgroundColor: '#ffffff',
        padding: isMobile ? '1.25rem' : '1.5rem 2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.35rem' : '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            HR Dashboard 👋
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: isMobile ? '0.85rem' : '0.95rem' }}>
            Faqat bazadagi real ma'lumotlar ko'rsatiladi.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            href="/hr/vacancies/create"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', padding: '0.65rem 1rem',
              backgroundColor: '#2563eb', color: '#ffffff',
              borderRadius: '10px', fontWeight: 700,
              fontSize: '0.85rem', textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              flex: isMobile ? '1' : 'none',
            }}
          >
            ➕ Vakansiya yaratish
          </Link>
          <Link
            href="/hr/candidates"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', padding: '0.65rem 1rem',
              backgroundColor: '#f1f5f9', color: '#1e293b',
              borderRadius: '10px', fontWeight: 700,
              fontSize: '0.85rem', textDecoration: 'none',
              border: '1px solid #cbd5e1',
              flex: isMobile ? '1' : 'none',
            }}
          >
            👥 Nomzodlar
          </Link>
        </div>
      </div>

      {/* Statistical Cards */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
          Asosiy ko'rsatkichlar (DB)
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>⏳ Yuklanmoqda...</div>
        ) : stats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            📭 Hali vakansiya yaratilmagan.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: isMobile ? '0.75rem' : '1.25rem',
          }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                onClick={() => router.push(stat.link)}
                style={{
                  backgroundColor: '#ffffff',
                  padding: isMobile ? '1rem' : '1.25rem',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 900, color: stat.color }}>
                  {stat.count}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Vacancies Widget */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: isMobile ? '1rem' : '1.5rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Faol vakansiyalar
          </h2>
          <Link href="/hr/vacancies" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>
            Barchasi ➔
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>⏳ Yuklanmoqda...</div>
        ) : activeVacancies.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '2rem', color: '#64748b',
            backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'
          }}>
            📭 Faol vakansiyalar yo'q.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {activeVacancies.map((vac) => (
              <div
                key={vac.id}
                onClick={() => router.push(`/hr/vacancies/${vac.id}`)}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: isMobile ? '1rem' : '1.25rem',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: isMobile ? '0.9rem' : '1rem', color: '#0f172a' }}>{vac.title}</div>
                  <span style={{
                    padding: '0.2rem 0.5rem', borderRadius: '6px',
                    backgroundColor: '#dcfce7', color: '#15803d',
                    fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    🟢 Faol
                  </span>
                </div>
                <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap' }}>
                  <div>📩 <strong>{vac.totalApplications}</strong></div>
                  <div>✅ <strong>{vac.completedAssessments}</strong></div>
                  {vac.averageScore !== null && <div>⭐ <strong>{vac.averageScore.toFixed(0)}%</strong></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
