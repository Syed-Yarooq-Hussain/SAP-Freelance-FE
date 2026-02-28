'use client'

import { useState } from 'react'
import { ProfileView } from '@/components/account-settings/profile-view'
import { ProfileEdit } from '@/components/account-settings/profile-edit'
import { ProfileTabs } from '@/components/profile/profile-tab'
import Sidebar from '@/components/Sidebar'
import { useAppDispatch, useAppSelector } from '@/lib/store/hook'
import { updateConsultantProfile } from '@/services/consultants'
import { getConsultantMeService } from '@/services/getConsultantProfile'
import { updateUser } from '@/lib/store/features/user/userSlice'

export default function ProfilePage() {
  const user = useAppSelector(state => state?.user?.user)
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async (data: any, apiPayload?: any) => {
    setIsLoading(true)
    try {
      const res = await updateConsultantProfile(user?.id, apiPayload)

      if (res.status == "success") {
        const consultantData = await getConsultantMeService();
        
        if (consultantData?.data) {
          dispatch(updateUser({ user: consultantData.data }));
        }      }
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sidebar>
      <>
        <div className="mb-8 ml-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            My Profile
          </h1>
          <p className="text-slate-600 text-sm mt-4">Manage your professional information and credentials</p>
        </div>
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-cyan-50/70 py-8 px-4">
      
          <div>
              <div className="mb-8">
                {/* <ProfileView
                  onEdit={() => setIsEditing(true)}
                  canEdit={false}
                /> */}
                 {isEditing ? (
                    <ProfileEdit
                      onSubmit={handleSave}
                      isLoading={isLoading}
                      onCancel={() => setIsEditing(false)}
                    />
                  ) : (
                    <ProfileView
                      key={user?.id}
                      badges={[]}
                      onEdit={() => setIsEditing(true)}
                    />
                  )}
              </div>

            {/* {!isEditing && ( */}
              <>
                <div className="h-px bg-slate-200 my-8" />

                {/* Profile Tabs */}
                <ProfileTabs/>
              </>
            {/* )} */}
          </div>
        </div>
      </>
    </Sidebar>
  )
}
