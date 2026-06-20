'use client'

import { CheckCircle2, Clock, Lock } from 'lucide-react'

interface CompletionCardProps {
  completionPercentage: string
  onEdit: () => void
}

export function CompletionCard({ completionPercentage, onEdit }: CompletionCardProps) {
  const completionPercentageNumber = Number(completionPercentage.replace('%', ''));

  return (
    <div className="bg-[#FFFDF5] rounded-xl border border-brand-blue p-4 sticky top-20">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[#4A7AB5] text-white rounded-lg p-1.5">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold flex-1 text-slate-900 text-[13px] font-manrope">Complete your profile to unlock more opportunities</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-slate-600">
            Profile Completion
          </span>
          <span className="text-xl font-neue">
            {completionPercentageNumber}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-[#4A7AB5] transition-all duration-500"
            style={{ width: `${completionPercentageNumber}%` }}
          />
        </div>
      </div>

      {/* <div className="space-y-2 mb-4">
        {tasks.map((task) => (
          <div key={task.label} className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 ${
                task.completed
                  ? 'text-emerald-500'
                  : 'text-slate-300'
              }`}
            />
            <span
              className={`text-sm ${
                task.completed
                  ? 'text-slate-900 font-medium'
                  : 'text-slate-500'
              }`}
            >
              {task.label}
            </span>
          </div>
        ))}
      </div> */}

      <button onClick={onEdit} className="w-fit px-4 text-xs bg-[#4A7AB5] text-white font-semibold py-2 rounded-xl hover:shadow-lg transition-all">
        Finish Now
      </button>
    </div>
  )
}
