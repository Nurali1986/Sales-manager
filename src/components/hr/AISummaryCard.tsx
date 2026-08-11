import React from 'react'

export function AISummaryCard({ summary, strengths, weaknesses, confidence }: { summary: string, strengths: string[], weaknesses: string[], confidence: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Assessment Summary</h3>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Confidence: {confidence}%
        </div>
      </div>
      
      <p className="text-gray-700 mb-6">{summary}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
          <h4 className="text-sm font-semibold text-green-800 uppercase tracking-wider mb-3">Main Strengths</h4>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span>
                {s}
              </li>
            ))}
            {strengths.length === 0 && <li className="text-sm text-gray-500">None highlighted.</li>}
          </ul>
        </div>
        
        <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
          <h4 className="text-sm font-semibold text-orange-800 uppercase tracking-wider mb-3">Potential Weaknesses</h4>
          <ul className="space-y-2">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-orange-500">!</span>
                {w}
              </li>
            ))}
            {weaknesses.length === 0 && <li className="text-sm text-gray-500">None highlighted.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
