'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialVacancies, Vacancy } from '@/lib/mockHrData'

export default function VacanciesPage() {
  const router = useRouter()
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies)
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'moderation' | 'rejected' | 'archived' | 'template'>('active')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const tabs = [
    { id: 'active', label: 'Faol', count: vacancies.filter(v => v.status === 'active').length },
    { id: 'draft', label: 'Qoralamalar', count: vacancies.filter(v => v.status === 'draft').length },
    { id: 'moderation', label: 'Moderatsiyada', count: vacancies.filter(v => v.status === 'moderation').length },
    { id: 'rejected', label: 'Rad etilgan', count: vacancies.filter(v => v.status === 'rejected').length },
    { id: 'archived', label: 'Arxiv', count: vacancies.filter(v => v.status === 'archived').length },
    { id: 'template', label: 'Shablonlar', count: vacancies.filter(v => v.status === 'template').length },
  ]

  const filteredVacancies = vacancies.filter((v) => {
    if (v.status !== activeTab) return false
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false
    if (selectedCity !== 'all' && v.location !== selectedCity) return false
    return true
  })

  const handleAction = (id: string, action: string) => {
    setOpenMenuId(null)
    if (action === 'view') {
      router.push(`/hr/vacancies/${id}`)
    } else if (action === 'edit') {
      router.push(`/hr/vacancies/create?editId=${id}`)
    } else if (action === 'applications') {
      router.push(`/hr/vacancies/${id}?tab=applications`)
    } else if (action === 'duplicate') {
      const target = vacancies.find(v => v.id === id)
      if (target) {
        const copy: Vacancy = {
          ...target,
          id: `vac-${Date.now()}`,
          title: `${target.title} (Nusxa)`,
          status: 'draft',
          applicationsCount: 0,
          viewsCount: 0
        }
        setVacancies([copy, ...vacancies])
      }
    } else if (action === 'pause') {
      setVacancies(vacancies.map(v => v.id === id ? { ...v, status: 'draft' } : v))
    } else if (action === 'archive') {
      setVacancies(vacancies.map(v => v.id === id ? { ...v, status: 'archived' } : v))
    } else if (action === 'delete') {
      setVacancies(vacancies.filter(v => v.id !== id))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Vakansiyalar
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Kompaniyangizning barcha faol, qoralama va arxivlangan vakansiyalarini boshqaring.
          </p>
        </div>
        <Link
          href="/hr/vacancies/create"
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          + Yangi vakansiya
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input
            type="text"
            placeholder="Qidirish (lavozim bo'yicha)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            backgroundColor: '#ffffff'
          }}
        >
          <option value="all">Kategoriya: Barchasi</option>
          <option value="IT">IT</option>
          <option value="Marketing">Marketing</option>
          <option value="Sotuv">Sotuv</option>
          <option value="HR">HR</option>
        </select>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            backgroundColor: '#ffffff'
          }}
        >
          <option value="all">Shahar: Barchasi</option>
          <option value="Toshkent">Toshkent</option>
          <option value="Samarqand">Samarqand</option>
          <option value="Buxoro">Buxoro</option>
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem' }}>
        {tabs.map((tab) => {
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
                borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
                color: isActive ? '#2563eb' : '#64748b',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {tab.label}
              <span style={{
                backgroundColor: isActive ? '#eff6ff' : '#f1f5f9',
                color: isActive ? '#2563eb' : '#64748b',
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Vacancies List Cards */}
      {filteredVacancies.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          padding: '3rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          color: '#64748b'
        }}>
          Ushbu bo'limda vakansiyalar topilmadi.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredVacancies.map((v) => (
            <div
              key={v.id}
              style={{
                backgroundColor: '#ffffff',
                padding: '1.25rem 1.5rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                position: 'relative'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{v.title}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    backgroundColor: v.workType === 'remote' ? '#f0fdf4' : v.workType === 'hybrid' ? '#fffbeb' : '#eff6ff',
                    color: v.workType === 'remote' ? '#166534' : v.workType === 'hybrid' ? '#92400e' : '#1e40af',
                    fontWeight: 700
                  }}>
                    {v.workType === 'remote' ? 'Remote' : v.workType === 'hybrid' ? 'Gibrid' : 'Ofis'}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <span>📂 {v.category} / {v.specialty}</span>
                  <span>📍 {v.location}</span>
                  <span>💰 {v.minSalary && v.maxSalary ? `${(v.minSalary / 1000000).toFixed(0)}–${(v.maxSalary / 1000000).toFixed(0)} mln so‘m` : 'Maosh kelishilgan'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#475569' }}>
                  <div>👁 <strong>{v.viewsCount}</strong> ko‘rish</div>
                  <div>📩 <strong>{v.applicationsCount}</strong> ariza</div>
                  <div>📅 <strong>{v.daysLeft}</strong> kun qoldi</div>
                </div>

                <button
                  onClick={() => router.push(`/hr/vacancies/${v.id}`)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Ochish
                </button>

                {/* Dropdown Menu */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === v.id ? null : v.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '0.4rem 0.75rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 800
                    }}
                  >
                    ⋮
                  </button>

                  {openMenuId === v.id && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '40px',
                      width: '200px',
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
                      padding: '0.4rem',
                      zIndex: 50
                    }}>
                      <button onClick={() => handleAction(v.id, 'view')} style={menuItemStyle}>👁 Ko‘rish</button>
                      <button onClick={() => handleAction(v.id, 'edit')} style={menuItemStyle}>✏️ Tahrirlash</button>
                      <button onClick={() => handleAction(v.id, 'applications')} style={menuItemStyle}>📩 Arizalarni ko‘rish</button>
                      <button onClick={() => handleAction(v.id, 'duplicate')} style={menuItemStyle}>📋 Nusxalash</button>
                      <button onClick={() => handleAction(v.id, 'pause')} style={menuItemStyle}>⏸ To‘xtatish</button>
                      <button onClick={() => handleAction(v.id, 'archive')} style={menuItemStyle}>📦 Arxivga yuborish</button>
                      <hr style={{ margin: '0.25rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                      <button onClick={() => handleAction(v.id, 'delete')} style={{ ...menuItemStyle, color: '#ef4444' }}>🗑 O‘chirish</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const menuItemStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#1e293b',
  cursor: 'pointer',
  borderRadius: '6px'
}
