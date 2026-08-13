'use client'

import React, { useEffect, useState, use } from 'react'
import { ScoreBadge } from '@/components/hr/ScoreBadge'
import { AISummaryCard } from '@/components/hr/AISummaryCard'
import { StageEvaluationPanel } from '@/components/hr/StageEvaluationPanel'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const candidateId = unwrappedParams.id
  const { t } = useLanguage()

  const [candidate, setCandidate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchCandidate = () => {
    fetch(`/api/hr/candidates/${candidateId}`)
      .then(res => res.json())
      .then(json => {
        setCandidate(json.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCandidate()
  }, [candidateId])

  const handleUpdateStatus = async (newStatus: string) => {
    if (!candidate || updating) return
    setUpdating(true)
    const appId = candidate.applications[0]?.id

    await fetch(`/api/hr/candidates/${candidateId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: appId, status: newStatus })
    })

    await fetchCandidate()
    setUpdating(false)
  }

  const handleViewCV = async () => {
    try {
      const res = await fetch(`/api/hr/candidates/${candidateId}/files`)
      const json = await res.json()
      if (json.data?.url) {
        window.open(json.data.url, '_blank')
      } else {
        alert('CV not found')
      }
    } catch (e) {
      alert('Failed to load CV')
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading candidate...</div>
  if (!candidate) return <div style={{ padding: '2rem', color: 'red' }}>Candidate not found</div>

  const latestAssessment = candidate.assessments[0]
  const result = latestAssessment?.results[0] || {}
  const application = candidate.applications[0]

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            {candidate.firstName} {candidate.lastName}
          </h1>
          <div style={{ color: '#64748b', display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
            <span>{candidate.email}</span>
            <span>•</span>
            <span>{candidate.phone}</span>
            <span>•</span>
            <span style={{ fontWeight: 600, color: '#2563eb', cursor: 'pointer' }} onClick={handleViewCV}>
              {t.viewCVBtn}
            </span>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
            {t.finalScoreLabel}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            {result.totalScore ? Math.round(result.totalScore) : 'Pending'} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 400 }}>/ 100</span>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <h3 style={{ fontWeight: 700, color: '#334155', margin: 0 }}>{t.hrDecisionLabel}:</h3>
        <select
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.9rem' }}
          value={application?.status}
          onChange={(e) => handleUpdateStatus(e.target.value)}
          disabled={updating}
        >
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="HIRED">Hired</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>
        {updating && <span style={{ fontSize: '0.85rem', color: '#2563eb' }}>{t.saving}</span>}
      </div>

      {result.aiFeedback?.summary && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem 0' }}>
              {t.aiRecommendationLabel}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: result.recommendation === 'ADVANCE' ? '#15803d' : result.recommendation === 'REJECT' ? '#b91c1c' : '#b45309'
              }}>
                {result.recommendation || 'PENDING'}
              </span>
              <p style={{ color: '#1e3a8a', fontSize: '0.875rem', margin: 0 }}>
                <strong>Note:</strong> AI recommendation is an assessment aid based on candidate performance. Final hiring decisions remain with HR.
              </p>
            </div>
          </div>
          <AISummaryCard
            summary={result.aiFeedback.summary}
            strengths={result.aiFeedback.strengths || []}
            weaknesses={result.aiFeedback.weaknesses || []}
            confidence={95}
          />
        </div>
      )}

      {latestAssessment?.stages && (
        <StageEvaluationPanel stages={latestAssessment.stages} />
      )}
    </div>
  )
}
