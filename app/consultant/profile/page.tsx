'use client'

import { useState } from 'react'
import { ProfileEdit } from '@/components/account-settings/profile-edit'
import { ProfileHero } from '@/components/profile/ProfileHero'
import { MeetSection } from '@/components/profile/MeetSection'
import { ReviewsSection } from '@/components/profile/ReviewsSection'
import { ProfileTabs } from '@/components/profile/profile-tab'
import Sidebar from '@/components/Sidebar'
import { useAppDispatch, useAppSelector } from '@/lib/store/hook'
import { updateConsultantProfile } from '@/services/consultants'
import { getConsultantMeService } from '@/services/getConsultantProfile'
import { updateUser } from '@/lib/store/features/user/userSlice'

export default function ProfilePage() {
  const user = useAppSelector((state) => state?.user?.user)
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)

  const handleSave = async (data: unknown, apiPayload?: any) => {
    setIsLoading(true)
    try {
      const res = await updateConsultantProfile(user?.id, apiPayload)
      if (res.status === 'success') {
        const consultantData = await getConsultantMeService()
        if (consultantData?.data) {
          dispatch(updateUser({ user: consultantData.data }))
        }
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sidebar>
      <div className="min-h-screen bg-white py-6 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {isEditing ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <ProfileEdit
                onSubmit={handleSave}
                isLoading={isLoading}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              <ProfileHero
                showEdit
                onEdit={() => setIsEditing(true)}
                onAutofillResume={() => setIsCVModalOpen(true)}
              />
              <MeetSection />
              {/* <ReviewsSection /> */}
              <ProfileTabs
                cvModalOpen={isCVModalOpen}
                onCloseCVModal={() => setIsCVModalOpen(false)}
              />
            </>
          )}
        </div>
      </div>
    </Sidebar>
  )
}
