'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialAdminStats } from '@/lib/mockAdminData'

export default function AdminDashboardPage() {
  const router = useRouter()
  const stats = initialAdminStats

  const mainStatCards = [
    { label: 'Kompaniyalar', count: stats.totalCompanies.toLocaleString(), icon: '🏢', color: '#2563eb', bg: '#eff6ff', link: '/admin/companies' },
    { label: 'Foydalanuvchilar', count: stats.totalUsers.toLocaleString(), icon: '👥', color: '#10b981', bg: '#ecfdf5', link: '/admin/users' },
    { label: 'Vakansiyalar', count: stats.totalVacancies.toLocaleString(), icon: '💼', color: '#7c3aed', bg: '#f5f3ff', link: '/admin/vacancies' },
    { label: 'Arizalar', count: stats.totalApplications.toLocaleString(), icon: '📩', color: '#0284c7', bg: '#f0f9ff', link: '/admin/applications' },
  ]

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
            Butun platforma kompaniyalari, vakansiyalari, moderatsiya va to'lovlarini global nazorat qilish.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>OYLIK PLATFORMA DAROMADI</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>{stats.monthlyRevenue}</div>
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {mainStatCards.map((card, i) => (
          <div
            key={i}
            onClick={() => router.push(card.link)}
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease'
            }}
            className="card-hover-effect"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{card.icon}</span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: card.color,
                backgroundColor: card.bg,
                padding: '0.2rem 0.6rem',
                borderRadius: '6px'
              }}>
                Batafsil ➔
              </span>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a' }}>
              {card.count}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', marginTop: '0.25rem' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* 🚨 "Diqqat talab qiladi" Section */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⚠️ Diqqat talab qiladi (Attention Required)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div
            onClick={() => router.push('/admin/companies?status=pending')}
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1.15rem', borderRadius: '12px', cursor: 'pointer' }}
          >
            <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '1rem' }}>🔴 {stats.pendingCompanies} ta kompaniya tasdiqlashni kutmoqda</div>
            <div style={{ fontSize: '0.8rem', color: '#b91c1c', marginTop: '0.25rem' }}>Hujjatlar va INN verifikatsiyasi</div>
          </div>

          <div
            onClick={() => router.push('/admin/moderation')}
            style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '1.15rem', borderRadius: '12px', cursor: 'pointer' }}
          >
            <div style={{ fontWeight: 800, color: '#92400e', fontSize: '1rem' }}>🔴 {stats.pendingVacancies} ta vakansiya moderatsiyada</div>
            <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '0.25rem' }}>E'lon talablarini tekshirish</div>
          </div>

          <div
            onClick={() => router.push('/admin/reports')}
            style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', padding: '1.15rem', borderRadius: '12px', cursor: 'pointer' }}
          >
            <div style={{ fontWeight: 800, color: '#c2410c', fontSize: '1rem' }}>🟠 {stats.unresolvedReports} ta shikoyat ko‘rib chiqilmagan</div>
            <div style={{ fontSize: '0.8rem', color: '#9a3412', marginTop: '0.25rem' }}>Candidate scam shikoyatlari</div>
          </div>

          <div
            onClick={() => router.push('/admin/payments')}
            style={{ backgroundColor: '#fefce8', border: '1px solid #fef08a', padding: '1.15rem', borderRadius: '12px', cursor: 'pointer' }}
          >
            <div style={{ fontWeight: 800, color: '#854d0e', fontSize: '1rem' }}>🟠 {stats.paymentIssues} ta to‘lov muammosi</div>
            <div style={{ fontSize: '0.8rem', color: '#a16207', marginTop: '0.25rem' }}>Muvaffaqiyatsiz tranzaksiyalar</div>
          </div>

          <div
            onClick={() => router.push('/admin/support')}
            style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.15rem', borderRadius: '12px', cursor: 'pointer' }}
          >
            <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '1rem' }}>🔵 {stats.supportTickets} ta support ticket</div>
            <div style={{ fontSize: '0.8rem', color: '#1d4ed8', marginTop: '0.25rem' }}>Foydalanuvchilar murojaati</div>
          </div>
        </div>
      </div>
    </div>
  )
}
