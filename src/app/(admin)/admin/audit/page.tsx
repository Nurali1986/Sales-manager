'use client'

import React, { useState } from 'react'
import { initialAdminAuditLogs } from '@/lib/mockAdminData'

export default function AdminAuditPage() {
  const [logs] = useState(initialAdminAuditLogs)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          📝 Audit Log (System Trail)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Platformadagi barcha ma'muriy amallar, kompaniya verifikatsiyalari va rol o'zgarishlarining rad etib bo'lmas jurnali.
        </p>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Vaqt</th>
              <th style={thStyle}>Admin</th>
              <th style={thStyle}>Amal (Action)</th>
              <th style={thStyle}>Obyekt (Target)</th>
              <th style={thStyle}>IP Manzil</th>
              <th style={thStyle}>Natija</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ ...tdStyle, fontSize: '0.8rem', color: '#64748b' }}>{log.timestamp}</td>
                <td style={{ ...tdStyle, fontWeight: 800 }}>{log.adminName}</td>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#dc2626' }}>{log.action}</td>
                <td style={tdStyle}>{log.target}</td>
                <td style={{ ...tdStyle, fontSize: '0.8rem', color: '#64748b' }}>{log.ip}</td>
                <td style={tdStyle}>
                  <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 900, fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                    {log.result}
                  </span>
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
