import React from 'react'

export function ScoreBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-sm font-medium">Pending</span>
  }

  let bgColor = 'bg-red-100 text-red-700'
  if (score >= 90) bgColor = 'bg-green-100 text-green-700'
  else if (score >= 75) bgColor = 'bg-blue-100 text-blue-700'
  else if (score >= 60) bgColor = 'bg-yellow-100 text-yellow-700'

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${bgColor}`}>
      {Math.round(score)} / 100
    </span>
  )
}
