'use client'

import React, { useState } from 'react'
import { initialAdminPayments } from '@/lib/mockAdminData'

export default function AdminPaymentsPage() {
  const [payments] = useState(initialAdminPayments)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          💳 Platforma To‘lovlari (Payments Ledger)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Payme, Click va boshqa tizimlar orqali amalga oshirilgan tranzaksiyalar.
        </p>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Transaction ID</th>
              <th style={thStyle}>Kompaniya</th>
              <th style={thStyle}>Tarif reja</th>
              <th style={thStyle}>Summa</th>
              <th style={thStyle}>To'lov Tizimi</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Sana</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#2563eb' }}>{p.transactionId}</td>
                <td style={{ ...tdStyle, fontWeight: 700 }}>🏢 {p.companyName}</td>
                <td style={tdStyle}>{p.plan}</td>
                <td style={{ ...tdStyle, fontWeight: 900, color: '#0f172a' }}>{p.amount}</td>
                <td style={tdStyle}>{p.paymentMethod}</td>
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: p.status === 'Paid' ? '#dcfce7' : p.status === 'Failed' ? '#fef2f2' : '#fffbeb',
                    color: p.status === 'Paid' ? '#15803d' : p.status === 'Failed' ? '#dc2626' : '#b45309',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px'
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ ...tdStyle, fontSize: '0.8rem', color: '#64748b' }}>{p.date}</td>
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
