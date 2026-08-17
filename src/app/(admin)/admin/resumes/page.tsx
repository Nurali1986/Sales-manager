'use client'

import React from 'react'

export default function AdminResumesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          📄 Rezumelar Boshqaruvi (Resume Database Monitoring)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Platformadagi barcha kandidatlar rezyumelari va ularning maxfiylik holatlari.
        </p>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Nomzod</th>
              <th style={thStyle}>Istalgan lavozim</th>
              <th style={thStyle}>Maxfiylik (Visibility)</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={tdStyle}>
                <div style={{ fontWeight: 800 }}>Elbek Abdullayev</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>#usr-9281</div>
              </td>
              <td style={tdStyle}>QA Engineer</td>
              <td style={tdStyle}>
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                  🟢 Public
                </span>
              </td>
              <td style={tdStyle}>Active</td>
              <td style={tdStyle}>
                <button style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  Ko'rish
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }
const tdStyle: React.CSSProperties = { padding: '1rem 1.25rem', fontSize: '0.9rem' }
