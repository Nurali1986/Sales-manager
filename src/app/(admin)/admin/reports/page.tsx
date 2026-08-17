'use client'

import React, { useState } from 'react'
import { initialAdminReports, AdminReport } from '@/lib/mockAdminData'

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>(initialAdminReports)

  const handleAction = (id: string, action: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r))
    alert(`Shikoyat bo'yicha amal bajarildi: ${action}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          🚨 Shikoyatlar va Scam Moderatsiyasi (User Reports)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Nomzodlar tomonidan yuborilgan soxta e'lonlar va scam shikoyatlarini ko'rib chiqish.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reports.map(r => (
          <div
            key={r.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#dc2626' }}>
                {r.id} — {r.vacancyTitle}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0' }}>
                Kompaniya: <strong>{r.companyName}</strong> • Yuboruvchi: <strong>{r.reporterName}</strong>
              </div>
              <div style={{ backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fecaca', margin: '0.5rem 0', fontSize: '0.9rem', color: '#991b1b' }}>
                Sabab: {r.reason} — "{r.description}"
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleAction(r.id, 'Ignore')} style={reportBtnStyle}>Ignore</button>
              <button onClick={() => handleAction(r.id, 'Warning')} style={{ ...reportBtnStyle, backgroundColor: '#fffbeb', color: '#b45309' }}>Warning</button>
              <button onClick={() => handleAction(r.id, 'Hide Vacancy')} style={{ ...reportBtnStyle, backgroundColor: '#fef2f2', color: '#dc2626' }}>Hide Vacancy</button>
              <button onClick={() => handleAction(r.id, 'Block Company')} style={{ ...reportBtnStyle, backgroundColor: '#dc2626', color: '#fff' }}>Block Company</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const reportBtnStyle: React.CSSProperties = { padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }
