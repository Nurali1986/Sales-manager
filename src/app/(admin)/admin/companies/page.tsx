'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialAdminCompanies, AdminCompany } from '@/lib/mockAdminData'

export default function AdminCompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<AdminCompany[]>(initialAdminCompanies)
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending' | 'blocked' | 'rejected'>('all')
  const [search, setSearch] = useState('')

  const [verificationModalCompany, setVerificationModalCompany] = useState<AdminCompany | null>(null)
  const [showRejectionForm, setShowRejectionForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('Hujjat yetishmaydi')
  const [rejectNote, setRejectNote] = useState('')

  const tabs = [
    { id: 'all', label: 'Barchasi', count: companies.length },
    { id: 'verified', label: 'Faol (Verified)', count: companies.filter(c => c.status === 'verified').length },
    { id: 'pending', label: 'Tasdiqlash kutilmoqda', count: companies.filter(c => c.status === 'pending').length },
    { id: 'blocked', label: 'Bloklangan', count: companies.filter(c => c.status === 'blocked').length },
    { id: 'rejected', label: 'Rad etilgan', count: companies.filter(c => c.status === 'rejected').length },
  ]

  const filtered = companies.filter(c => {
    if (activeTab !== 'all' && c.status !== activeTab) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.inn.includes(search) && !c.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleApproveCompany = (id: string) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: 'verified' } : c))
    setVerificationModalCompany(null)
    setShowRejectionForm(false)
  }

  const handleRejectCompany = () => {
    if (!verificationModalCompany) return
    setCompanies(companies.map(c => c.id === verificationModalCompany.id ? { ...c, status: 'rejected' } : c))
    setVerificationModalCompany(null)
    setShowRejectionForm(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          🏢 Kompaniyalar Boshqaruvi & Verifikatsiya
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Platformada ro'yxatdan o'tgan barcha kompaniyalar, INN verifikatsiyasi va ruxsatlar.
        </p>
      </div>

      {/* Search & Filters */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.25rem',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input
            type="text"
            placeholder="Kompaniya nomi / INN / Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
          />
        </div>

        <select style={selectStyle}><option>Status: Barchasi</option></select>
        <select style={selectStyle}><option>Shahar: Barchasi</option></select>
        <select style={selectStyle}><option>Tarif: Barchasi</option></select>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                borderBottom: isActive ? '3px solid #dc2626' : '3px solid transparent',
                color: isActive ? '#dc2626' : '#64748b',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {tab.label}
              <span style={{
                backgroundColor: isActive ? '#fef2f2' : '#f1f5f9',
                color: isActive ? '#dc2626' : '#64748b',
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Companies List Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={thStyle}>Kompaniya</th>
              <th style={thStyle}>INN & Aloqa</th>
              <th style={thStyle}>HR Menejer</th>
              <th style={thStyle}>Metrikalar</th>
              <th style={thStyle}>Tarif</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>
                  <Link href={`/admin/companies/${c.id}`} style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', textDecoration: 'none' }}>
                    🏢 {c.name}
                  </Link>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: #{c.id} • {c.industry}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 700 }}>INN: {c.inn}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.phone} • {c.email}</div>
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{c.hrManager}</td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '0.85rem' }}>💼 <strong>{c.vacanciesCount}</strong> vakansiya</div>
                  <div style={{ fontSize: '0.85rem' }}>👥 <strong>{c.candidatesCount}</strong> nomzod</div>
                </td>
                <td style={tdStyle}>
                  <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                    {c.plan}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: c.status === 'verified' ? '#dcfce7' : c.status === 'pending' ? '#fffbeb' : '#fef2f2',
                    color: c.status === 'verified' ? '#15803d' : c.status === 'pending' ? '#b45309' : '#dc2626',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px'
                  }}>
                    {c.status === 'verified' ? '🟢 Verified' : c.status === 'pending' ? '🟡 Verification Pending' : '🔴 ' + c.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {c.status === 'pending' && (
                      <button
                        onClick={() => setVerificationModalCompany(c)}
                        style={{ padding: '0.4rem 0.75rem', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Verifikatsiya
                      </button>
                    )}
                    <Link
                      href={`/admin/companies/${c.id}`}
                      style={{ padding: '0.4rem 0.75rem', backgroundColor: '#f1f5f9', color: '#1e293b', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}
                    >
                      Ochish ➔
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verification Inspector Modal */}
      {verificationModalCompany && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '520px' }}>
            <h3 style={{ marginTop: 0, fontWeight: 900, fontSize: '1.25rem', color: '#0f172a' }}>
              🛡️ Kompaniya verifikatsiyasi
            </h3>

            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, color: '#92400e', fontSize: '1rem' }}>🟡 Verification Pending</div>
              <div style={{ fontSize: '0.85rem', color: '#b45309', marginTop: '0.3rem' }}>
                Kompaniya: <strong>{verificationModalCompany.name}</strong><br />
                INN: <strong>{verificationModalCompany.inn}</strong> | Phone: <strong>{verificationModalCompany.phone}</strong><br />
                Email: <strong>{verificationModalCompany.email}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Biriktirilgan Hujjatlar:</div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => alert('📄 Certificate.pdf hujjati yuklandi va ko\'rildi.')} style={docBtnStyle}>
                  📄 Certificate.pdf
                </button>
                <button onClick={() => alert('📄 License.pdf hujjati yuklandi va ko\'rildi.')} style={docBtnStyle}>
                  📄 License.pdf
                </button>
              </div>
            </div>

            {!showRejectionForm ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => setShowRejectionForm(true)} style={{ ...cancelBtnStyle, color: '#dc2626', borderColor: '#fca5a5' }}>
                  ❌ Rad etish
                </button>
                <button onClick={() => handleApproveCompany(verificationModalCompany.id)} style={approveBtnStyle}>
                  🟢 Tasdiqlash
                </button>
              </div>
            ) : (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: '#991b1b' }}>Rad etish sababi *</label>
                <select value={rejectReason} onChange={e => setRejectReason(e.target.value)} style={inputStyle}>
                  <option value="Ma'lumot noto‘g‘ri">Ma'lumot noto‘g‘ri</option>
                  <option value="Hujjat yetishmaydi">Hujjat yetishmaydi</option>
                  <option value="Kompaniya topilmadi">Kompaniya topilmadi</option>
                  <option value="Boshqa">Boshqa</option>
                </select>

                <textarea
                  rows={2}
                  value={rejectNote}
                  onChange={e => setRejectNote(e.target.value)}
                  placeholder="Kompaniyaga izoh..."
                  style={{ ...inputStyle, fontFamily: 'inherit' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => setShowRejectionForm(false)} style={cancelBtnStyle}>Orqaga</button>
                  <button onClick={handleRejectCompany} style={{ ...approveBtnStyle, backgroundColor: '#dc2626' }}>Rad etishni tasdiqlash</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }
const tdStyle: React.CSSProperties = { padding: '1rem 1.25rem', fontSize: '0.9rem' }
const selectStyle: React.CSSProperties = { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#ffffff' }
const docBtnStyle: React.CSSProperties = { padding: '0.5rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '90%' }
const cancelBtnStyle: React.CSSProperties = { padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 600, cursor: 'pointer' }
const approveBtnStyle: React.CSSProperties = { padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 800, cursor: 'pointer' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }
