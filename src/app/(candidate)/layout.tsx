export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="candidate-layout" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2>Sales Manager Assessment</h2>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}
