import React from 'react'

export function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary)' }}>Acme Corp</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--muted-text)' }}>Candidate Assessment</span>
        </div>
      </header>
      
      <main style={{ flex: 1, padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {children}
        </div>
      </main>
      
      <footer style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted-text)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} Acme Corp. All rights reserved.
      </footer>
    </div>
  )
}
