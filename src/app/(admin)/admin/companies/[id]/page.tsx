'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { initialAdminCompanies } from '@/lib/mockAdminData'

export default function AdminCompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const companyId = resolvedParams.id

  const company = initialAdminCompanies.find(c => c.id === companyId) || initialAdminCompanies[0]
  const [activeTab, setActiveTab] = useState<'umumiy' | 'hr_users' | 'vacancies' | 'candidates' | 'payments' | 'plan' | 'reports' | 'audit'>('umumiy')
  const [isBlocked, setIsBlocked] = useState(company.status === 'blocked')

  const handleToggleBlock = () => {
    setIsBlocked(!isBlocked)
    alert(isBlocked ? 'Kompaniya blokdan chiqarildi.' : 'Kompaniya bloklandi.')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Link href="/admin/companies" style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
        ← Kompaniyalar ro'yxatiga qaytish
      </Link>

      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem 2rem',
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
            borderRadius: '16px',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🏢
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {company.name}
              </h1>
              <span style={{
                backgroundColor: isBlocked ? '#fef2f2' : '#dcfce7',
                color: isBlocked ? '#dc2626' : '#15803d',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px'
              }}>
                {isBlocked ? '🔴 BLOCKED' : '🟢 Verified'}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.2rem' }}>
              ID: #{company.id} • INN: {company.inn} • {company.industry}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => alert('Kompaniya ma\'lumotlarini tahrirlash')} style={headerBtnStyle}>✏️ Tahrirlash</button>
          <button onClick={handleToggleBlock} style={{ ...headerBtnStyle, backgroundColor: isBlocked ? '#dcfce7' : '#fef2f2', color: isBlocked ? '#15803d' : '#dc2626' }}>
            {isBlocked ? '🟢 Blokdan chiqarish' : '🔴 Bloklash'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', overflowX: 'auto' }}>
        {[
          { id: 'umumiy', label: 'Umumiy' },
          { id: 'hr_users', label: 'HR Users' },
          { id: 'vacancies', label: 'Vakansiyalar' },
          { id: 'candidates', label: 'Candidate\'lar' },
          { id: 'payments', label: 'To‘lovlar' },
          { id: 'plan', label: 'Tarif' },
          { id: 'reports', label: 'Shikoyatlar' },
          { id: 'audit', label: 'Audit' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid #dc2626' : '3px solid transparent',
              color: activeTab === tab.id ? '#dc2626' : '#64748b',
              fontWeight: activeTab === tab.id ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0' }}>
        {activeTab === 'umumiy' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={labelStyle}>Kompaniya nomi:</div>
              <div style={valueStyle}>{company.name}</div>
              <div style={labelStyle}>Yuridik nomi:</div>
              <div style={valueStyle}>{company.legalName}</div>
              <div style={labelStyle}>INN:</div>
              <div style={valueStyle}>{company.inn}</div>
              <div style={labelStyle}>Telefon:</div>
              <div style={valueStyle}>{company.phone}</div>
            </div>

            <div>
              <div style={labelStyle}>Email:</div>
              <div style={valueStyle}>{company.email}</div>
              <div style={labelStyle}>Veb-sayt:</div>
              <div style={valueStyle}>{company.website}</div>
              <div style={labelStyle}>Shahar & Manzil:</div>
              <div style={valueStyle}>{company.city}, {company.address}</div>
              <div style={labelStyle}>Ro'yxatdan o'tgan sana:</div>
              <div style={valueStyle}>{company.registeredAt}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const headerBtnStyle: React.CSSProperties = { padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }
const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.2rem', marginTop: '0.75rem' }
const valueStyle: React.CSSProperties = { fontSize: '1rem', fontWeight: 800, color: '#0f172a' }
