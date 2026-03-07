'use client'

import { useState } from 'react'

interface ReviewMetric {
  label: string
  value: number
}

interface ReviewItem {
  id: string
  author: string
  authorInitials: string
  subline: string
  date: string
  comment: string
}

interface ReviewsSectionProps {
  reviews?: ReviewItem[]
  metrics?: ReviewMetric[]
}

const defaultMetrics: ReviewMetric[] = [
  { label: 'Would rehire', value: 0 },
  { label: 'Punctual', value: 50 },
  { label: 'Dependable', value: 100 },
]

export function ReviewsSection({
  reviews = [],
  metrics = defaultMetrics,
}: ReviewsSectionProps) {
  const [filter, setFilter] = useState('All')
  const reviewCount = reviews.length
  const rating = reviewCount > 0 ? 5 : 0

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Reviews
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="All">All</option>
            <option value="Consulting">Consulting</option>
          </select>
          <button
            type="button"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Write a review
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-0.5 text-amber-400" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i}>★</span>
          ))}
        </div>
        <span className="text-slate-600 text-sm">({reviewCount})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-100"
          >
            <div className="text-2xl font-bold text-slate-900">{m.value}%</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 ? (
        <p className="text-slate-500 text-sm py-4">
          No reviews yet.
        </p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((rev) => (
            <li key={rev.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 text-cyan-700 font-semibold text-sm">
                {rev.authorInitials}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{rev.author}</p>
                <p className="text-sm text-slate-500">{rev.subline} · {rev.date}</p>
                <p className="text-slate-600 text-sm mt-2">{rev.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
