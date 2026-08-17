'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialVacancies, initialCandidates, Candidate } from '@/lib/mockHrData'

export default function VacancyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const vacancyId = resolvedParams.id

  const vacancy = initialVacancies.find(v => v.id === vacancyId) || initialVacancies[0]
  const [candidates, setCandidates] = useState<Candidate[]>(
    initialCandidates.filter(c => c.appliedVacancyId === vacancy.id || c.appliedVacancyTitle === vacancy.title)
  )

  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'pipeline' | 'analytics' | 'settings'>('pipeline')
  const [selectedCandidateStatusModal, setSelectedCandidateStatusModal] = useState<Candidate | null>(null)

  const pipelineStages = [
    { id: 'new', title: 'YANGI', color: '#3b82f6' },
    { id: 'screening', title: 'SCREENING', color: '#f59e0b' },
    { id: 'interview', title: 'INTERVIEW', color: '#8b5cf6' },
    { id: 'tech_interview', title: 'TECH INTERVIEW', color: '#06b6d4' },
    { id: 'offer', title: 'OFFER', color: '#10b981' },
    { id: 'hired', title: 'HIRED', color: '#16a34a' },
    { id: 'rejected', title: 'RAD ETILGAN', color: '#ef4444' },
  ]

  const moveCandidateStatus = (candidateId: string, newStatus: any) => {
    setCandidates(candidates.map(c => c.id === candidateId ? { ...c, status: newStatus } : c))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {vacancy.title}
            </h1>
            <span style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: vacancy.status === 'active' ? '#dcfce7' : '#f1f5f9',
              color: vacancy.status === 'active' ? '#15803d' : '#64748b',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              🟢 {vacancy.status.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', gap: '1.25rem' }}>
            <span>📍 {vacancy.location}</span>
            <span>💰 {vacancy.minSalary && vacancy.maxSalary ? `${(vacancy.minSalary / 1000000).toFixed(0)}–${(vacancy.maxSalary / 1000000).toFixed(0)} mln so‘m` : 'Kelishilgan'}</span>
            <span>👤 Menejer: {vacancy.manager}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href={`/hr/vacancies/create?editId=${vacancy.id}`}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              color: '#1e293b',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}
          >
            ✏️ Tahrirlash
          </Link>
          <button
            onClick={() => alert('Vakansiya qoralama holatga o\'tkazildi.')}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fde68a',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            ⏸ To‘xtatish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0' }}>
        {[
          { id: 'pipeline', label: 'Nomzodlar Pipeline' },
          { id: 'applications', label: `Arizalar (${candidates.length})` },
          { id: 'overview', label: 'Umumiy ma\'lumot' },
          { id: 'analytics', label: 'Statistika' },
          { id: 'settings', label: 'Sozlamalar' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === tab.id ? '#2563eb' : '#64748b',
              fontWeight: activeTab === tab.id ? 700 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PIPELINE KANBAN VIEW */}
      {activeTab === 'pipeline' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          alignItems: 'start',
          overflowX: 'auto',
          paddingBottom: '1rem'
        }}>
          {pipelineStages.map(stage => {
            const stageCandidates = candidates.filter(c => c.status === stage.id)
            return (
              <div
                key={stage.id}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  minHeight: '400px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.5rem',
                  borderBottom: `2px solid ${stage.color}`
                }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: stage.color }}>
                    {stage.title}
                  </span>
                  <span style={{
                    backgroundColor: '#ffffff',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64748b',
                    border: '1px solid #cbd5e1'
                  }}>
                    {stageCandidates.length}
                  </span>
                </div>

                {stageCandidates.map(c => (
                  <div
                    key={c.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      padding: '1rem',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span
                        onClick={() => router.push(`/hr/candidates/${c.id}`)}
                        style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', cursor: 'pointer' }}
                      >
                        👤 {c.name}
                      </span>
                      <span style={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.4rem',
                        borderRadius: '6px'
                      }}>
                        ⭐ {c.matchRate}%
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      📍 {c.location} • 💼 {c.experienceCategory}
                    </div>

                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {c.skills.slice(0, 3).map(s => (
                        <span key={s} style={{ backgroundColor: '#f1f5f9', fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', color: '#334155' }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                      <button
                        onClick={() => router.push(`/hr/candidates/${c.id}`)}
                        style={cardActionBtnStyle}
                      >
                        Rezyume
                      </button>
                      <button
                        onClick={() => router.push('/hr/messages')}
                        style={cardActionBtnStyle}
                      >
                        Xabar
                      </button>
                      <button
                        onClick={() => router.push('/hr/interviews')}
                        style={cardActionBtnStyle}
                      >
                        Intervyu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>Vazifalar:</h3>
            <p>{vacancy.responsibilities}</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>Talablar:</h3>
            <p>{vacancy.requirements}</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>Imtiyozlar:</h3>
            <p>{vacancy.offerings}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const cardActionBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.35rem 0.2rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#2563eb',
  cursor: 'pointer'
}
