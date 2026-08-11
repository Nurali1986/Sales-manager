'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HRDashboard() {
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

  if (loading) return <div className="p-8">Loading dashboard...</div>
  if (!data) return <div className="p-8 text-red-500">Failed to load dashboard</div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/hr/vacancies" className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">
          View Vacancies
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Active Vacancies</div>
          <div className="text-3xl font-bold text-gray-900">{data.activeVacancies}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Candidates</div>
          <div className="text-3xl font-bold text-gray-900">{data.totalApplications}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Assessments Completed</div>
          <div className="text-3xl font-bold text-gray-900">{data.assessmentsCompleted}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-blue-600">{data.pendingReview}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Shortlisted</div>
          <div className="text-3xl font-bold text-green-600">{data.shortlisted}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Avg Company Score</div>
          <div className="text-3xl font-bold text-blue-600">{Math.round(data.averageScore)}</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Candidates</h2>
      {data.recentCandidates.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded border text-center text-gray-500">
          No candidates have completed assessments yet.
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recentCandidates.map((c: any) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{c.candidate.firstName} {c.candidate.lastName}</td>
                  <td className="px-6 py-4 text-gray-500">{c.job.title}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{Math.round(c.totalScore)}</td>
                  <td className="px-6 py-4">
                    <Link href={`/hr/candidates/${c.candidate.id}`} className="text-blue-600 hover:underline font-medium">
                      Review
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
