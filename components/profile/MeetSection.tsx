'use client'

import { CheckCircle } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hook'

export function MeetSection() {
  const user = useAppSelector((state) => state?.user?.user)
  const name = user?.user?.username ?? 'User'
  const firstName = name.split(' ')[0] || name
  const bio = user?.clients_summary || 'No bio added yet.'
  const certifications = user?.certification ?? []
  console.log(certifications, 'certifications', user)
  const qualificationLabels = user?.user?.modules
    .map((c: { module?: any }) => c?.module?.name)
    .filter(Boolean)
  const defaultQualifications = [
    'SAP experience',
    'Remote available'
  ]

  const qualifications = qualificationLabels.length > 0
    ? qualificationLabels
    : defaultQualifications

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        Meet {firstName}
      </h2>
      <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
        {bio}
      </p>
      <div className="flex flex-wrap gap-3">
        {qualifications.map((label: any) => (
          <div
            key={label}
            className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-brand-blue/20 bg-brand-blue/5 py-2.5 px-3.5 text-slate-700 transition-all duration-200 hover:scale-[1.02] hover:border-brand-blue/40 hover:shadow-md hover:shadow-brand-blue/10 before:content-[''] before:absolute before:inset-0 before:bg-brand-blue/10 before:-translate-x-full before:transition-transform before:duration-300 before:ease-out group-hover:before:translate-x-0 before:z-0"
          >
            <CheckCircle className="relative z-10 w-5 h-5 flex-shrink-0 text-brand-blue transition-transform duration-200 group-hover:scale-110" />
            <span className="relative z-10 text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
