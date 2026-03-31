'use client'

import { MapPin, Calendar, CheckCircle2, Zap, Star, CircleStar, FileText, ChevronUp, ChevronDown, Clock, CircleCheck, Dot, Laptop, Plus } from 'lucide-react'
import { Badge } from '../homepage/ui/badge'
import { useAppSelector } from '@/lib/store/hook'
import { useState } from 'react'
import { Separator } from '../homepage/ui/separator'
import { Button } from '../homepage/ui/button'

interface ProfileHeaderProps {
  name: string
  headline?: string
  badges?: string[]
  isCertified?: boolean
  rate: number
  location: string
  joinDate?: string
  projectsDone?: number
  coreModules?: string[]
}

const badgeConfig = {
  VERIFIED: { label: 'Verified', variant: 'bg-success' as const, startIcon: <CheckCircle2 className="w-3 h-3" /> },
  CERTIFIED: { label: 'Certified', variant: 'bg-brand-blue' as const, startIcon: <Star className="w-3 h-3" /> },
  SENIOR_EXPERT: { label: 'Senior Expert', variant: 'bg-brand-blue' as const, startIcon: <CircleStar className="w-3 h-3" /> },
}

export function ProfileHeader({ setIsEditing }: { setIsEditing: (editing: boolean) => void }) {
  const [viewMore, setViewMore] = useState(false)
  const user = useAppSelector((state) => state?.user?.user)
  const badges: string[] = user?.badges || []
  const coreModules: string[] = user?.user?.modules?.filter((module: any) => module?.is_primary)?.map((module: any) => module?.module?.name) || []

  return (
    <div className="flex-1">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {user?.user?.username}
          </h1>
          <div className="flex items-center flex-wrap gap-2">
            {badges.map((badge) => {
              const config = badgeConfig[badge as keyof typeof badgeConfig]
              return config ? (
                <Badge key={badge} className={`${config.variant} text-white rounded-full flex items-center gap-1 hover:scale-105 transition-all duration-300`}>
                  {config.startIcon}
                  {config.label}
                </Badge>
              ) : null
            })}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          {
            coreModules.length > 0 && (
              <div className="flex items-center gap-2">
                {coreModules.map((module) => (
                  <p key={module} className="text-lg text-black flex items-center gap-2">{module} <span className="bg-black w-2 h-2 rounded-full inline-block"></span></p>
                ))}
              </div>
            )
          }
          <p className="text-lg text-black flex items-center gap-2">{user?.experience} years of experience</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div className="border flex flex-col justify-evenly border-slate-200 rounded-xl px-4 py-2">
          <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
            Hourly Rate
          </div>
          <div className="text-lg md:text-xl font-bold text-success">
            ${user?.rate || '-'}/hr
          </div>
        </div>
        <div className="border flex flex-col justify-evenly border-slate-200 rounded-xl px-4 py-2">
          <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
            Availability (Weekly)
          </div>
          <div className="text-md font-bold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {user?.weekly_available_hours} hours
          </div>
        </div>
        {user?.user?.city && (
          <div className="border flex flex-col justify-evenly border-slate-200 rounded-xl px-4 py-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold mb-1">
              Location
            </div>
            <div className="text-md font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {user?.user?.city}
              {user?.user?.country && `, ${user?.user?.country}`}
            </div>
          </div>
        )}
        {(
          <div className="border flex flex-col justify-evenly border-slate-200 rounded-xl px-4 py-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold mb-1">
              Joined
            </div>
            <div className="text-md font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {user?.user?.created_at || 'Recently'}
            </div>
          </div>
        )}
        {(
          <div className="border flex flex-col justify-evenly border-slate-200 rounded-xl px-4 py-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold mb-1">
              Projects
            </div>
            <div className="text-md font-semibold text-slate-900 flex items-center gap-2">
              <CircleCheck className="w-3 h-3" />
              {user?.projects?.length || 0} done
            </div>
          </div>
        )}
      </div>

      {coreModules.length > 0 ? <div className="bg-gradient-success border mb-4 border-slate-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className='flex items-center mr-1'>
              <Dot className="w-8 h-8 text-success" />
              <p className="text-sm text-success font-medium">Core Modules</p>
            </div>
            <div className="h-5 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-2">
              {
                coreModules.map((module, index) => (
                  <div key={module} className={`flex items-center font-semibold gap-2 ${index !== 0 ? 'bg-white' : 'bg-success'} rounded-md px-4 py-1.5 ${index !== 0 ? 'text-success' : 'text-white'}`}>
                    <p className="text-sm font-semibold">{module}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div> : (
        <div className='bg-inactive border border-dashed mb-4 border-slate-200 rounded-xl px-4 py-3 flex items-center gap-2'>
          <div className='flex items-center gap-2 bg-disabled rounded-xl p-2'>
            <Laptop className='w-6 h-6' />
          </div>
          <div className='flex flex-col gap-1 flex-1'>
            <p className='font-bold text-sm text-slate-500'>No core modules selected</p>
            <p className='text-xs text-slate-300'>Add your primary SAP specialization - e.g S/4HANA, FI/CO</p>
          </div>
        </div>
      )}

      {user?.clients_summary ? (
        <div className="mb-4 bg-[#F5F3EF] border border-slate-200 rounded-xl p-4">
          <p className='font-bold uppercase mb-4 flex items-center gap-2'><span className='bg-brand-blue text-white rounded-md p-1 w-7 h-7 flex items-center justify-center'><FileText className="w-4 h-4" /></span>Professional Summary</p>
          <p className="text-sm text-slate-700 mb-4 font-medium leading-relaxed">{viewMore ? user?.clients_summary : user?.clients_summary?.slice(0, 250) + (user?.clients_summary?.length > 250 ? '...' : '')}</p>
          {user?.clients_summary?.length > 250 && (
            <button className="text-brand-blue text-sm font-medium flex items-center gap-2" onClick={() => setViewMore(!viewMore)}>
              {viewMore ? <ChevronUp className="w-4 h-4 text-black" /> : <ChevronDown className="w-4 h-4 text-black" />} {viewMore ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      ) : (
        <div className='bg-inactive border border-dashed mb-4 border-slate-200 rounded-xl px-4 py-3 flex flex-col text-center justify-center items-center gap-2'>
          <div className='flex items-center gap-2 bg-disabled rounded-xl p-2'>
            <FileText className='w-6 h-6' />
          </div>
          <div className='flex flex-col justify-center items-center gap-1 flex-1'>
            <p className='font-bold text-sm text-slate-500'>No professional summary yet</p>
            <p className='text-xs text-slate-300 max-w-md'>Tell clients about your expertise, experience, and what makes you stand out. A strong summary increases your chances of being hired by 3×.</p>
            <Button onClick={() => setIsEditing(true)} className='bg-white w-fit flex items-center gap-1 px-4 py-2 rounded-xl text-xs border border-slate-300 text-brand-blue'><Plus className='w-4 h-4 text-black' /> Write Summary</Button>
          </div>
        </div>
      )}
    </div>
  )
}
