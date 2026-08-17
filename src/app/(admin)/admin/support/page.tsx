'use client'

import React, { useState } from 'react'
import { initialAdminTickets } from '@/lib/mockAdminData'

export default function AdminSupportPage() {
  const [tickets] = useState(initialAdminTickets)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          🎟️ Support Ticketing Panel (Murojaatlar)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Foydalanuvchilar va HR menejerlarning qo'llab-quvvatlash xizmatiga yo'llagan murojaatlari.
        </p>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Ticket ID</th>
              <th style={thStyle}>Foydalanuvchi</th>
              <th style={thStyle}>Mavzu</th>
              <th style={thStyle}>Muhimlik</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Amal</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#dc2626' }}>{t.ticketNumber}</td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 700 }}>{t.userName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.userEmail}</div>
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{t.subject}</td>
                <td style={tdStyle}>
                  <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                    🔴 {t.priority}
                  </span>
                </td>
                <td style={tdStyle}>{t.status}</td>
                <td style={tdStyle}>
                  <button onClick={() => alert(`Reply to ticket ${t.ticketNumber}`)} style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                    Javob berish
                  </button>
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
