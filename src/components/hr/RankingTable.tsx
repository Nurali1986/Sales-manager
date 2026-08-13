'use client'

import React from 'react'
import { ScoreBadge } from './ScoreBadge'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Candidate = {
  id: string
  candidateId: string
  firstName: string
  lastName: string
  status: string
  finalScore: number | null
  testScore: number | null
  caseScore: number | null
  scriptScore: number | null
  simulationScore: number | null
  videoScore: number | null
  recommendation?: string | null
  assessmentStatus?: string
}

export function RankingTable({ candidates, selectedIds, onSelect, onRowClick }: {
  candidates: Candidate[],
  selectedIds: string[],
  onSelect: (id: string, selected: boolean) => void,
  onRowClick: (candidateId: string) => void
}) {
  const { t } = useLanguage()

  if (!candidates.length) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', color: '#64748b', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        No candidates match your filters.
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <tr>
            <th style={{ padding: '0.75rem 1rem', width: '48px' }}>
              <input type="checkbox" disabled />
            </th>
            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.candidateName}</th>
            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.finalScoreLabel}</th>
            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.stageTest}</th>
            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.stageCase}</th>
            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.stageScript}</th>
            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.stageSim}</th>
            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.stageVideo}</th>
            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>AI Rec</th>
            <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>HR Status</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, idx) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => onRowClick(c.candidateId)}>
              <td style={{ padding: '1rem' }} onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.id)}
                  onChange={(e) => onSelect(c.id, e.target.checked)}
                />
              </td>
              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.firstName} {c.lastName}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rank #{idx + 1}</div>
              </td>
              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}><ScoreBadge score={c.finalScore} /></td>
              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}><ScoreBadge score={c.testScore} /></td>
              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}><ScoreBadge score={c.caseScore} /></td>
              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}><ScoreBadge score={c.scriptScore} /></td>
              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}><ScoreBadge score={c.simulationScore} /></td>
              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}><ScoreBadge score={c.videoScore} /></td>
              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: c.recommendation === 'ADVANCE' ? '#dcfce7' : c.recommendation === 'REJECT' ? '#fee2e2' : '#fef3c7',
                  color: c.recommendation === 'ADVANCE' ? '#166534' : c.recommendation === 'REJECT' ? '#991b1b' : '#92400e'
                }}>
                  {c.recommendation || '—'}
                </span>
              </td>
              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                <span style={{ padding: '0.2rem 0.5rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
