'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function VacanciesPage() {
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

  if (loading) return <div className="p-8">Loading vacancies...</div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vacancies</h1>
        <Link 
          href="/hr/vacancies/new" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
        >
          + Create Vacancy
        </Link>
      </div>
      
      {vacancies.length === 0 ? (
        <div className="bg-gray-50 border p-8 rounded text-center text-gray-500">
          No vacancies found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {vacancies.map(v => (
              <div key={v.id} className="bg-white border rounded-xl p-6 hover:shadow-md transition shadow-sm flex items-center justify-between">
                <Link href={`/hr/vacancies/${v.id}/candidates`} className="flex-1 block">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{v.title}</h2>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{v.status}</span>
                      <span>Created: {new Date(v.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
                <div className="flex gap-8 text-center items-center">
                  <Link href={`/hr/vacancies/${v.id}/candidates`} className="flex gap-8 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{v.totalApplications}</div>
                      <div className="text-xs text-gray-500 uppercase">Applications</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{v.completedAssessments}</div>
                      <div className="text-xs text-gray-500 uppercase">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{v.shortlisted}</div>
                      <div className="text-xs text-gray-500 uppercase">Shortlisted</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{v.averageScore ? Math.round(v.averageScore) : '-'}</div>
                      <div className="text-xs text-gray-500 uppercase">Avg Score</div>
                    </div>
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      navigator.clipboard.writeText(`${window.location.origin}/jobs/${v.id}`)
                      alert('Vacancy link copied to clipboard!')
                    }}
                    className="ml-4 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm whitespace-nowrap"
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
