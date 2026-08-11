import React from 'react'
import { AssessmentStageType } from '@prisma/client'

const STAGES = [
  { type: AssessmentStageType.PROFILE, label: 'Profile' },
  { type: AssessmentStageType.CV, label: 'CV' },
  { type: AssessmentStageType.TEST, label: 'Test' },
  { type: AssessmentStageType.CASE, label: 'Case' },
  { type: AssessmentStageType.SCRIPT, label: 'Script' },
  { type: AssessmentStageType.LIVE_SALES, label: 'Simulation' },
  { type: AssessmentStageType.VIDEO, label: 'Video' },
]

interface AssessmentProgressProps {
  currentStage: AssessmentStageType | 'COMPLETED'
  completedStages: AssessmentStageType[]
}

export function AssessmentProgress({ currentStage, completedStages }: AssessmentProgressProps) {
  return (
    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      {STAGES.map((stage, index) => {
        const isCompleted = completedStages.includes(stage.type)
        const isCurrent = currentStage === stage.type
        
        let bgColor = 'var(--border)'
        let color = 'var(--muted-text)'
        let fontWeight = 'normal'

        if (isCompleted || currentStage === 'COMPLETED') {
          bgColor = 'var(--success)'
          color = 'white'
        } else if (isCurrent) {
          bgColor = 'var(--primary)'
          color = 'white'
          fontWeight = 'bold'
        }

        return (
          <div key={stage.type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              backgroundColor: bgColor, 
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              marginBottom: '0.5rem',
              fontWeight
            }}>
              {isCompleted ? '✓' : (index + 1)}
            </div>
            <span style={{ fontSize: '0.75rem', color: isCurrent ? 'var(--text)' : 'var(--muted-text)', fontWeight }}>
              {stage.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
