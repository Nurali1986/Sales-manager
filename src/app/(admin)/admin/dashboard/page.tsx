'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AdminStats {
  totalCompanies: number
  totalUsers: number
  totalVacancies: number
  totalApplications: number
  activeVacancies: number
  draftVacancies: number
  totalCandidates: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/vacancies')
      .then(res => res.json())
      .then(res => {
        const jobs = res.data || []
        setStats({
          totalCompanies: new Set(jobs.map((j: any) => j.company)).size || 0,
          totalUsers: 0,
          totalVacancies: jobs.length,
          totalApplications: jobs.reduce((acc: number, j: any) => acc + (j.applicationsCount || 0), 0),
          activeVacancies: jobs.filter((j: any) => j.status === 'ACTIVE').length,
          draftVacancies: jobs.filter((j: any) => j.status === 'DRAFT').length,
          totalCandidates: 0,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const mainStatCards = stats ? [
    { label: 'Jami Vakansiyalar', count: stats.totalVacancies, icon: '💼', color: '#7c3aed', bg: '#f5f3ff', link: '/admin/vacancies' },
    { label: 'Faol Vakansiyalar', count: stats.activeVacancies, icon: '🟢', color: '#16a34a', bg: '#f0fdf4', link: '/admin/vacancies' },
    { label: 'Moderatsiyada (Draft)', count: stats.draftVacancies, icon: '📝', color: '#d97706', bg: '#fffbeb', link: '/admin/moderation' },
    { label: 'Jami Arizalar', count: stats.totalApplications, icon: '📩', color: '#0284c7', bg: '#f0f9ff', link: '/admin/applications' },
  ] : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem 2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            🛡️ SuperAdmin Control Center
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Barcha ma'lumotlar bazadan olinadi. Demo ma'lumotlar yo'q.
          </p>
        </div>
      </div>

      {/* Primary Stat Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>⏳ Bazadan yuklanmoqda...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {mainStatCards.map((card, i) => (
            <div
              key={i}
              onClick={() => router.push(card.link)}
              style={{
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>{card.label}</div>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  {card.icon}
                </div>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: card.color }}>
                {card.count}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem', margin: '0 0 1.25rem 0' }}>
          🔗 Tezkor Havolalar
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link href="/admin/moderation" style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '1rem 1.25rem', borderRadius: '12px',
            backgroundColor: '#fffbeb', border: '1px solid #fde68a',
            textDecoration: 'none', color: '#92400e', fontWeight: 700
          }}>
            📝 Moderatsiya {stats?.draftVacancies ? `(${stats.draftVacancies})` : ''}
          </Link>
          <Link href="/admin/vacancies" style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '1rem 1.25rem', borderRadius: '12px',
            backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe',
            textDecoration: 'none', color: '#6d28d9', fontWeight: 700
          }}>
            💼 Vakansiyalar
          </Link>
          <Link href="/admin/companies" style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '1rem 1.25rem', borderRadius: '12px',
            backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
            textDecoration: 'none', color: '#2563eb', fontWeight: 700
          }}>
            🏢 Kompaniyalar
          </Link>
        </div>
      </div>
    </div>
  )
}
