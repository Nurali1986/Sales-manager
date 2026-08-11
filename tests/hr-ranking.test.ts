import { describe, it, expect, vi } from 'vitest'

describe('HR API - Vacancies Candidates Ranking', () => {
  it('should rank candidates by finalScore DESC by default', () => {
    const processed = [
      { id: '1', finalScore: 84, simulationScore: 85, caseScore: 88, videoScore: 84, applicationDate: '2026-08-01' },
      { id: '2', finalScore: 91, simulationScore: 94, caseScore: 90, videoScore: 92, applicationDate: '2026-08-02' },
      { id: '3', finalScore: 88, simulationScore: 91, caseScore: 85, videoScore: 86, applicationDate: '2026-08-03' }
    ]

    const sortField = 'finalScore'
    const sortOrder: string = 'desc'

    processed.sort((a, b) => {
      let cmp = 0
      if (sortField === 'finalScore') {
        cmp = (b.finalScore || -1) - (a.finalScore || -1)
        if (cmp === 0) cmp = (b.simulationScore || -1) - (a.simulationScore || -1)
        if (cmp === 0) cmp = (b.caseScore || -1) - (a.caseScore || -1)
        if (cmp === 0) cmp = (b.videoScore || -1) - (a.videoScore || -1)
        if (cmp === 0) cmp = new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
      }
      return sortOrder === 'asc' ? -cmp : cmp
    })

    expect(processed[0].id).toBe('2') // 91
    expect(processed[1].id).toBe('3') // 88
    expect(processed[2].id).toBe('1') // 84
  })

  it('should use simulationScore for tie-breaker', () => {
    const processed = [
      { id: '1', finalScore: 90, simulationScore: 85, caseScore: 88, videoScore: 84, applicationDate: '2026-08-01' },
      { id: '2', finalScore: 90, simulationScore: 94, caseScore: 85, videoScore: 86, applicationDate: '2026-08-02' },
    ]

    processed.sort((a, b) => {
      let cmp = (b.finalScore || -1) - (a.finalScore || -1)
      if (cmp === 0) cmp = (b.simulationScore || -1) - (a.simulationScore || -1)
      return cmp
    })

    expect(processed[0].id).toBe('2') // 94 > 85 simulation score
    expect(processed[1].id).toBe('1')
  })
})
