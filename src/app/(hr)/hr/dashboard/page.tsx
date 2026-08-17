'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialVacancies } from '@/lib/mockHrData'

export default function HRDashboardPage() {
  const router = useRouter()
  const [alertModal, setAlertModal] = useState<string | null>(null)

  const stats = [
    { label: 'Faol vakansiyalar', count: 12, color: '#2563eb', bg: '#eff6ff', link: '/hr/vacancies?status=active' },
    { label: 'Yangi arizalar', count: 48, color: '#dc2626', bg: '#fef2f2', link: '/hr/candidates?status=new' },
    { label: 'Ko‘rib chiqilmoqda', count: 17, color: '#d97706', bg: '#fffbeb', link: '/hr/candidates?status=screening' },
    { label: 'Intervyular', count: 8, color: '#7c3aed', bg: '#f5f3ff', link: '/hr/interviews' },
    { label: 'Taklif yuborilgan', count: 3, color: '#0284c7', bg: '#f0f9ff', link: '/hr/candidates?status=offer' },
    { label: 'Ishga qabul qilingan', count: 2, color: '#16a34a', bg: '#f0fdf4', link: '/hr/candidates?status=hired' },
  ]

  const activeVacancies = initialVacancies.filter(v => v.status === 'active')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header & Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '1.5rem 2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Salom, Azizbek 👋
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Kompaniyangiz recruitment workspace boshqaruv paneliga xush kelibsiz.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link
            href="/hr/vacancies/create"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
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
            ➕ Vakansiya yaratish
          </Link>
          <Link
            href="/hr/resumes"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: '#f1f5f9',
              color: '#1e293b',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              border: '1px solid #cbd5e1'
            }}
          >
            🔎 Nomzod qidirish
          </Link>
        </div>
      </div>

      {/* 2. Statistical Cards */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
          Asosiy ko'rsatkichlar
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem'
        }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              onClick={() => router.push(stat.link)}
              style={{
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
              className="card-hover-effect"
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>
                {stat.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: stat.color }}>
                  {stat.count}
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                  fontWeight: 700,
                  fontSize: '1rem'
                }}>
                  ➔
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. "Diqqat talab qiladi" Section */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⚡ Diqqat talab qiladi
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div
            onClick={() => setAlertModal('new_apps')}
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.95rem' }}>🔴 5 ta yangi ariza</div>
              <div style={{ fontSize: '0.8rem', color: '#b91c1c', marginTop: '0.25rem' }}>QA Engineer va Sales Manager lavozimlariga</div>
            </div>
            <span style={{ fontWeight: 700, color: '#991b1b' }}>Ko'rish ➔</span>
          </div>

          <div
            onClick={() => setAlertModal('interviews')}
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem' }}>🟠 3 ta intervyu bugun</div>
              <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '0.25rem' }}>09:00, 14:00 va 16:30 suhbatlar rejalashtirilgan</div>
            </div>
            <span style={{ fontWeight: 700, color: '#92400e' }}>Jadval ➔</span>
          </div>

          <div
            onClick={() => setAlertModal('expiring')}
            style={{
              backgroundColor: '#fefce8',
              border: '1px solid #fef08a',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#854d0e', fontSize: '0.95rem' }}>🟡 2 ta vakansiya 5 kundan keyin tugaydi</div>
              <div style={{ fontSize: '0.8rem', color: '#a16207', marginTop: '0.25rem' }}>Sales Manager muddati tugamoqda</div>
            </div>
            <span style={{ fontWeight: 700, color: '#854d0e' }}>Uzatish ➔</span>
          </div>
        </div>
      </div>

      {/* 4. Active Vacancies Widget */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Faol vakansiyalar
          </h2>
          <Link
            href="/hr/vacancies"
            style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
          >
            [ Barchasini ko‘rish ]
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {activeVacancies.map((vac) => (
            <div
              key={vac.id}
              onClick={() => router.push(`/hr/vacancies/${vac.id}`)}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                backgroundColor: '#fafafa',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{vac.title}</div>
                <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  🟢 Faol
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                <div>📩 <strong>{vac.applicationsCount}</strong> ariza</div>
                <div>👁 <strong>{vac.viewsCount}</strong> ko'rish</div>
                <div>📅 <strong>{vac.daysLeft}</strong> kun qoldi</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Details Modal */}
      {alertModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: 0 }}>
              {alertModal === 'new_apps' && '🔴 Yangi arizalar'}
              {alertModal === 'interviews' && '🟠 Bugungi intervyular'}
              {alertModal === 'expiring' && '🟡 Tugayotgan vakansiyalar'}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              {alertModal === 'new_apps' && '5 ta yangi nomzod o\'z rezyumesini topshirdi. Ularni screening bosqichiga o\'tkazish uchun ariza sahifasiga o\'ting.'}
              {alertModal === 'interviews' && 'Bugun Muhammad Ali (09:00), Sardor Karimov (14:00) bilan suhbat rejalashtirilgan.'}
              {alertModal === 'expiring' && 'Sales Manager vakansiyasining joylanish muddati 5 kunda tugaydi. Muddati uzaytirilsinmi?'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setAlertModal(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Yopish
              </button>
              <button
                onClick={() => {
                  setAlertModal(null)
                  if (alertModal === 'new_apps') router.push('/hr/candidates?status=new')
                  if (alertModal === 'interviews') router.push('/hr/interviews')
                  if (alertModal === 'expiring') router.push('/hr/vacancies')
                }}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Tegishli sahifaga o'tish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
