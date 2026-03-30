'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ProfessionalSummaryProps {
  summary: string
  maxLines?: number
}

export function ProfessionalSummary({
  summary,
  maxLines = 3,
}: ProfessionalSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const lines = summary.split('\n').filter((line) => line.trim())
  const isLongText = lines.length > maxLines

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm">
          📋
        </span>
        Professional Summary
      </h2>
      <p
        className={`text-slate-600 leading-relaxed ${
          !isExpanded && isLongText
            ? 'line-clamp-3'
            : ''
        }`}
      >
        {summary}
      </p>
      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-brand-blue font-semibold text-sm mt-3 flex items-center gap-1 hover:text-button-blue transition"
        >
          {isExpanded ? 'Show less' : 'Show more'}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}
    </div>
  )
}
