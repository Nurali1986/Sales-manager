'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DbCandidate {
  id: string
  name: string
  email: string
  phone: string
  city: string
  title: string
  applicationStatus: string
  assessmentStatus: string | null
  totalScore: number | null
  recommendation: string | null
  cvScore: number | null
  testScore: number | null
  liveSalesScore: number | null
  strengths: string | null
  weaknesses: string | null
  hasAssessment: boolean
  hasResult: boolean
  createdAt: string
}

export default function CandidatesPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<DbCandidate[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetch('/api/hr/candidates')
      .then(res => res.json())
      .then(res => {
        if (res.data?.candidates) setCandidates(res.data.candidates)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredCandidates = candidates.filter((c) => {
    if (statusFilter !== 'all' && c.applicationStatus !== statusFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      'APPLIED': { bg: '#eff6ff', color: '#2563eb', label: 'Ariza' },
      'IN_PROGRESS': { bg: '#fffbeb', color: '#b45309', label: 'Sinovda' },
      'COMPLETED': { bg: '#dcfce7', color: '#15803d', label: 'Baholangan' },
      'UNDER_REVIEW': { bg: '#f5f3ff', color: '#7c3aed', label: 'Ko\'rib chiqish' },
      'SHORTLISTED': { bg: '#ecfdf5', color: '#059669', label: 'Shortlist' },
      'INTERVIEW': { bg: '#fef3c7', color: '#d97706', label: 'Intervyu' },
      'OFFER': { bg: '#f0f9ff', color: '#0284c7', label: 'Taklif' },
      'REJECTED': { bg: '#fef2f2', color: '#dc2626', label: 'Rad etildi' },
      'HIRED': { bg: '#dcfce7', color: '#16a34a', label: 'Ishga qabul' },
      'WITHDRAWN': { bg: '#f1f5f9', color: '#64748b', label: 'Chiqib ketdi' },
    }
    const s = map[status] || { bg: '#f1f5f9', color: '#64748b', label: status }
    return (
      <span style={{ backgroundColor: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
        {s.label}
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          👥 Nomzodlar
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
          Bazadagi barcha ro'yxatdan o'tgan nomzodlar.
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: isMobile ? '0.75rem' : '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '0.5rem' : '1rem',
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input
            type="text"
            placeholder="Nomzod ismi..."
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.55rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.85rem',
            backgroundColor: '#ffffff'
          }}
        >
          <option value="all">Barchasi</option>
          <option value="APPLIED">Ariza</option>
          <option value="IN_PROGRESS">Sinovda</option>
          <option value="COMPLETED">Baholangan</option>
          <option value="SHORTLISTED">Shortlist</option>
          <option value="INTERVIEW">Intervyu</option>
          <option value="OFFER">Taklif</option>
          <option value="HIRED">Ishga qabul</option>
          <option value="REJECTED">Rad etildi</option>
        </select>
      </div>

      {/* Loading / Empty / Cards */}
      {loading ? (
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '14px', padding: '2.5rem',
          textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b'
        }}>
          ⏳ Nomzodlar yuklanmoqda...
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '14px', padding: '2.5rem',
          textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.9rem',
        }}>
          📭 {candidates.length === 0
            ? 'Hali nomzodlar yo\'q. Portaldan ariza topshirilganda ko\'rinadi.'
            : 'Bu filterda nomzod topilmadi.'}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: isMobile ? '0.75rem' : '1.25rem',
        }}>
          {filteredCandidates.map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: isMobile ? '1rem' : '1.35rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
            >
              {/* Name & Score */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '0.5rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: isMobile ? '1rem' : '1.15rem', color: '#0f172a' }}>
                      👤 {c.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 800, marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.title}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
                    {statusBadge(c.applicationStatus)}
                    {c.totalScore !== null && (
                      <span style={{
                        backgroundColor: c.totalScore >= 80 ? '#dcfce7' : c.totalScore >= 60 ? '#fef3c7' : '#fef2f2',
                        color: c.totalScore >= 80 ? '#15803d' : c.totalScore >= 60 ? '#d97706' : '#dc2626',
                        fontSize: '0.8rem', fontWeight: 900,
                        padding: '0.2rem 0.5rem', borderRadius: '6px'
                      }}>
                        ⭐ {c.totalScore}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  📞 {c.phone}
                  {c.email && !isMobile && <span> • 📧 {c.email}</span>}
                  {c.city && <span> • 📍 {c.city}</span>}
                </div>

                {/* AI Results */}
                {c.hasResult ? (
                  <div style={{
                    backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: '10px', padding: '0.65rem',
                    fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem'
                  }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>🎯 AI Natija:</div>
                    {c.recommendation && (
                      <div style={{ color: c.recommendation === 'ADVANCE' ? '#059669' : '#d97706', fontWeight: 700 }}>
                        {c.recommendation === 'ADVANCE' ? '✅ Suhbatga taklif' : c.recommendation}
                      </div>
                    )}
                    <div style={{ color: '#475569', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {c.cvScore !== null && <span>CV: {c.cvScore}/100</span>}
                      {c.testScore !== null && <span>Test: {c.testScore}/15</span>}
                      {c.liveSalesScore !== null && <span>Call: {c.liveSalesScore}/30</span>}
                    </div>
                  </div>
                ) : c.hasAssessment ? (
                  <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.65rem', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: '#b45309' }}>
                      ⏳ {c.assessmentStatus === 'IN_PROGRESS' ? 'Sinov davom etmoqda' : c.assessmentStatus === 'NOT_STARTED' ? 'Boshlanmagan' : c.assessmentStatus}
                    </span>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.65rem', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: '#64748b' }}>📝 Assessment tayinlanmagan</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  📅 {new Date(c.createdAt).toLocaleDateString('uz')}
                </div>
                <Link
                  href={`/hr/candidates/${c.id}`}
                  style={{
                    padding: '0.35rem 0.65rem', backgroundColor: '#eff6ff',
                    color: '#2563eb', borderRadius: '6px',
                    fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none'
                  }}
                >
                  Tafsilotlar ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
