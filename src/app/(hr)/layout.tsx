export default function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="hr-layout">
      {/* Basic HR Navigation could go here */}
      <nav style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
        <strong>HR Dashboard</strong>
      </nav>
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  )
}
