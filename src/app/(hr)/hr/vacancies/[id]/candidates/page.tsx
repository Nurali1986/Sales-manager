'use client'

import React, { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { RankingTable } from '@/components/hr/RankingTable'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function CandidatesRankingPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const jobId = unwrappedParams.id
  const router = useRouter()
  const { t } = useLanguage()

  const [candidates, setCandidates] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [search, setSearch] = useState('')
  const [minScore, setMinScore] = useState('')
  const [status, setStatus] = useState('')
  const [assessmentStatus, setAssessmentStatus] = useState('')
  const [recommendation, setRecommendation] = useState('')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetch(`/api/hr/vacancies/${jobId}/stats`)
      .then(res => res.json())
      .then(json => {
        if (json.data) setStats(json.data)
      })
  }, [jobId])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const query = new URLSearchParams()
      if (search) query.append('search', search)
      if (minScore) query.append('minScore', minScore)
      if (status) query.append('status', status)
      if (assessmentStatus) query.append('assessmentStatus', assessmentStatus)
      if (recommendation) query.append('recommendation', recommendation)
      query.append('page', page.toString())
      query.append('pageSize', pageSize.toString())

      const res = await fetch(`/api/hr/vacancies/${jobId}/candidates?${query.toString()}`)
      const json = await res.json()
      if (mounted) {
        setCandidates(json.data?.candidates || [])
        setTotalCount(json.data?.totalCount || 0)
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [jobId, search, minScore, status, assessmentStatus, recommendation, page, pageSize])

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) setSelectedIds(prev => [...prev, id])
    else setSelectedIds(prev => prev.filter(x => x !== id))
  }

  const handleBulkShortlist = async () => {
    if (!selectedIds.length) return
    if (!confirm(`Shortlist ${selectedIds.length} candidates?`)) return

    await fetch('/api/hr/candidates/bulk-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationIds: selectedIds, status: 'SHORTLISTED' })
    })

    setSelectedIds([])
    window.location.reload()
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {t.candidatesTitle}
        </h1>
        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkShortlist}
            style={{ padding: '0.6rem 1.25rem', backgroundColor: '#16a34a', color: '#ffffff', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Shortlist Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Applications</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>{stats.funnel.applications}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Completed</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>{stats.funnel.completed}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Evaluated</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>{stats.funnel.evaluated}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search candidates..."
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', flex: 1, minWidth: '200px' }}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} value={minScore} onChange={e => { setMinScore(e.target.value); setPage(1); }}>
          <option value="">All Scores</option>
          <option value="90">90+ (Top Tier)</option>
          <option value="80">80+ (Strong)</option>
          <option value="70">70+ (Average)</option>
        </select>
        <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} value={recommendation} onChange={e => { setRecommendation(e.target.value); setPage(1); }}>
          <option value="">AI Recommendation</option>
          <option value="ADVANCE">Advance</option>
          <option value="REVIEW">Review</option>
          <option value="REJECT">Reject</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading candidates...</div>
      ) : (
        <>
          <RankingTable
            candidates={candidates}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onRowClick={(cId) => router.push(`/hr/candidates/${cId}`)}
          />
        </>
      )}
    </div>
  )
}
