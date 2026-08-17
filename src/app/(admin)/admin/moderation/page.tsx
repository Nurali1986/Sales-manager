'use client'

import React, { useState } from 'react'
import { initialAdminVacancies, AdminVacancy } from '@/lib/mockAdminData'

export default function AdminModerationPage() {
  const [vacancies, setVacancies] = useState<AdminVacancy[]>(initialAdminVacancies)
  const [selectedVac, setSelectedVac] = useState<AdminVacancy>(initialAdminVacancies[0])

  const handleApprove = (id: string) => {
    setVacancies(vacancies.map(v => v.id === id ? { ...v, status: 'active' } : v))
    alert('Vakansiya moderatsiyadan o\'tdi va Faol holatga o\'tkazildi!')
  }

  const handleReject = (id: string) => {
    setVacancies(vacancies.map(v => v.id === id ? { ...v, status: 'rejected' } : v))
    alert('Vakansiya rad etildi.')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          🛡️ Vakansiya Moderatsiyasi (Moderation Engine)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          HR tomonidan topshirilgan vakansiyalarni e me'yorlariga mosligini tekshirish va tasdiqlash.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Vacancy Content */}
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{selectedVac.title}</h2>
              <div style={{ fontSize: '1rem', color: '#dc2626', fontWeight: 800, marginTop: '0.2rem' }}>🏢 {selectedVac.companyName}</div>
            </div>
            <span style={{ backgroundColor: '#fffbeb', color: '#b45309', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
              🟡 Moderation Pending
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <span>📍 {selectedVac.location}</span>
            <span>💰 Maosh: {selectedVac.salaryText}</span>
            <span>📂 Kategoriya: {selectedVac.category}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: 800 }}>Vazifalar:</h4>
              <p style={{ margin: 0, color: '#334155', lineHeight: 1.6 }}>Avtomatlashtirilgan va qo'lda testlash o'tkazish, API funksionalligini tekshirish.</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: 800 }}>Talablar:</h4>
              <p style={{ margin: 0, color: '#334155', lineHeight: 1.6 }}>Postman va SQL bilimlariga ega bo'lish, REST API arxitekturasini tushunish.</p>
            </div>
          </div>
        </div>

        {/* Right Moderation Checklist Panel */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>Moderation Checklist</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
            <label style={checkItemStyle}><input type="checkbox" defaultChecked /> ☑ Company verified</label>
            <label style={checkItemStyle}><input type="checkbox" defaultChecked /> ☑ Job title valid</label>
            <label style={checkItemStyle}><input type="checkbox" defaultChecked /> ☑ Salary valid</label>
            <label style={checkItemStyle}><input type="checkbox" defaultChecked /> ☑ Category valid</label>
            <label style={checkItemStyle}><input type="checkbox" defaultChecked /> ☑ Location valid</label>
            <label style={checkItemStyle}><input type="checkbox" defaultChecked /> ☑ Description valid</label>
            <label style={checkItemStyle}><input type="checkbox" defaultChecked /> ☑ No prohibited content</label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <button
              onClick={() => handleReject(selectedVac.id)}
              style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              ❌ Reject
            </button>
            <button
              onClick={() => handleApprove(selectedVac.id)}
              style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              🟢 Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const checkItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, color: '#1e293b' }
