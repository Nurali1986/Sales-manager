'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function CandidatesPage() {
  const { t } = useLanguage()
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score')

  useEffect(() => {
    fetch('/api/hr/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.data?.recentCandidates) {
          setCandidates(json.data.recentCandidates)
        }
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  const filtered = candidates.filter(c => {
    if (statusFilter === 'ALL') return true
    return c.application?.status === statusFilter
  }).sort((a, b) => {
    if (sortBy === 'score') {
      return (b.totalScore || 0) - (a.totalScore || 0)
    }
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {t.candidatesTitle}
        </h1>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <option value="ALL">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="HIRED">Hired</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <option value="score">{t.sortByScore}</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '3rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
          No candidates found.
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>#</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.candidateName}</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.candidatePhone}</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Vakansiya</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.candidateScore}</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any, index: number) => (
                <tr key={c.id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#94a3b8' }}>#{index + 1}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{c.candidate.firstName} {c.candidate.lastName}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>{c.candidate.phone}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>{c.job.title}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: '#2563eb', fontSize: '1.1rem' }}>{Math.round(c.totalScore || 0)} / 100</td>
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
