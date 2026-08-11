import React from 'react'
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function PublicJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true }
  })

  if (!job || job.status !== 'PUBLISHED') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600">{job.company.name}</div>
          <Link href={`/jobs/${job.id}/apply`} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Apply Now
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="bg-white border rounded-2xl p-8 md:p-12 shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
            {job.department && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Department:</span> {job.department}
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="font-medium">Type:</span> {job.employmentType.replace('_', ' ')}
            </div>
            {job.salaryMin && job.salaryMax && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Salary:</span> {job.salaryMin} - {job.salaryMax} {job.currency}
              </div>
            )}
          </div>

          <div className="prose max-w-none text-gray-700">
            {job.description.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t flex justify-center">
            <Link href={`/jobs/${job.id}/apply`} className="bg-blue-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-md">
              Apply for this position
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
