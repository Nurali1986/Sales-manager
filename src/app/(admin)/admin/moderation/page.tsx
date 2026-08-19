'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface Vacancy {
  id: string
  title: string
  description: string | null
  department: string | null
  employmentType: string
  status: string
  salaryMin: number | null
  salaryMax: number | null
  currency: string | null
  createdAt: string
  companyName: string
  companyId: string
}

function formatSalary(min: number | null, max: number | null): string {
  if (min == null && max == null) return 'Ko\'rsatilmagan'
  const minVal = min != null ? (min / 1000000).toFixed(1) : '?'
  const maxVal = max != null ? (max / 1000000).toFixed(1) : '?'
  return `${minVal} – ${maxVal} mln so'm`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function AdminModerationPage() {
  const [allVacancies, setAllVacancies] = useState<Vacancy[]>([])
  const [selectedVac, setSelectedVac] = useState<Vacancy | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchVacancies = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/vacancies')
      const json = await res.json()
      if (json.data) {
        setAllVacancies(json.data)
      }
    } catch {
      alert('Vakansiyalarni yuklashda xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVacancies()
  }, [fetchVacancies])

  const pendingVacancies = allVacancies.filter(v => v.status === 'DRAFT')

  // Auto-select first pending vacancy when list changes
  useEffect(() => {
    if (pendingVacancies.length > 0) {
      const currentStillExists = selectedVac && pendingVacancies.find(v => v.id === selectedVac.id)
      if (!currentStillExists) {
        setSelectedVac(pendingVacancies[0])
      }
    } else {
      setSelectedVac(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allVacancies])

  const handleApprove = async (id: string) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/vacancies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id, status: 'ACTIVE' })
      })
      if (res.ok) {
        alert('✅ Vakansiya moderatsiyadan o\'tdi va Faol holatga o\'tkazildi!')
        await fetchVacancies()
      } else {
        alert('Xatolik yuz berdi')
      }
    } catch {
      alert('Tarmoq xatosi')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/vacancies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id, status: 'CLOSED' })
      })
      if (res.ok) {
        alert('❌ Vakansiya rad etildi.')
        await fetchVacancies()
      } else {
        alert('Xatolik yuz berdi')
      }
    } catch {
      alert('Tarmoq xatosi')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <p style={{ margin: 0, fontWeight: 600 }}>Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          🛡️ Vakansiya Moderatsiyasi
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          HR tomonidan yaratilgan vakansiyalarni tekshirish va tasdiqlash yoki rad etish.
        </p>
      </div>

      {/* Pending count badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{
          backgroundColor: '#fffbeb',
          color: '#b45309',
          fontWeight: 700,
          padding: '0.35rem 0.85rem',
          borderRadius: '8px',
          fontSize: '0.85rem'
        }}>
          🕐 Kutilmoqda: {pendingVacancies.length} ta
        </span>
      </div>

      {/* Empty state */}
      {pendingVacancies.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '4rem 2rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>
            Hozircha moderatsiyada vakansiyalar yo&apos;q
          </h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
            Barcha vakansiyalar tekshirilgan. Yangi vakansiyalar paydo bo&apos;lganda bu yerda ko&apos;rinadi.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left: Vacancy List */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #e2e8f0',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#0f172a'
            }}>
              📋 Kutilayotgan vakansiyalar
            </div>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {pendingVacancies.map(v => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVac(v)}
                  style={{
                    padding: '1rem 1.25rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: selectedVac?.id === v.id ? '#eff6ff' : 'transparent',
                    borderLeft: selectedVac?.id === v.id ? '3px solid #3b82f6' : '3px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                    {v.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.35rem' }}>
                    🏢 {v.companyName}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      backgroundColor: '#fffbeb',
                      color: '#b45309',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem'
                    }}>
                      🟡 Kutilmoqda
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {formatDate(v.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Vacancy Details */}
          {selectedVac ? (
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    {selectedVac.title}
                  </h2>
                  <div style={{ fontSize: '1rem', color: '#dc2626', fontWeight: 800, marginTop: '0.2rem' }}>
                    🏢 {selectedVac.companyName}
                  </div>
                </div>
                <span style={{
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  fontWeight: 800,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}>
                  🟡 Moderation Pending
                </span>
              </div>

              <div style={{
                display: 'flex',
                gap: '1.25rem',
                fontSize: '0.9rem',
                color: '#64748b',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '1rem',
                flexWrap: 'wrap'
              }}>
                <span>📍 {selectedVac.department || 'Ko\'rsatilmagan'}</span>
                <span>💰 Maosh: {formatSalary(selectedVac.salaryMin, selectedVac.salaryMax)}</span>
                <span>📂 Turi: {selectedVac.employmentType}</span>
                <span>📅 Yaratilgan: {formatDate(selectedVac.createdAt)}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: 800, color: '#0f172a' }}>📝 Tavsif:</h4>
                  <p style={{
                    margin: 0,
                    color: '#334155',
                    lineHeight: 1.7,
                    fontSize: '0.9rem',
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '8px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedVac.description || 'Tavsif mavjud emas'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#ffffff',
              padding: '3rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👈</div>
              <p style={{ margin: 0, fontWeight: 600 }}>Vakansiya tanlang</p>
            </div>
          )}

          {/* Right: Moderation Checklist Panel */}
          {selectedVac && (
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
                ✅ Moderation Checklist
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <label style={checkItemStyle}><input type="checkbox" defaultChecked /> Company verified</label>
                <label style={checkItemStyle}><input type="checkbox" defaultChecked /> Job title valid</label>
                <label style={checkItemStyle}><input type="checkbox" defaultChecked /> Salary valid</label>
                <label style={checkItemStyle}><input type="checkbox" defaultChecked /> Category valid</label>
                <label style={checkItemStyle}><input type="checkbox" defaultChecked /> Location valid</label>
                <label style={checkItemStyle}><input type="checkbox" defaultChecked /> Description valid</label>
                <label style={checkItemStyle}><input type="checkbox" defaultChecked /> No prohibited content</label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button
                  onClick={() => handleReject(selectedVac.id)}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '1px solid #fca5a5',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.6 : 1
                  }}
                >
                  ❌ Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedVac.id)}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.6 : 1
                  }}
                >
                  🟢 Approve
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const checkItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  fontWeight: 600,
  color: '#1e293b'
}
