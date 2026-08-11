'use client'

import React, { useEffect, useState, use } from 'react'
import { ScoreBadge } from '@/components/hr/ScoreBadge'
import { AISummaryCard } from '@/components/hr/AISummaryCard'
import { StageEvaluationPanel } from '@/components/hr/StageEvaluationPanel'

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const candidateId = unwrappedParams.id
  
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

  if (loading) return <div className="p-8 text-center">Loading candidate...</div>
  if (!candidate) return <div className="p-8 text-center text-red-500">Candidate not found</div>

  const latestAssessment = candidate.assessments[0]
  const result = latestAssessment?.results[0] || {}
  const application = candidate.applications[0]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {candidate.firstName} {candidate.lastName}
          </h1>
          <div className="text-gray-500 flex gap-4 text-sm">
            <span>{candidate.email}</span>
            <span>•</span>
            <span>{candidate.phone}</span>
            <span>•</span>
            <span className="font-medium text-blue-600 cursor-pointer hover:underline" onClick={handleViewCV}>
              View CV
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col items-end">
          <div className="text-sm text-gray-500 uppercase font-medium mb-1">Final Score</div>
          <div className="text-3xl font-bold text-gray-900">
            {result.totalScore ? Math.round(result.totalScore) : 'Pending'} <span className="text-lg text-gray-400 font-normal">/ 100</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-8 flex gap-4 items-center">
        <h3 className="font-semibold text-gray-700">HR Decision:</h3>
        <select 
          className="border rounded px-4 py-2 font-medium"
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
        {updating && <span className="text-sm text-blue-500">Updating...</span>}
      </div>

      {result.aiFeedback?.summary && (
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
            <h3 className="font-bold text-blue-900 mb-2 uppercase text-sm tracking-wide">AI Recommendation</h3>
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-black ${
                result.recommendation === 'ADVANCE' ? 'text-green-700' :
                result.recommendation === 'REJECT' ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {result.recommendation || 'PENDING'}
              </span>
              <p className="text-blue-800 text-sm">
                <strong>Disclaimer:</strong> AI recommendation is an assessment aid based purely on the candidate's practical test performance. Final hiring decisions are always made by HR.
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
