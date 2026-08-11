'use client'

import React, { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { RankingTable } from '@/components/hr/RankingTable'

export default function CandidatesRankingPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const jobId = unwrappedParams.id
  const router = useRouter()
  
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
    <div className="p-8 max-w-[90rem] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Candidate Ranking</h1>
        {selectedIds.length > 0 && (
          <button 
            onClick={handleBulkShortlist}
            className="px-4 py-2 bg-green-600 text-white rounded font-medium shadow-sm hover:bg-green-700"
          >
            Shortlist Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center text-center">
            <div className="text-sm font-medium text-gray-500 uppercase">Applications</div>
            <div className="text-3xl font-bold text-gray-900">{stats.funnel.applications}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center text-center">
            <div className="text-sm font-medium text-gray-500 uppercase">Completed</div>
            <div className="text-3xl font-bold text-gray-900">{stats.funnel.completed}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center text-center">
            <div className="text-sm font-medium text-gray-500 uppercase">Evaluated</div>
            <div className="text-3xl font-bold text-gray-900">{stats.funnel.evaluated}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm p-4 text-sm flex flex-col justify-center">
            <div className="font-semibold text-gray-700 mb-2 uppercase text-xs">Score Distribution</div>
            <div className="flex justify-between items-center"><span className="text-gray-500">90-100</span><span className="font-medium text-gray-900">{stats.distribution['90-100']}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-500">80-89</span><span className="font-medium text-gray-900">{stats.distribution['80-89']}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-500">70-79</span><span className="font-medium text-gray-900">{stats.distribution['70-79']}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-500">60-69</span><span className="font-medium text-gray-900">{stats.distribution['60-69']}</span></div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search candidates..." 
          className="border rounded px-4 py-2 flex-1 min-w-[200px]"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select className="border rounded px-4 py-2" value={minScore} onChange={e => { setMinScore(e.target.value); setPage(1); }}>
          <option value="">All Scores</option>
          <option value="90">90+ (Top Tier)</option>
          <option value="80">80+ (Strong)</option>
          <option value="70">70+ (Average)</option>
        </select>
        <select className="border rounded px-4 py-2" value={assessmentStatus} onChange={e => { setAssessmentStatus(e.target.value); setPage(1); }}>
          <option value="">Assessment Status</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="PROCESSING">Evaluation Pending</option>
        </select>
        <select className="border rounded px-4 py-2" value={recommendation} onChange={e => { setRecommendation(e.target.value); setPage(1); }}>
          <option value="">AI Recommendation</option>
          <option value="ADVANCE">Advance</option>
          <option value="REVIEW">Review</option>
          <option value="REJECT">Reject</option>
        </select>
        <select className="border rounded px-4 py-2" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">HR Status</option>
          <option value="APPLIED">New</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading candidates...</div>
      ) : (
        <>
          <RankingTable 
            candidates={candidates} 
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onRowClick={(cId) => router.push(`/hr/candidates/${cId}`)}
          />
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} candidates
            </div>
            <div className="flex items-center gap-4">
              <select className="border rounded px-2 py-1 text-sm" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
                <option value="100">100 / page</option>
              </select>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  className="px-3 py-1 border rounded bg-white text-gray-700 disabled:opacity-50"
                >
                  &lt; Previous
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page >= totalPages}
                  className="px-3 py-1 border rounded bg-white text-gray-700 disabled:opacity-50"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
