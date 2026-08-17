'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LanguageSelector } from '@/components/LanguageSelector'
import { initialAdminCompanies, initialAdminUsers, initialAdminVacancies, initialAdminPayments } from '@/lib/mockAdminData'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
  { label: 'Kompaniyalar', href: '/admin/companies', icon: '🏢', badge: 14 },
  { label: 'Foydalanuvchilar', href: '/admin/users', icon: '👥' },
  { label: 'Vakansiyalar', href: '/admin/vacancies', icon: '💼' },
  { label: 'Rezumelar', href: '/admin/resumes', icon: '📄' },
  { label: 'Moderatsiya', href: '/admin/moderation', icon: '🛡️', badge: 27 },
  { label: 'Arizalar', href: '/admin/applications', icon: '📩' },
  { label: 'Intervyular', href: '/admin/interviews', icon: '📅' },
  { label: 'To‘lovlar', href: '/admin/payments', icon: '💳' },
  { label: 'Tariflar', href: '/admin/plans', icon: '📦' },
  { label: 'Analitika', href: '/admin/analytics', icon: '📊' },
  { label: 'Kategoriyalar', href: '/admin/categories', icon: '🗂️' },
  { label: 'Hududlar', href: '/admin/locations', icon: '📍' },
  { label: 'Bildirishnomalar', href: '/admin/notifications', icon: '🔔' },
  { label: 'Support', href: '/admin/support', icon: '🎟️', badge: 32 },
  { label: 'Platforma sozlamalari', href: '/admin/settings', icon: '⚙️' },
  { label: 'Audit Log', href: '/admin/audit', icon: '📝' },
]

