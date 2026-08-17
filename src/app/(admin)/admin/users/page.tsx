'use client'

import React, { useState } from 'react'
import { initialAdminUsers, AdminUser } from '@/lib/mockAdminData'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers)
  const [activeTab, setActiveTab] = useState<'all' | 'Candidate' | 'HR' | 'SuperAdmin' | 'Blocked'>('all')

  const [selectedUserForRole, setSelectedUserForRole] = useState<AdminUser | null>(null)
  const [newRole, setNewRole] = useState<'Candidate' | 'HR' | 'SuperAdmin'>('HR')
  const [twoFactorCode, setTwoFactorCode] = useState('')

  const filtered = users.filter(u => {
    if (activeTab === 'Blocked') return u.status === 'Blocked'
    if (activeTab !== 'all' && u.role !== activeTab) return false
    return true
  })

  const handleToggleBlock = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' } : u))
  }

  const handleConfirmRoleChange = () => {
    if (!selectedUserForRole || twoFactorCode !== '123456') {
      alert('2FA kodi xato! (Demo 2FA kodi: 123456)')
      return
    }
    setUsers(users.map(u => u.id === selectedUserForRole.id ? { ...u, role: newRole } : u))
    setSelectedUserForRole(null)
    setTwoFactorCode('')
    alert('Foydalanuvchi roli muvaffaqiyatli o\'zgartirildi.')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          👥 Foydalanuvchilar Boshqaruvi (User Access & Security)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Platformaning barcha Candidate, HR hamda SuperAdmin foydalanuvchilarini boshqarish.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem' }}>
        {[
          { id: 'all', label: 'Barchasi' },
          { id: 'Candidate', label: 'Candidates' },
          { id: 'HR', label: 'HR & Recruiters' },
          { id: 'SuperAdmin', label: 'SuperAdmins' },
          { id: 'Blocked', label: 'Bloklanganlar' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
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

      {/* Users Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>ID / F.I.Sh.</th>
              <th style={thStyle}>Email & Telefon</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Kompaniya</th>
              <th style={thStyle}>Oxirgi kirish</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Xavfsizlik Amallari</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>#{u.id}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600 }}>{u.email}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.phone}</div>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: u.role === 'SuperAdmin' ? '#fef2f2' : u.role === 'HR' ? '#eff6ff' : '#ecfdf5',
                    color: u.role === 'SuperAdmin' ? '#dc2626' : u.role === 'HR' ? '#2563eb' : '#047857',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: '#475569' }}>{u.companyName || '—'}</td>
                <td style={{ ...tdStyle, fontSize: '0.8rem', color: '#64748b' }}>{u.lastLogin}</td>
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: u.status === 'Active' ? '#dcfce7' : '#fef2f2',
                    color: u.status === 'Active' ? '#15803d' : '#dc2626',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px'
                  }}>
                    {u.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleToggleBlock(u.id)}
                      style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: u.status === 'Blocked' ? '#10b981' : '#ef4444' }}
                    >
                      {u.status === 'Blocked' ? 'Unblock' : 'Block User'}
                    </button>
                    <button
                      onClick={() => { setSelectedUserForRole(u); setNewRole(u.role === 'HR' ? 'Candidate' : 'HR') }}
                      style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Change Role
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2FA Protected Role Change Modal */}
      {selectedUserForRole && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '440px' }}>
            <h3 style={{ marginTop: 0, fontWeight: 900, fontSize: '1.25rem', color: '#dc2626' }}>
              ⚠️ Change User Role (2FA Protection)
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1rem 0' }}>
              Foydalanuvchi: <strong>{selectedUserForRole.name}</strong><br />
              Ushbu amal xavfsizlik jihatidan o'ta muhim bo'lgani sababli 2FA kodi talab qilinadi.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Yangi Rol</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value as any)} style={inputStyle}>
                  <option value="Candidate">Candidate</option>
                  <option value="HR">HR</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>SuperAdmin 2FA Authenticator kodi *</label>
                <input
                  type="text"
                  placeholder="Demo 2FA: 123456"
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value)}
                  style={{ ...inputStyle, fontWeight: 800, letterSpacing: '0.2em' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setSelectedUserForRole(null)} style={cancelBtnStyle}>Bekor qilish</button>
              <button onClick={handleConfirmRoleChange} style={{ ...approveBtnStyle, backgroundColor: '#dc2626' }}>Rolni Tasdiqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }
const tdStyle: React.CSSProperties = { padding: '1rem 1.25rem', fontSize: '0.9rem' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '90%' }
const cancelBtnStyle: React.CSSProperties = { padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 600, cursor: 'pointer' }
const approveBtnStyle: React.CSSProperties = { padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 800, cursor: 'pointer' }
