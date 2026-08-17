'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialVacancies } from '@/lib/mockHrData'

export default function CandidateDashboardPage() {
  const router = useRouter()

  const stats = [
    { label: 'Yuborilgan arizalar', count: 8, icon: '📨', color: '#2563eb', bg: '#eff6ff', link: '/candidate/applications' },
    { label: 'Ko‘rib chiqilmoqda', count: 3, icon: '👁', color: '#d97706', bg: '#fffbeb', link: '/candidate/applications?status=screening' },
    { label: 'Intervyular', count: 2, icon: '📅', color: '#7c3aed', bg: '#f5f3ff', link: '/candidate/interviews' },
    { label: 'Saqlangan vakansiya', count: 12, icon: '⭐', color: '#059669', bg: '#ecfdf5', link: '/candidate/favorites' },
  ]

  const matchedJobs = [
    { ...initialVacancies[0], matchRate: 94 },
    { ...initialVacancies[1], matchRate: 89 },
    { ...initialVacancies[2], matchRate: 84 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Top Greeting Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem 2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Salom, Elbek 👋
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Siz uchun mos keladigan 5 ta yangi vakansiya topdik.
          </p>
        </div>

        <Link
          href="/candidate/jobs"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
          }}
        >
          🔎 Ish qidirish
        </Link>
      </div>

      {/* 2. Statistical Cards */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
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
                padding: '1.25rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease'
              }}
              className="card-hover-effect"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: stat.color,
                  backgroundColor: stat.bg,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px'
                }}>
                  Batafsil ➔
                </span>
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a' }}>
                {stat.count}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginTop: '0.2rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. "Sizga mos vakansiyalar" Widget */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎯 Sizga mos vakansiyalar (Matching Engine)
          </h2>
          <Link href="/candidate/jobs" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981', textDecoration: 'none' }}>
            [ Barchasini ko‘rish ]
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {matchedJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/candidate/jobs/${job.id}`)}
              style={{
                backgroundColor: '#fafafa',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{job.title}</div>
                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px'
                  }}>
                    ⭐ {job.matchRate}% mos
                  </span>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Tech Company LLC</div>
                <div style={{ color: '#059669', fontSize: '0.9rem', fontWeight: 800, margin: '0.4rem 0' }}>
                  {job.minSalary && job.maxSalary ? `${(job.minSalary / 1000000).toFixed(0)}–${(job.maxSalary / 1000000).toFixed(0)} mln so‘m` : 'Maosh kelishilgan'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  📍 {job.location} • 🏠 {job.workType}
                </div>
              </div>

              <button
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Vakansiyani ko'rish →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
