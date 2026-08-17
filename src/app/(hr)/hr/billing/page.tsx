'use client'

import React from 'react'
import { initialBillingInfo } from '@/lib/mockHrData'

export default function BillingPage() {
  const billing = initialBillingInfo

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          💳 Tarif va to‘lovlar (Tariffs & Billing Workspace)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Obuna rejangiz, kvotalar hamda to'lovlar tarixini kuzatib boring.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2563eb' }}>Joriy tarif: {billing.currentPlan}</span>
            <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.8rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
              🟢 Faol
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.4rem' }}>
            Oylik obuna to'lovi: <strong>{billing.pricePerMonth}</strong> • Keyingi to'lov: <strong>{billing.renewsAt}</strong>
          </div>
        </div>

        <button
          onClick={() => alert('Tarif rejalarini ko\'rish va yangilash formasi')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          [ Tarifni o‘zgartirish ]
        </button>
      </div>

      {/* Limits & Usage Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginBottom: '0.5rem' }}>
            <span>📋 Faol vakansiyalar limit</span>
            <span style={{ color: '#2563eb' }}>{billing.activeVacanciesUsed} / {billing.activeVacanciesLimit}</span>
          </div>
          <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${(billing.activeVacanciesUsed / billing.activeVacanciesLimit) * 100}%`, height: '100%', backgroundColor: '#2563eb' }} />
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginBottom: '0.5rem' }}>
            <span>🔎 Nomzod ko‘rish limiti</span>
            <span style={{ color: '#10b981' }}>{billing.resumeViewsUsed} / {billing.resumeViewsLimit}</span>
          </div>
          <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${(billing.resumeViewsUsed / billing.resumeViewsLimit) * 100}%`, height: '100%', backgroundColor: '#10b981' }} />
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', fontWeight: 800, fontSize: '1.1rem', borderBottom: '1px solid #e2e8f0' }}>
          To‘lovlar tarixi (Billing History)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Sana</th>
              <th style={thStyle}>Tarif reja</th>
              <th style={thStyle}>Summa</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Invoys</th>
            </tr>
          </thead>
          <tbody>
            {billing.paymentHistory.map(pay => (
              <tr key={pay.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ ...tdStyle, fontWeight: 700 }}>{pay.date}</td>
                <td style={tdStyle}>{pay.plan}</td>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#0f172a' }}>{pay.amount}</td>
                <td style={tdStyle}>
                  <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.8rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    {pay.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <a href={pay.invoiceUrl} style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>PDF yuklab olish</a>
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
