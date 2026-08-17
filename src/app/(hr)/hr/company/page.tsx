'use client'

import React, { useState } from 'react'
import { initialCompanyInfo } from '@/lib/mockHrData'

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState<'umumiy' | 'haqida' | 'vakansiyalar' | 'fotosuratlar' | 'kontaktlar'>('umumiy')
  const [company, setCompany] = useState(initialCompanyInfo)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem 2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.5rem'
          }}>
            TS
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {company.name}
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.2rem' }}>
              🏢 {company.industry} • 📍 {company.city} • 👥 {company.employeeCount}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: isEditing ? '#10b981' : '#f1f5f9',
            color: isEditing ? '#ffffff' : '#1e293b',
            border: '1px solid #cbd5e1',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          {isEditing ? '💾 Saqlash' : '✏️ Ma\'lumotlarni tahrirlash'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0' }}>
        {[
          { id: 'umumiy', label: 'Umumiy' },
          { id: 'haqida', label: 'Haqida' },
          { id: 'vakansiyalar', label: 'Vakansiyalar' },
          { id: 'fotosuratlar', label: 'Fotosuratlar' },
          { id: 'kontaktlar', label: 'Kontaktlar' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === tab.id ? '#2563eb' : '#64748b',
              fontWeight: activeTab === tab.id ? 700 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0' }}>
        {activeTab === 'umumiy' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Kompaniya nomi</label>
              <input type="text" value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} disabled={!isEditing} style={inputStyle} />

              <label style={{ ...labelStyle, marginTop: '1rem' }}>Veb-sayt</label>
              <input type="text" value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })} disabled={!isEditing} style={inputStyle} />

              <label style={{ ...labelStyle, marginTop: '1rem' }}>Telefon</label>
              <input type="text" value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })} disabled={!isEditing} style={inputStyle} />

              <label style={{ ...labelStyle, marginTop: '1rem' }}>Email</label>
              <input type="text" value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} disabled={!isEditing} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Sohasi (Industry)</label>
              <input type="text" value={company.industry} onChange={e => setCompany({ ...company, industry: e.target.value })} disabled={!isEditing} style={inputStyle} />

              <label style={{ ...labelStyle, marginTop: '1rem' }}>Shahar</label>
              <input type="text" value={company.city} onChange={e => setCompany({ ...company, city: e.target.value })} disabled={!isEditing} style={inputStyle} />

              <label style={{ ...labelStyle, marginTop: '1rem' }}>Manzil</label>
              <input type="text" value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} disabled={!isEditing} style={inputStyle} />

              <label style={{ ...labelStyle, marginTop: '1rem' }}>Xodimlar soni</label>
              <input type="text" value={company.employeeCount} onChange={e => setCompany({ ...company, employeeCount: e.target.value })} disabled={!isEditing} style={inputStyle} />
            </div>
          </div>
        )}

        {activeTab === 'haqida' && (
          <div>
            <label style={labelStyle}>Kompaniya haqida batafsil ma'lumot</label>
            <textarea
              rows={6}
              value={company.description}
              onChange={e => setCompany({ ...company, description: e.target.value })}
              disabled={!isEditing}
              style={{ ...inputStyle, fontFamily: 'inherit' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }
