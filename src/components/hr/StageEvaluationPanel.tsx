import React, { useState } from 'react'

export function StageEvaluationPanel({ stages }: { stages: any[] }) {
  const [activeStage, setActiveStage] = useState(stages[0]?.id)

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="flex overflow-x-auto border-b">
        {stages.map(stage => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(stage.id)}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeStage === stage.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {stage.type.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="p-6">
        {stages.map(stage => {
          if (stage.id !== activeStage) return null
          
          const result = stage.aiResults?.[0]?.validatedResult
          
          return (
            <div key={stage.id} className="space-y-8 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-gray-900">{stage.type.replace('_', ' ')} Evaluation</h4>
                <div className="text-2xl font-bold text-blue-600">{stage.score ?? 'Pending'} <span className="text-sm text-gray-500 font-normal">/ 100</span></div>
              </div>

              {result ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.criteria?.map((c: any, i: number) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900">{c.name}</span>
                          <span className="text-sm font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {c.score} / 100
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium text-gray-900">Evidence: </span>
                          {c.evidence}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {stage.type === 'LIVE_SALES' && stage.submissions?.[0] && (
                    <div className="mt-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Simulation Transcript</h4>
                      <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm max-h-96 overflow-y-auto whitespace-pre-wrap">
                        {stage.submissions[0].content
                          .replace(/User:/g, 'CANDIDATE:')
                          .replace(/AI:/g, 'CUSTOMER:')}
                      </div>
                    </div>
                  )}

                  {(stage.type === 'SALES_CASE' || stage.type === 'SALES_SCRIPT') && stage.submissions?.[0] && (
                    <div className="mt-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Original Candidate Response</h4>
                      <div className="bg-gray-50 p-4 rounded-lg border text-sm max-h-96 overflow-y-auto whitespace-pre-wrap text-gray-800">
                        {stage.submissions[0].content}
                      </div>
                    </div>
                  )}

                  {stage.type === 'VIDEO_PITCH' && stage.submissions?.[0] && (
                    <div className="mt-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Video Submission</h4>
                      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 text-sm">
                        Video URL generated. (MVP: Direct playback available via secure link in candidate files)
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 p-4 bg-gray-50 rounded border text-center">
                  Evaluation pending or failed.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
