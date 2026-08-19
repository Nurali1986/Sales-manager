'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LanguageSelector } from '@/components/LanguageSelector'
import { useCurrentCandidate } from '@/lib/candidate/useCurrentCandidate'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

const navItems: NavItem[] = [
  { label: 'Bosh sahifa', href: '/candidate/dashboard', icon: '🏠' },
  { label: 'Ish qidirish', href: '/candidate/jobs', icon: '🔎' },
  { label: 'Mening arizalarim', href: '/candidate/applications', icon: '📋', badge: 8 },
  { label: 'Saqlangan vakansiyalar', href: '/candidate/favorites', icon: '⭐', badge: 12 },
  { label: 'Xabarlar', href: '/candidate/messages', icon: '💬', badge: 1 },
  { label: 'Intervyular', href: '/candidate/interviews', icon: '📅', badge: 2 },
  { label: 'Mening rezyumem', href: '/candidate/resume', icon: '📄' },
  { label: 'Bildirishnomalar', href: '/candidate/notifications', icon: '🔔' },
  { label: 'Sozlamalar', href: '/candidate/settings', icon: '⚙️' },
]

export default function CandidateWorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { candidate, fullName, initials, completeness, isLoading } = useCurrentCandidate()

  const notifications = [
    { id: 1, text: '🔵 TechCompany sizning arizangizni ko‘rib chiqdi.', time: '10 daqiqa oldin', link: '/candidate/applications' },
    { id: 2, text: '📅 Sizga HR interview belgilandi.', time: '1 soat oldin', link: '/candidate/interviews' },
    { id: 3, text: '💬 Madina sizga yangi xabar yubordi.', time: '2 soat oldin', link: '/candidate/messages' },
    { id: 4, text: '🎯 Sizga mos 5 ta yangi vakansiya topildi.', time: '1 kun oldin', link: '/candidate/jobs' }
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/candidate/jobs?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/candidate/auth/logout', { method: 'POST', credentials: 'include' })
    setShowUserMenu(false)
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 90,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Responsive Sidebar Navigation */}
      <aside style={{
        width: '270px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxShadow: '4px 0 16px rgba(0,0,0,0.06)',
        zIndex: 100,
        flexShrink: 0,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }} className={`candidate-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/candidate/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.2rem',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
            }}>
              hh
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                Candidate Hub
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                Ish Izlovchi Kabineti
              </div>
            </div>
          </Link>

          {/* Close Mobile Drawer */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.4rem',
              cursor: 'pointer'
            }}
            className="mobile-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '1rem 0.85rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/candidate/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    backgroundColor: isActive ? '#10b981' : 'transparent',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ fontSize: '1.15rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      backgroundColor: isActive ? '#ffffff' : '#059669',
                      color: isActive ? '#059669' : '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
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

        {/* Profile Completeness Footer Widget */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid #1e293b',
          backgroundColor: '#0b1120',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1' }}>
            <span>Profil to'liqligi</span>
            <span style={{ color: '#10b981', fontWeight: 900 }}>{completeness}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${completeness}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '9999px' }} />
          </div>
        </div>
      </aside>

      {/* Main Surface Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Sticky Header Navbar */}
        <header className="candidate-header" style={{
          minHeight: '68px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          
          {/* Mobile Hamburger Button + Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#0f172a',
                padding: '0.25rem'
              }}
              className="mobile-hamburger-btn"
              title="Open Navigation"
            >
              ☰
            </button>

            {/* Global Search Input */}
            <form onSubmit={handleSearchSubmit} style={{ width: '320px', maxWidth: '100%', position: 'relative' }} className="header-search-form">
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}>
                🔍
              </span>
              <input
                type="text"
                placeholder="Ish yoki kompaniya qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 1rem 0.55rem 2.5rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  fontWeight: 500
                }}
              />
            </form>
          </div>

          {/* Right User & Notification Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }} className="header-actions">
            <LanguageSelector compact />

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  position: 'relative'
                }}
                title="Bildirishnomalar"
              >
                🔔
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }} />
              </button>

              {showNotifs && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  width: '320px',
                  maxWidth: 'calc(100vw - 2rem)',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  zIndex: 100
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                    Bildirishnomalar
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {notifications.map(n => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => setShowNotifs(false)}
                        style={{
                          textDecoration: 'none',
                          padding: '0.65rem',
                          borderRadius: '8px',
                          backgroundColor: '#f8fafc',
                          display: 'block',
                          border: '1px solid #f1f5f9'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{n.text}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{n.time}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Candidate User Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '10px'
                }}
              >
                <div style={{
                  width: '38px',
                  minWidth: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                }}>
                  {isLoading ? '...' : initials}
                </div>
                <div style={{ textAlign: 'left' }} className="user-name-text">
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    {fullName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                    {candidate?.city || 'Nomzod Kabineti'} ▼
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '52px',
                  width: '200px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem',
                  zIndex: 100
                }}>
                  <Link href="/candidate/profile" onClick={() => setShowUserMenu(false)} style={dropdownItemStyle}>👤 Mening profilim</Link>
                  <Link href="/candidate/resume" onClick={() => setShowUserMenu(false)} style={dropdownItemStyle}>📄 Mening rezyumem</Link>
                  <Link href="/candidate/settings" onClick={() => setShowUserMenu(false)} style={dropdownItemStyle}>⚙️ Sozlamalar</Link>
                  <hr style={{ margin: '0.35rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <button onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444', width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer' }}>🚪 Chiqish</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Responsive View Surface */}
        <main className="candidate-main" style={{ flex: 1, padding: '1.75rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>

      {/* Global CSS for Mobile Responsiveness & Typography */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
          .candidate-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
          }
          .candidate-sidebar.mobile-open {
            transform: translateX(0) !important;
          }
          .mobile-hamburger-btn {
            display: block !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
          .header-search-form {
            width: min(52vw, 220px) !important;
          }
          .header-actions {
            gap: 0.45rem !important;
          }
          .user-name-text {
            display: none !important;
          }
          .candidate-main {
            padding: 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .candidate-header {
            padding: 0.65rem 0.85rem !important;
            gap: 0.5rem;
          }
          .header-search-form {
            width: min(44vw, 170px) !important;
          }
          .candidate-main {
            padding: 0.85rem !important;
          }
          .candidate-sidebar {
            width: min(86vw, 270px) !important;
          }
        }
      `}</style>
    </div>
  )
}

const dropdownItemStyle: React.CSSProperties = { display: 'block', padding: '0.55rem 0.85rem', fontSize: '0.875rem', color: '#1e293b', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }
