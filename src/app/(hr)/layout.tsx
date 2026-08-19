'use client'

import React, { useState, useEffect } from 'react'
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
  { label: 'Bosh sahifa', href: '/hr/dashboard', icon: '🏠' },
  { label: 'Vakansiyalar', href: '/hr/vacancies', icon: '📋' },
  { label: 'Nomzodlar', href: '/hr/candidates', icon: '👥' },
  { label: 'Rezume qidirish', href: '/hr/resumes', icon: '🔎' },
  { label: 'Xabarlar', href: '/hr/messages', icon: '💬', badge: 2 },
  { label: 'Intervyular', href: '/hr/interviews', icon: '📅', badge: 3 },
  { label: 'Tanlanganlar', href: '/hr/favorites', icon: '⭐' },
  { label: 'Analitika', href: '/hr/analytics', icon: '📊' },
  { label: 'Kompaniya', href: '/hr/company', icon: '🏢' },
  { label: 'Jamoa', href: '/hr/team', icon: '👨‍💼' },
  { label: 'Tarif va to\'lovlar', href: '/hr/billing', icon: '💳' },
  { label: 'Sozlamalar', href: '/hr/settings', icon: '⚙️' },
]

export default function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [pathname, isMobile])

  const notifications = [
    { id: 1, text: '🔴 5 ta yangi ariza keldi', time: '10 daqiqa oldin', link: '/hr/candidates?status=new' },
    { id: 2, text: '🟠 3 ta intervyu bugun rejalashtirilgan', time: '1 soat oldin', link: '/hr/interviews' },
    { id: 3, text: '🟡 2 ta vakansiya 5 kundan keyin tugaydi', time: '2 soat oldin', link: '/hr/vacancies' },
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (globalSearch.trim()) {
      router.push(`/hr/candidates?search=${encodeURIComponent(globalSearch.trim())}`)
    }
  }

  // If page is /hr/login, render without sidebar layout
  if (pathname === '/hr/login') {
    return <>{children}</>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside style={{
        width: isMobile ? '280px' : '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: isMobile ? (sidebarOpen ? '0' : '-300px') : '0',
        height: '100vh',
        boxShadow: '4px 0 12px rgba(0,0,0,0.05)',
        zIndex: 100,
        flexShrink: 0,
        transition: 'left 0.3s ease',
        overflowY: 'auto',
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#ffffff',
              flexShrink: 0,
            }}>
              hh
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                HH Workspace
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                Recruitment Suite
              </div>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'none', border: 'none', color: '#94a3b8',
                fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/hr/dashboard' && pathname.startsWith(item.href))
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
                    backgroundColor: isActive ? '#2563eb' : 'transparent',
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
                      backgroundColor: isActive ? '#ffffff' : '#ef4444',
                      color: isActive ? '#2563eb' : '#ffffff',
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

        {/* Company Quick Footer Info */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid #1e293b',
          backgroundColor: '#0b1120',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '6px',
            backgroundColor: '#3b82f6', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
          }}>
            TS
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              TechSolutions Co.
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>
              PRO Tarif Active
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          height: '64px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 1rem' : '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          gap: '0.75rem',
        }}>
          {/* Hamburger for mobile */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'none', border: 'none',
                fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem',
                flexShrink: 0,
              }}
            >
              ☰
            </button>
          )}

          {/* Global Search */}
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: isMobile ? '100%' : '340px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder={isMobile ? "Qidiruv..." : "Qidiruv (nomzod, vakansiya)..."}
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
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

          {/* Actions & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1.25rem', flexShrink: 0 }}>
            {!isMobile && <LanguageSelector compact />}

            {/* Notifications Icon & Popover */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                style={{
                  background: 'none', border: 'none',
                  fontSize: '1.2rem', cursor: 'pointer', padding: '0.4rem',
                  position: 'relative'
                }}
                title="Bildirishnomalar"
              >
                🔔
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '8px', height: '8px',
                  backgroundColor: '#ef4444', borderRadius: '50%'
                }} />
              </button>

              {showNotifs && (
                <div style={{
                  position: 'absolute',
                  right: isMobile ? '-60px' : 0,
                  top: '40px',
                  width: isMobile ? '280px' : '320px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  zIndex: 100
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                    Bildirishnomalar
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.map((n) => (
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

            {/* Help Icon - hide on mobile */}
            {!isMobile && (
              <a
                href="https://feedback.hh.ru"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '1.2rem', textDecoration: 'none' }}
                title="Yordam va qo'llanma"
              >
                ❓
              </a>
            )}

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.25rem 0.5rem', borderRadius: '8px'
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#2563eb', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                }}>
                  AK
                </div>
                {!isMobile && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      Azizbek Karimov
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      HR Admin ▼
                    </div>
                  </div>
                )}
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: '48px',
                  width: '180px', backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem', zIndex: 100
                }}>
                  <Link href="/hr/settings" onClick={() => setShowUserMenu(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#1e293b', textDecoration: 'none', borderRadius: '6px' }}>
                    👤 Profilim
                  </Link>
                  <Link href="/hr/settings" onClick={() => setShowUserMenu(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#1e293b', textDecoration: 'none', borderRadius: '6px' }}>
                    🔔 Bildirishnomalar
                  </Link>
                  <Link href="/hr/settings" onClick={() => setShowUserMenu(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#1e293b', textDecoration: 'none', borderRadius: '6px' }}>
                    ⚙️ Sozlamalar
                  </Link>
                  <hr style={{ margin: '0.35rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <Link href="/hr/login" onClick={() => setShowUserMenu(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#ef4444', fontWeight: 600, textDecoration: 'none', borderRadius: '6px' }}>
                    🚪 Chiqish
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '1rem' : '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
