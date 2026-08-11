'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function ApplyPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Failed to submit application')

      // Redirect to the assessment token
      if (json.data?.token) {
        router.push(`/assessment/${json.data.token}/welcome`)
      } else {
        throw new Error('Assessment link generation failed.')
      }
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Start your Application</h1>
        <p className="text-gray-600 mb-8">Please enter your basic details to begin the assessment process.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+998901234567"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Start Assessment'}
            </button>
            <Link href={`/jobs/${jobId}`} className="text-center text-gray-500 hover:text-gray-900 text-sm font-medium py-2">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
