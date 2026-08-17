'use client'

import React, { useState } from 'react'
import { initialTeamMembers, TeamMember } from '@/lib/mockHrData'

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeamMembers)
  const [showAddModal, setShowAddModal] = useState(false)

  // Modal form state
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'HR Admin' | 'Recruiter' | 'Hiring Manager'>('Recruiter')
  const [perms, setPerms] = useState({
    createVacancy: true,
    editVacancy: true,
    viewCandidates: true,
    editCandidates: true,
    viewBilling: false,
    companySettings: false
  })

  const handleAddMember = () => {
    if (!email.trim() || !name.trim()) return
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      permissions: perms,
      status: 'Pending'
    }
    setTeam([...team, newMember])
    setShowAddModal(false)
    setEmail('')
    setName('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            👨‍💼 Kompaniya Jamoasi (HR Team Management)
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Recruiterlar, HR menejerlar va suhbatdoshlar vakolatlarini boshqarish.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          + Xodim qo‘shish
        </button>
      </div>

      {/* Team Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Xodim</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Ruxsatlar (Permissions)</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {team.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ ...tdStyle, fontWeight: 700, color: '#0f172a' }}>{m.name}</td>
                <td style={{ ...tdStyle, color: '#64748b' }}>{m.email}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: m.role === 'HR Admin' ? '#eff6ff' : '#f1f5f9',
                    color: m.role === 'HR Admin' ? '#2563eb' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}>
                    {m.role}
                  </span>
                </td>
                <td style={{ ...tdStyle, fontSize: '0.8rem', color: '#475569' }}>
                  {m.permissions.createVacancy && '✓ Vakansiya '}
                  {m.permissions.viewCandidates && '✓ Nomzodlar '}
                  {m.permissions.viewBilling && '✓ Billing '}
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: m.status === 'Active' ? '#dcfce7' : '#fffbeb',
                    color: m.status === 'Active' ? '#15803d' : '#b45309',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}>
                    {m.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => setTeam(team.filter(t => t.id !== m.id))} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                    O'chirish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.25rem' }}>+ Xodim qo‘shish</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="recruiter@company.uz" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Ism-familiya *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Madina Aliyeva" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Rol *</label>
                <select value={role} onChange={e => setRole(e.target.value as any)} style={inputStyle}>
                  <option value="Recruiter">Recruiter</option>
                  <option value="HR Admin">HR Admin</option>
                  <option value="Hiring Manager">Hiring Manager</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Ruxsatlar (Permissions):</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={perms.createVacancy} onChange={e => setPerms({ ...perms, createVacancy: e.target.checked })} /> ☑ Vakansiya yaratish</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={perms.editVacancy} onChange={e => setPerms({ ...perms, editVacancy: e.target.checked })} /> ☑ Vakansiya tahrirlash</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={perms.viewCandidates} onChange={e => setPerms({ ...perms, viewCandidates: e.target.checked })} /> ☑ Nomzodlarni ko‘rish</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={perms.editCandidates} onChange={e => setPerms({ ...perms, editCandidates: e.target.checked })} /> ☑ Nomzodlarni tahrirlash</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={perms.viewBilling} onChange={e => setPerms({ ...perms, viewBilling: e.target.checked })} /> ☐ To‘lovlarni ko‘rish</label>
                  <label style={checkboxLabelStyle}><input type="checkbox" checked={perms.companySettings} onChange={e => setPerms({ ...perms, companySettings: e.target.checked })} /> ☐ Kompaniya sozlamalarini o‘zgartirish</label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowAddModal(false)} style={cancelBtnStyle}>Bekor qilish</button>
              <button onClick={handleAddMember} style={primaryBtnStyle}>Taklif yuborish</button>
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
const checkboxLabelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '90%' }
const cancelBtnStyle: React.CSSProperties = { padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 600, cursor: 'pointer' }
const primaryBtnStyle: React.CSSProperties = { padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }
