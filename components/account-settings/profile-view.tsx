'use client'

import Image from 'next/image'
import { Award, Badge, CheckCircle, Pencil, Sparkles, Star, Trash2 } from 'lucide-react'
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


  const sanitizeUrl = (url?: string | null) =>
    url ? encodeURI(url.trim()) : undefined
  const name = user?.user?.username || '-'
  const email = user?.user?.email || '-'
  const headline = user?.clients_summary || 'No headline added'
    const profileImage = sanitizeUrl(user?.user?.avatar || '')
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
      <div className="flex flex-col md:flex-row gap-4 md:items-start">
        <div className="flex gap-6 flex-1">
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

            
          </div>
        </div>

        {canEdit && (
          <div className="mt-4 md:mt-0 md:ml-auto w-full md:w-auto">
            <button
              onClick={onEdit}
              className="w-fit inline-flex items-center justify-center gap-2 font-medium p-4 rounded-full transition-all duration-300 ease-out hover:shadow-lg hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              {/* Badges Left */}
              <div className="flex flex-wrap gap-2">
                {user?.badges?.map((badge: string) => {
                  const normalized = badge.toUpperCase();
    
                  const badgeConfig = {
                    VERIFIED: {
                      label: 'Verified',
                      color: 'bg-emerald-100 text-emerald-700',
                      icon: CheckCircle,
                    },
                    CERTIFIED: {
                      label: 'Certified',
                      color: 'bg-blue-100 text-blue-700',
                      icon: Badge,
                    },
                    JUNIOR: {
                      label: 'Junior Consultant',
                      color: 'bg-gray-100 text-gray-700',
                      icon: Award,
                    },
                    ASSOCIATE: {
                      label: 'Associate Consultant',
                      color: 'bg-blue-100 text-blue-700',
                      icon: Star,
                    },
                    MID_LEVEL: {
                      label: 'Mid Level',
                      color: 'bg-indigo-100 text-indigo-700',
                      icon: Star,
                    },
                    SENIOR: {
                      label: 'Senior Consultant',
                      color: 'bg-purple-100 text-purple-700',
                      icon: Award,
                    },
                    PRINCIPAL: {
                      label: 'Principal Consultant',
                      color: 'bg-amber-100 text-amber-700',
                      icon: Star,
                    },
                    SOLUTION_ARCHITECT: {
                      label: 'Solution Architect',
                      color: 'bg-red-100 text-red-700',
                      icon: Sparkles,
                    },
                  }[normalized];
    
                  if (!badgeConfig) return null;
    
                  const Icon = badgeConfig.icon;
    
                  return (
                    <span
                      key={badge}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badgeConfig.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {badgeConfig.label}
                    </span>
                  );
                })}
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

      {/* Action Buttons (moved into header for desktop, bottom on mobile via stacking) */}
    </div>
  )
}
