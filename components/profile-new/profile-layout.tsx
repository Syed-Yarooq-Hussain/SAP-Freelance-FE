'use client'

import { ProfileImage } from './profile-image'
import { ProfileHeader } from './profile-header'
import { ProfessionalSummary } from './professional-summary'
import { ProfessionalInfo } from './professional-info'
import { OtherModulesSection } from './other-modules-section'
import { CompletionCard } from './completion-card'
import { Download, Edit, File } from 'lucide-react'

interface ProfileLayoutProps {
  consultant: any
  setCvModalOpen: (open: boolean) => void
  setIsEditing: (editing: boolean) => void
}

export function ProfileLayout({ consultant, setCvModalOpen, setIsEditing }: ProfileLayoutProps) {
  const user = consultant?.user
  const coreModules =
    consultant?.user?.module?.core?.split(', ').filter(Boolean) || []
  const otherModules =
    consultant?.user?.module?.others?.split(', ').filter(Boolean) || []

  const completionPercentage =
    Math.round(
      (Object.keys(consultant || {}).filter((key) => {
        const value = consultant?.[key]
        return value && value !== null && value !== ''
      }).length /
        Object.keys(consultant || {}).length) *
        100
    ) || 0

  return (
    <div className="min-h-screen bg-background-main">
      {/* Top Action Buttons */}
      {/* <div className="sticky top-0 z-40 bg-background-main backdrop-blur border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-end gap-3">
          <button onClick={() => setCvModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-200 transition font-medium text-sm">
            <File className="w-4 h-4" />
            Autofill by Resume
          </button>
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue text-white hover:shadow-lg transition font-medium text-sm">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div> */}

      <div className="mx-auto">
        {/* Profile Header Section */}
        <div className="border border-slate-200 rounded-2xl p-6 mb-4">
        <div className="sticky top-0 z-40 bg-background-main backdrop-blur border-slate-200 mb-2">
        <div className="max-w-7xl mx-auto  flex justify-end gap-3">
          <button onClick={() => setCvModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-200 transition font-medium text-xs">
            <File className="w-3 h-3" />
            Autofill by Resume
          </button>
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue text-white hover:shadow-lg transition font-medium text-xs">
            <Edit className="w-3 h-3" />
            Edit Profile
          </button>
        </div>
      </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <ProfileImage
                imageUrl={user?.avatar}
                name={user?.username || 'User'}
              />
            </div>
            <ProfileHeader setIsEditing={setIsEditing}/>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-2xl">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {otherModules.length > 0 && (
              <OtherModulesSection/>
            )}
            <CompletionCard completionPercentage={completionPercentage} onEdit={() => setIsEditing(true)}/>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <ProfessionalInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
