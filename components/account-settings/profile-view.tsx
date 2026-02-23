'use client'

import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hook'
import { useSapModules } from '@/actions/common/useSapModules'

interface Badge {
  id: string
  label: string
  color: 'green' | 'blue' | 'orange',
  icon: string
}

interface ProfileViewProps {
  badges?: Badge[]
  onEdit: () => void
  canEdit?: boolean
}

const badgeColors = {
  green: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-cyan-100 text-cyan-700',
  orange: 'bg-orange-100 text-orange-700',
}

export function ProfileView({
  canEdit = true,
  badges = [],
  onEdit,
}: ProfileViewProps) {
  const user = useAppSelector(state => state?.user?.user)  
  const name = user?.username || '-'
  const email = user?.user?.email || '-'
  const headline = user?.clients_summary || 'No headline added'
  const profileImage = user?.user?.avatar || ''
  const coreModules = user?.user?.modules?.length > 0 ? user?.user?.modules.filter((module:any) => module?.is_primary) : []
  const otherModules = user?.user?.modules?.length > 0 ? user?.user?.modules.filter((module:any) => !module?.is_primary) : []
  const experience = user?.experience || 0
  const rate = user?.rate || 0
  const location = user?.user?.city || 'N/A'

  const initials = name
    .split(' ')
    .map((n:any) => n[0])
    .join('')
    .toUpperCase()
  return (
    <div className="bg-white rounded-2xl border border-slate-100/50 p-6 md:p-8 space-y-6">
      {/* Profile Header */}
      <div className="flex gap-6">
        <div className="flex-shrink-0">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-lg font-medium text-slate-600">{initials}</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
            {name}
          </h2>
          <p className="text-sm text-slate-600 mb-2">{email}</p>
          <p className="text-sm text-slate-500">
            {headline || 'No headline added'}
          </p>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex gap-2 mt-3">
              {badges.map((badge, i) => (
                <Image key={i} className='hover:scale-125 transition-all duration-300' src={badge.icon} alt={badge.label} width={20} height={20} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Modules */}
        <div>
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Core Modules
          </label>
          <p className="text-slate-900 font-medium mt-2">
            {coreModules.map((module:any) => module?.module?.name).join(', ')}
          </p>
        </div>

        {/* Other Modules */}
        {otherModules.length > 0 && (
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
              Other Modules
            </label>
            <p className="text-slate-900 font-semibold mt-2">
              {otherModules.map((module:any) => module?.module?.name).join(', ')}
            </p>
          </div>
        )}

        {/* Availability */}
        <div>
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Availability
          </label>
          <p className="text-slate-900 font-semibold mt-2">{user?.weekly_available_hours} hours</p>
        </div>

        {/* Experience */}
        <div>
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Experience
          </label>
          <p className="text-slate-900 font-semibold mt-2">{experience} years</p>
        </div>

        {/* Rate */}
        <div>
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Rate
          </label>
          <p className="text-slate-900 font-semibold mt-2">${rate}/hr</p>
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Location
          </label>
          <p className="text-slate-900 font-semibold mt-2">{location}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {canEdit &&<div className="flex gap-3 border-t border-slate-100 pt-6">
        <button
          onClick={onEdit}
          className="btn-gradient-blue text-white font-medium px-12 py-2.5 rounded-xl transition-all duration-300 ease-out hover:shadow-lg hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
        >
          Edit
        </button>
        {/* <button
          onClick={onDelete}
          className="flex items-center gap-2 px-6 py-2.5 border-2 border-slate-300 text-slate-900 font-medium rounded-full hover:border-red-300 hover:bg-red-50 transition-all duration-300"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button> */}
      </div>}
    </div>
  )
}
