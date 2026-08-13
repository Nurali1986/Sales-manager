'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function StageEvaluationPanel({ stages }: { stages: any[] }) {
  const { t } = useLanguage()
  const [activeStage, setActiveStage] = useState(stages[0]?.id)

  const stageLabels: Record<string, string> = {
    PROFILE: t.stageProfile,
    CV: t.stageCV,
    TEST: t.stageTest,
    CASE: t.stageCase,
    SCRIPT: t.stageScript,
    LIVE_SALES: t.stageSim,
    VIDEO: t.stageVideo,
  }

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        {stages.map(stage => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(stage.id)}
            style={{
              padding: '1rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: activeStage === stage.id ? 700 : 500,
              color: activeStage === stage.id ? '#2563eb' : '#64748b',
              border: 'none',
              borderBottom: activeStage === stage.id ? '2px solid #2563eb' : '2px solid transparent',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {stageLabels[stage.type] || stage.type}
          </button>
        ))}
      </div>

      <div style={{ padding: '1.5rem' }}>
        {stages.map(stage => {
          if (stage.id !== activeStage) return null

          const result = stage.aiResults?.[0]?.validatedResult

          return (
            <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {stageLabels[stage.type] || stage.type} {t.stageBreakdownTitle}
                </h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>
                  {stage.score ?? 'Pending'} <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 400 }}>/ 100</span>
                </div>
              </div>

              {result ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {result.criteria?.map((c: any, i: number) => (
                      <div key={i} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{c.name}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {c.score} / 100
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.5rem 0 0 0' }}>
                          <strong style={{ color: '#0f172a' }}>{t.evidenceText}: </strong>
                          {c.evidence}
                        </p>
                      </div>
                    ))}
                  </div>

                  {stage.type === 'LIVE_SALES' && stage.submissions?.[0] && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>Simulation Transcript</h4>
                      <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '0.85rem', maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                        {stage.submissions[0].content
                          .replace(/User:/g, 'CANDIDATE:')
                          .replace(/AI:/g, 'CUSTOMER:')}
                      </div>
                    </div>
                  )}

                  {(stage.type === 'CASE' || stage.type === 'SCRIPT') && stage.submissions?.[0] && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>Original Response</h4>
                      <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap', color: '#334155' }}>
                        {stage.submissions[0].content}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: '#64748b', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  Evaluation pending or completed.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
