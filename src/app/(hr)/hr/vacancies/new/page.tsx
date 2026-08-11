'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewVacancyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    employmentType: 'FULL_TIME',
    description: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null
      }

      const res = await fetch('/api/hr/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Failed to create vacancy')

      router.push('/hr/vacancies')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Vacancy</h1>
        <Link href="/hr/vacancies" className="text-gray-600 hover:text-gray-900">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-xl p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Senior Sales Representative"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Enterprise Sales"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary</label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 80000"
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
            <textarea
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the role and responsibilities..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Creating...' : 'Publish Vacancy'}
          </button>
        </div>
      </form>
    </div>
  )
}
