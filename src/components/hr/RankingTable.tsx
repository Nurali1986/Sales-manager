import React from 'react'
import { ScoreBadge } from './ScoreBadge'

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
  if (!candidates.length) {
    return (
      <div className="p-8 text-center bg-gray-50 text-gray-500 rounded-lg border">
        No candidates match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left w-12">
              <input type="checkbox" className="rounded" disabled />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Score</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Script</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sim</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Rec</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidates.map((c, idx) => (
            <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick(c.candidateId)}>
              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectedIds.includes(c.id)}
                  onChange={(e) => onSelect(c.id, e.target.checked)}
                />
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{c.firstName} {c.lastName}</div>
                <div className="text-sm text-gray-500">Rank #{idx + 1}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap"><ScoreBadge score={c.finalScore} /></td>
              <td className="px-4 py-4 whitespace-nowrap"><ScoreBadge score={c.testScore} /></td>
              <td className="px-4 py-4 whitespace-nowrap"><ScoreBadge score={c.caseScore} /></td>
              <td className="px-4 py-4 whitespace-nowrap"><ScoreBadge score={c.scriptScore} /></td>
              <td className="px-4 py-4 whitespace-nowrap"><ScoreBadge score={c.simulationScore} /></td>
              <td className="px-4 py-4 whitespace-nowrap"><ScoreBadge score={c.videoScore} /></td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs font-medium ${c.recommendation === 'ADVANCE' ? 'bg-green-100 text-green-800' : c.recommendation === 'REJECT' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {c.recommendation || '—'}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {c.assessmentStatus}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
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