export default function AdminWorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showGlobalSearchModal, setShowGlobalSearchModal] = useState(false)
  const [globalQuery, setGlobalQuery] = useState('')

  const notifications = [
    { id: 1, text: '🔴 14 ta kompaniya tasdiqlashni kutmoqda', time: '5 daqiqa oldin', link: '/admin/companies' },
    { id: 2, text: '🔴 27 ta vakansiya moderatsiyada', time: '12 daqiqa oldin', link: '/admin/moderation' },
    { id: 3, text: '🟠 8 ta scam shikoyat keldi', time: '1 soat oldin', link: '/admin/reports' },
    { id: 4, text: '💳 TX-928183 to\'lovi muvaffaqiyatsiz bo\'ldi', time: '2 soat oldin', link: '/admin/payments' }
  ]

  // Multi-Entity Global Search Filtering
  const matchedCompanies = initialAdminCompanies.filter(c => c.name.toLowerCase().includes(globalQuery.toLowerCase()) || c.inn.includes(globalQuery))
  const matchedUsers = initialAdminUsers.filter(u => u.name.toLowerCase().includes(globalQuery.toLowerCase()) || u.email.toLowerCase().includes(globalQuery.toLowerCase()))
  const matchedVacancies = initialAdminVacancies.filter(v => v.title.toLowerCase().includes(globalQuery.toLowerCase()) || v.companyName.toLowerCase().includes(globalQuery.toLowerCase()))
  const matchedPayments = initialAdminPayments.filter(p => p.transactionId.toLowerCase().includes(globalQuery.toLowerCase()) || p.companyName.toLowerCase().includes(globalQuery.toLowerCase()))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 1. Sidebar Navigation */}
      <aside style={{
        width: '270px',
        backgroundColor: '#090d16',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxShadow: '4px 0 16px rgba(0,0,0,0.2)',
        zIndex: 50,
        flexShrink: 0
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.25rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.25rem',
            color: '#ffffff'
          }}>
            🛡️
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              SuperAdmin Hub
            </div>
            <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>
              Root System Governance
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '0.75rem 0.6rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    backgroundColor: isActive ? '#dc2626' : 'transparent',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <span style={{ fontSize: '1.05rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      backgroundColor: isActive ? '#ffffff' : '#b91c1c',
                      color: isActive ? '#dc2626' : '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Security Footer */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid #1e293b',
          backgroundColor: '#05070d',
          fontSize: '0.75rem',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700
        }}>
          🟢 2FA Enforced • Session Encrypted
        </div>
      </aside>

      {/* Main App Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#f8fafc', color: '#0f172a' }}>
        {/* Top Header */}
        <header style={{
          height: '64px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
          {/* Global Search Trigger */}
          <button
            onClick={() => setShowGlobalSearchModal(true)}
            style={{
              width: '380px',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              backgroundColor: '#f8fafc',
              color: '#64748b',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <span>🔍 Global search (Kompaniya, User, Vakansiya...)...</span>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>⌘K</span>
          </button>

          {/* Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <LanguageSelector compact />

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '0.4rem', position: 'relative' }}
                title="SuperAdmin Notifications"
              >
                🔔
                <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: '#dc2626', borderRadius: '50%' }} />
              </button>

              {showNotifs && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '42px',
                  width: '340px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  zIndex: 100
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                    SuperAdmin Ogohlantirishlar
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.map(n => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => setShowNotifs(false)}
                        style={{ textDecoration: 'none', padding: '0.5rem', borderRadius: '6px', backgroundColor: '#f8fafc', display: 'block' }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{n.text}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{n.time}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Support Link */}
            <Link href="/admin/support" style={{ fontSize: '1.25rem', textDecoration: 'none' }} title="Support Tickets">
              🎟️
            </Link>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '8px' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dc2626', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                  SA
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
                    SuperAdmin
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>
                    Root Access ▼
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div style={{ position: 'absolute', right: 0, top: '48px', width: '190px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', padding: '0.5rem', zIndex: 100 }}>
                  <Link href="/admin/settings" onClick={() => setShowUserMenu(false)} style={dropdownItemStyle}>👤 Mening profilim</Link>
                  <Link href="/admin/settings" onClick={() => setShowUserMenu(false)} style={dropdownItemStyle}>🔐 Xavfsizlik & 2FA</Link>
                  <Link href="/admin/audit" onClick={() => setShowUserMenu(false)} style={dropdownItemStyle}>📜 Active Sessions</Link>
                  <hr style={{ margin: '0.35rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <Link href="/" onClick={() => setShowUserMenu(false)} style={{ ...dropdownItemStyle, color: '#ef4444' }}>🚪 Chiqish</Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View Surface */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1450px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>

      {/* Global Multi-Entity Search Modal */}
      {showGlobalSearchModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '650px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.25rem' }}>🔍 Global Multi-Entity Qidiruv</h3>
              <button onClick={() => setShowGlobalSearchModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <input
              type="text"
              autoFocus
              placeholder="Qidirilayotgan kalit so'z (kompaniya, INN, email, vakansiya ID)..."
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '2px solid #dc2626', fontSize: '1rem', outline: 'none', marginBottom: '1.25rem' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
              {/* Companies Match */}
              {matchedCompanies.length > 0 && (
                <div>
                  <div style={searchCatHeader}>🏢 Kompaniyalar ({matchedCompanies.length})</div>
                  {matchedCompanies.map(c => (
                    <div key={c.id} onClick={() => { setShowGlobalSearchModal(false); router.push(`/admin/companies/${c.id}`) }} style={searchResultItemStyle}>
                      <strong>{c.name}</strong> • INN: {c.inn} ({c.status})
                    </div>
                  ))}
                </div>
              )}

              {/* Users Match */}
              {matchedUsers.length > 0 && (
                <div>
                  <div style={searchCatHeader}>👥 Foydalanuvchilar ({matchedUsers.length})</div>
                  {matchedUsers.map(u => (
                    <div key={u.id} onClick={() => { setShowGlobalSearchModal(false); router.push(`/admin/users`) }} style={searchResultItemStyle}>
                      <strong>{u.name}</strong> • {u.email} ({u.role})
                    </div>
                  ))}
                </div>
              )}

              {/* Vacancies Match */}
              {matchedVacancies.length > 0 && (
                <div>
                  <div style={searchCatHeader}>💼 Vakansiyalar ({matchedVacancies.length})</div>
                  {matchedVacancies.map(v => (
                    <div key={v.id} onClick={() => { setShowGlobalSearchModal(false); router.push(`/admin/vacancies`) }} style={searchResultItemStyle}>
                      <strong>{v.title}</strong> • {v.companyName} ({v.status})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const dropdownItemStyle: React.CSSProperties = { display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#1e293b', textDecoration: 'none', borderRadius: '6px', fontWeight: 600 }
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '90%' }
const searchCatHeader: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', marginBottom: '0.35rem' }
const searchResultItemStyle: React.CSSProperties = { padding: '0.55rem 0.75rem', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.35rem', cursor: 'pointer' }
