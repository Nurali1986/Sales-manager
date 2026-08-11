import React from 'react'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface AutosaveIndicatorProps {
  state: SaveState
}

export function AutosaveIndicator({ state }: AutosaveIndicatorProps) {
  if (state === 'idle') return null

  const getStyle = () => {
    switch (state) {
      case 'saving': return { color: 'var(--muted-text)', text: 'Saving...' }
      case 'saved': return { color: 'var(--success)', text: 'Saved ✓' }
      case 'error': return { color: 'var(--danger)', text: 'Unable to save. Retrying...' }
    }
  }

  const styleInfo = getStyle()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 'medium',
      color: styleInfo.color,
      transition: 'all 0.3s ease'
    }}>
      {state === 'saving' && (
        <svg className="animate-spin" style={{ width: '1rem', height: '1rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {styleInfo.text}
    </div>
  )
}
