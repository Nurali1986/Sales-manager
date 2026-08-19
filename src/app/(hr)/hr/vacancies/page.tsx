'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DbVacancy {
  id: string
  title: string
  status: string
  totalApplications: number
  completedAssessments: number
  shortlisted: number
  averageScore: number | null
  createdAt: string
}

type TabId = 'ACTIVE' | 'DRAFT' | 'PAUSED' | 'CLOSED'

export default function VacanciesPage() {
  const router = useRouter()
  const [vacancies, setVacancies] = useState<DbVacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('ACTIVE')
  const [search, setSearch] = useState('')
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
      .then(res => setVacancies(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const tabs: { id: TabId; label: string; shortLabel: string; count: number }[] = [
    { id: 'ACTIVE', label: '🟢 Faol', shortLabel: '🟢', count: vacancies.filter(v => v.status === 'ACTIVE').length },
    { id: 'DRAFT', label: '📝 Moderatsiya', shortLabel: '📝', count: vacancies.filter(v => v.status === 'DRAFT').length },
    { id: 'PAUSED', label: '⏸ To\'xtatilgan', shortLabel: '⏸', count: vacancies.filter(v => v.status === 'PAUSED').length },
    { id: 'CLOSED', label: '🔒 Yopilgan', shortLabel: '🔒', count: vacancies.filter(v => v.status === 'CLOSED').length },
  ]

  const filteredVacancies = vacancies.filter((v) => {
    if (v.status !== activeTab) return false
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '0.75rem' : '0',
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.35rem' : '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Vakansiyalar
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
            Bazadagi barcha vakansiyalar.
          </p>
        </div>
        <Link
          href="/hr/vacancies/create"
          style={{
            padding: '0.65rem 1rem',
            backgroundColor: '#2563eb', color: '#ffffff',
            borderRadius: '10px', fontWeight: 700,
            fontSize: '0.85rem', textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            textAlign: 'center',
          }}
        >
          + Yangi vakansiya
        </Link>
      </div>

      {/* Search */}
      <div style={{
        backgroundColor: '#ffffff', padding: '0.75rem 1rem',
        borderRadius: '12px', border: '1px solid #e2e8f0',
      }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input
            type="text"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: isMobile ? '0.25rem' : '0.5rem',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0.25rem',
        overflowX: 'auto',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: isMobile ? '0.5rem 0.6rem' : '0.65rem 1.25rem',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
                color: isActive ? '#2563eb' : '#64748b',
                fontWeight: isActive ? 700 : 600,
                fontSize: isMobile ? '0.75rem' : '0.9rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              {isMobile ? tab.shortLabel : tab.label}
              <span style={{
                backgroundColor: isActive ? '#eff6ff' : '#f1f5f9',
                color: isActive ? '#2563eb' : '#64748b',
                padding: '0.1rem 0.4rem',
                borderRadius: '9999px',
                fontSize: '0.7rem', fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* List */}
      {loading ? (
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '14px', padding: '3rem',
          textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b'
        }}>
          ⏳ Yuklanmoqda...
        </div>
      ) : filteredVacancies.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '14px', padding: '2rem',
          textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b',
          fontSize: '0.9rem',
        }}>
          📭 Vakansiyalar topilmadi.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredVacancies.map((v) => (
            <div
              key={v.id}
              onClick={() => router.push(`/hr/vacancies/${v.id}`)}
              style={{
                backgroundColor: '#ffffff',
                padding: isMobile ? '1rem' : '1.25rem 1.5rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? '0.75rem' : '0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: isMobile ? '0.95rem' : '1.1rem', color: '#0f172a' }}>{v.title}</span>
                  <span style={{
                    fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '6px',
                    backgroundColor: v.status === 'ACTIVE' ? '#dcfce7' : v.status === 'DRAFT' ? '#fffbeb' : '#f1f5f9',
                    color: v.status === 'ACTIVE' ? '#15803d' : v.status === 'DRAFT' ? '#b45309' : '#64748b',
                    fontWeight: 700
                  }}>
                    {v.status === 'ACTIVE' ? 'Faol' : v.status === 'DRAFT' ? 'Moderatsiya' : v.status === 'PAUSED' ? 'To\'xtatilgan' : 'Yopilgan'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>📅 {new Date(v.createdAt).toLocaleDateString('uz')}</div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center',
                gap: isMobile ? '0.75rem' : '1.5rem',
                justifyContent: isMobile ? 'space-between' : 'flex-end',
              }}>
                <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', fontSize: '0.8rem', color: '#475569' }}>
                  <div>📩 <strong>{v.totalApplications}</strong></div>
                  <div>✅ <strong>{v.completedAssessments}</strong></div>
                  {v.averageScore !== null && <div>⭐ <strong>{v.averageScore.toFixed(0)}%</strong></div>}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/hr/vacancies/${v.id}`) }}
                  style={{
                    padding: '0.4rem 0.75rem', borderRadius: '8px',
                    backgroundColor: '#eff6ff', color: '#2563eb',
                    fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Ochish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
