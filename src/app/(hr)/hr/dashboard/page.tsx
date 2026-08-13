'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HRDashboard() {
  const { t } = useLanguage()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/hr/dashboard')
      .then(res => res.json())
      .then(json => {
        setData(json.data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (!data) return <div style={{ padding: '2rem', color: 'red' }}>Failed to load dashboard</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {t.dashboardNav}
        </h1>
        <Link
          href="/hr/vacancies"
          style={{
            padding: '0.6rem 1.25rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            textDecoration: 'none'
          }}
        >
          {t.vacanciesNav}
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>{t.activeVacancies}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{data.activeVacancies}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>{t.totalCandidates}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{data.totalApplications}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>{t.assessmentsCompleted}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{data.assessmentsCompleted}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>{t.pendingReview}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>{data.pendingReview}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>{t.shortlisted}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>{data.shortlisted}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>{t.avgScore}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>{Math.round(data.averageScore)}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{t.recentCandidates}</h2>
      {data.recentCandidates.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
          No candidates have completed assessments yet.
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.candidateName}</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Vakansiya</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.candidateScore}</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.recentCandidates.map((c: any) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{c.candidate.firstName} {c.candidate.lastName}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>{c.job.title}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: '#2563eb' }}>{Math.round(c.totalScore)}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <Link href={`/hr/candidates/${c.candidate.id}`} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                      {t.actionView} &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
