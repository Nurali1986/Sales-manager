'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LanguageSelector } from '@/components/LanguageSelector'

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
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxShadow: '4px 0 12px rgba(0,0,0,0.05)',
        zIndex: 50,
        flexShrink: 0
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.2rem',
            color: '#ffffff'
          }}>
            hh
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Candidate Hub
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
              Ish Izlovchi Workspace
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/candidate/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '8px',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    backgroundColor: isActive ? '#10b981' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      backgroundColor: isActive ? '#ffffff' : '#059669',
                      color: isActive ? '#059669' : '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
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

        {/* Profile Progress Footer Widget */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid #1e293b',
          backgroundColor: '#0b1120',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>
            <span>Profil to'liqligi</span>
            <span style={{ color: '#10b981', fontWeight: 800 }}>80%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '80%', height: '100%', backgroundColor: '#10b981' }} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
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
          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ width: '380px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Ish yoki kompaniya qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.4rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                outline: 'none',
                backgroundColor: '#f8fafc'
              }}
            />
          </form>

          {/* User & Notification Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <LanguageSelector compact />

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
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
                  top: '42px',
                  width: '320px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  zIndex: 100
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                    Bildirishnomalar
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.map(n => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => setShowNotifs(false)}
                        style={{
                          textDecoration: 'none',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          backgroundColor: '#f8fafc',
                          display: 'block'
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

            {/* Candidate User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '8px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  EA
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
                    Elbek Abdullayev
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Candidate ▼
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  width: '180px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem',
                  zIndex: 100
                }}>
                  <Link
                    href="/candidate/profile"
                    onClick={() => setShowUserMenu(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#1e293b', textDecoration: 'none', borderRadius: '6px' }}
                  >
                    👤 Mening profilim
                  </Link>
                  <Link
                    href="/candidate/resume"
                    onClick={() => setShowUserMenu(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#1e293b', textDecoration: 'none', borderRadius: '6px' }}
                  >
                    📄 Mening rezyumem
                  </Link>
                  <Link
                    href="/candidate/settings"
                    onClick={() => setShowUserMenu(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#1e293b', textDecoration: 'none', borderRadius: '6px' }}
                  >
                    ⚙️ Sozlamalar
                  </Link>
                  <hr style={{ margin: '0.35rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <Link
                    href="/"
                    onClick={() => setShowUserMenu(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#ef4444', fontWeight: 600, textDecoration: 'none', borderRadius: '6px' }}
                  >
                    🚪 Chiqish
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main View Area */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
