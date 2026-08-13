'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function VacanciesPage() {
  const { t } = useLanguage()
  const [vacancies, setVacancies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/hr/vacancies')
      .then(res => res.json())
      .then(json => {
        setVacancies(json.data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '2rem' }}>Loading vacancies...</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {t.vacanciesNav}
        </h1>
        <Link
          href="/hr/vacancies/new"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            textDecoration: 'none'
          }}
        >
          + Create Vacancy
        </Link>
      </div>

      {vacancies.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
          No vacancies found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {vacancies.map(v => (
            <div key={v.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Link href={`/hr/vacancies/${v.id}/candidates`} style={{ flex: 1, textDecoration: 'none' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>{v.title}</h2>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{v.status}</span>
                    <span>Created: {new Date(v.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
              <div style={{ display: 'flex', gap: '2rem', textAlign: 'center', alignItems: 'center' }}>
                <Link href={`/hr/vacancies/${v.id}/candidates`} style={{ display: 'flex', gap: '2rem', textDecoration: 'none', color: 'inherit' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{v.totalApplications}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Applications</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{v.completedAssessments}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Completed</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{v.shortlisted}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Shortlisted</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{v.averageScore ? Math.round(v.averageScore) : '-'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Avg Score</div>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    navigator.clipboard.writeText(`${window.location.origin}/assessment/demo-assessment-token-123`)
                    alert('Assessment link copied!')
                  }}
                  style={{
                    marginLeft: '1rem',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
