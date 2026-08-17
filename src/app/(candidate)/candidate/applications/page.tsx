'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialCandidateApplications, CandidateApplication } from '@/lib/mockCandidateData'

export default function CandidateApplicationsPage() {
  const router = useRouter()
  const [applications] = useState<CandidateApplication[]>(initialCandidateApplications)
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'>('all')

  const tabs = [
    { id: 'all', label: 'Barchasi', count: applications.length },
    { id: 'new', label: 'Yangi', count: applications.filter(a => a.status === 'new').length },
    { id: 'screening', label: 'Ko‘rib chiqilmoqda', count: applications.filter(a => a.status === 'screening').length },
    { id: 'interview', label: 'Intervyu', count: applications.filter(a => a.status === 'interview').length },
    { id: 'offer', label: 'Offer', count: applications.filter(a => a.status === 'offer').length },
    { id: 'hired', label: 'Qabul qilindi', count: applications.filter(a => a.status === 'hired').length },
    { id: 'rejected', label: 'Rad etildi', count: applications.filter(a => a.status === 'rejected').length },
  ]

  const filtered = applications.filter(a => {
    if (activeTab !== 'all' && a.status !== activeTab) return false
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          📋 Mening arizalarim (My Applications)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Siz topshirgan barcha vakansiyalar va ularning qabul jarayoni holati.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                borderBottom: isActive ? '3px solid #10b981' : '3px solid transparent',
                color: isActive ? '#10b981' : '#64748b',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {tab.label}
              <span style={{
                backgroundColor: isActive ? '#ecfdf5' : '#f1f5f9',
                color: isActive ? '#10b981' : '#64748b',
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Application Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(app => (
          <div
            key={app.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                {app.jobTitle}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700, marginBottom: '0.5rem' }}>
                {app.companyName}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                📅 Ariza yuborildi: {app.appliedDate}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: app.status === 'hired' ? '#dcfce7' : app.status === 'screening' ? '#fffbeb' : '#eff6ff',
                color: app.status === 'hired' ? '#15803d' : app.status === 'screening' ? '#b45309' : '#1d4ed8',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}>
                {app.status === 'screening' ? '🟡 Ko‘rib chiqilmoqda' : app.status === 'interview' ? '🟠 Intervyu' : app.status === 'hired' ? '🟢 Qabul qilindi' : '🔵 Yangi'}
              </span>

              <Link
                href={`/candidate/applications/${app.id}`}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                Batafsil ➔
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
