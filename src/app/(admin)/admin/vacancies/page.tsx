'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { initialAdminVacancies, AdminVacancy } from '@/lib/mockAdminData'

export default function AdminVacanciesPage() {
  const [vacancies] = useState<AdminVacancy[]>(initialAdminVacancies)
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            💼 Vakansiyalar Boshqaruvi (Platform Vacancies)
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Platformadagi barcha e'lonlar, moderatsiya va statistikalar.
          </p>
        </div>

        <Link
          href="/admin/moderation"
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          🛡️ Moderatsiyaga o'tish (27)
        </Link>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Lavozim & Kompaniya</th>
              <th style={thStyle}>Kategoriya & Shahar</th>
              <th style={thStyle}>Maosh</th>
              <th style={thStyle}>Ko'rish / Arizalar</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{v.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 700 }}>🏢 {v.companyName}</div>
                </td>
                <td style={tdStyle}>
                  <div>{v.category}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 {v.location}</div>
                </td>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#10b981' }}>{v.salaryText}</td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '0.85rem' }}>👁 <strong>{v.viewsCount}</strong> • 📩 <strong>{v.applicationsCount}</strong></div>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: v.status === 'active' ? '#dcfce7' : '#fffbeb',
                    color: v.status === 'active' ? '#15803d' : '#b45309',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px'
                  }}>
                    {v.status.toUpperCase()}
                  </span>
                </td>
                <td style={tdStyle}>
                  <Link href="/admin/moderation" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                    Moderatsiya ➔
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }
const tdStyle: React.CSSProperties = { padding: '1rem 1.25rem', fontSize: '0.9rem' }
