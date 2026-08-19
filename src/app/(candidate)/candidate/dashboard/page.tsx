'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialVacancies } from '@/lib/mockHrData'
import { useCurrentCandidate } from '@/lib/candidate/useCurrentCandidate'

export default function CandidateDashboardPage() {
  const router = useRouter()
  const { candidate } = useCurrentCandidate()

  const stats = [
    { label: 'Yuborilgan arizalar', count: 8, icon: '📨', color: '#2563eb', bg: '#eff6ff', link: '/candidate/applications' },
    { label: 'Ko‘rib chiqilmoqda', count: 3, icon: '👁', color: '#d97706', bg: '#fffbeb', link: '/candidate/applications?status=screening' },
    { label: 'Intervyular', count: 2, icon: '📅', color: '#7c3aed', bg: '#f5f3ff', link: '/candidate/interviews' },
    { label: 'Saqlangan vakansiyalar', count: 12, icon: '⭐', color: '#059669', bg: '#ecfdf5', link: '/candidate/favorites' },
  ]

  const matchedJobs = [
    { ...initialVacancies[0], matchRate: 94 },
    { ...initialVacancies[1], matchRate: 89 },
    { ...initialVacancies[2], matchRate: 84 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Top Greeting Banner */}
      <div className="dashboard-greeting" style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: 0, overflowWrap: 'anywhere' }}>
            Salom, {candidate?.firstName || 'Nomzod'} 👋
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '1rem', lineHeight: 1.5 }}>
            Sizning ko'nikmalaringizga mos keladigan <strong>5 ta yangi vakansiya</strong> mavjud.
          </p>
        </div>

        <Link
          href="/candidate/jobs"
          className="dashboard-primary-link"
          style={{
            padding: '0.8rem 1.6rem',
            backgroundColor: '#10b981',
            color: '#ffffff',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.95rem',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>🔎</span> Ish qidirish
        </Link>
      </div>

      {/* 2. Statistical Metrics Cards */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          Mening ko'rsatkichlarim
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              onClick={() => router.push(stat.link)}
              style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              className="card-hover-effect"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{stat.icon}</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: stat.color,
                  backgroundColor: stat.bg,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px'
                }}>
                  Batafsil ➔
                </span>
              </div>
              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
                  {stat.count}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', marginTop: '0.35rem' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. "Sizga mos vakansiyalar" Widget */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎯 Sizga mos vakansiyalar (Matching Engine)
          </h2>
          <Link href="/candidate/jobs" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981', textDecoration: 'none' }}>
            Barchasini ko‘rish ➔
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {matchedJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/candidate/jobs/${job.id}`)}
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                transition: 'all 0.2s ease'
              }}
              className="card-hover-effect"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a', lineHeight: 1.3 }}>
                    {job.title}
                  </div>
                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '9999px',
                    whiteSpace: 'nowrap'
                  }}>
                    ⭐ {job.matchRate}% mos
                  </span>
                </div>

                <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 700 }}>
                  🏢 TechCompany LLC
                </div>

                <div style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 900, margin: '0.5rem 0' }}>
                  {job.minSalary && job.maxSalary ? `${(job.minSalary / 1000000).toFixed(0)} – ${(job.maxSalary / 1000000).toFixed(0)} mln so‘m` : 'Maosh kelishilgan'}
                </div>

                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '0.75rem' }}>
                  <span>📍 {job.location}</span>
                  <span>🏠 {job.workType}</span>
                </div>
              </div>

              <button
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Vakansiyani ko'rish ➔
              </button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .dashboard-greeting {
            padding: 1.25rem !important;
            align-items: stretch !important;
          }

          .dashboard-primary-link {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
