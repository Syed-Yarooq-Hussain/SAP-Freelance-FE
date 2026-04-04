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
import { ProfileLayout } from '@/components/profile-new/profile-layout'
import { CVUploadModal } from '@/components/profile/cv-upload-modal'
import { WorkExperienceFormData } from '@/lib/schemas/experience'
import { EducationFormData } from '@/lib/schemas/education'
import { CertificationFormData } from '@/lib/schemas/certification'

export default function ProfilePage() {
  const user = useAppSelector((state:any) => state?.user?.user)
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)
  const handleCloseCVModal = () => setIsCVModalOpen(false)

  const updateProfile = async (payload: {
    work_experiences?: WorkExperienceFormData[]
    education?: EducationFormData[]
    certification?: CertificationFormData[],
    clients_summary?: string,
  }, userData?: {
      username?: string
      city?: string
      country?: string
      phone?: string
      currency?: string
  }) => {
    try {
      const payloadToSend ={
        consultant: {
          ...payload,
        },
        ...(userData && {user: {...userData}})
      }
      const res = await updateConsultantProfile(user?.id, payloadToSend as any)

      if (res.status === 'success') {
        const consultantData = await getConsultantMeService()
        if (consultantData?.data) {
          dispatch(updateUser({ user: consultantData.data }))
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

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

   // Handle CV autofill data
   const handleCVAutofill = (cvData: any) => {
    if (cvData?.consultant) {
      const { clients_summary, work_experiences: cvWorkExp, education: cvEducation, certifications: cvCertifications } = cvData.consultant
      const {username, city, country, phone, currency} = cvData.user
      const updatedWorkExp = cvWorkExp && Array.isArray(cvWorkExp) ? cvWorkExp : user?.work_experiences
      const updatedEducation = cvEducation && Array.isArray(cvEducation) ? cvEducation : user?.education
      const updatedCertifications = cvCertifications && Array.isArray(cvCertifications) ? cvCertifications : user?.certification

      // if (cvWorkExp && Array.isArray(cvWorkExp)) {
      //   setWorkExperience(cvWorkExp)
      // }
      // if (cvEducation && Array.isArray(cvEducation)) {
      //   setEducation(cvEducation)
      // }
      // if (cvCertifications && Array.isArray(cvCertifications)) {
      //   setCertifications(cvCertifications)
      // }

      const userData = {
        username: username ?? user?.user?.username,
        city: city ?? user?.user?.city,
        country: country ?? user?.user?.country,
        phone: phone ?? user?.user?.phone,
        currency: currency ?? user?.user?.currency,
      }
      // Update via API
      updateProfile({
        work_experiences: updatedWorkExp,
        education: updatedEducation,
        certification: updatedCertifications,
        clients_summary: clients_summary ?? user?.user?.clients_summary
      }, userData)
    }
  }

  return (
    <Sidebar>
      <div className="min-h-screen bg-background-main rounded-xl py-6 px-4 -mt-4">
        <div className="mx-auto space-y-6">
          {isEditing ? (
            <div className="bg-background-main rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <ProfileEdit
                onSubmit={handleSave}
                isLoading={isLoading}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <ProfileLayout consultant={user} setIsEditing={setIsEditing} setCvModalOpen={setIsCVModalOpen}/>
            // <>
            //   <ProfileHero
            //     showEdit
            //     onEdit={() => setIsEditing(true)}
            //     onAutofillResume={() => setIsCVModalOpen(true)}
            //   />
            //   <MeetSection />
            //   {/* <ReviewsSection /> */}
            //   <ProfileTabs
            //     cvModalOpen={isCVModalOpen}
            //     onCloseCVModal={() => setIsCVModalOpen(false)}
            //   />
            // </>
          )}
           <CVUploadModal
              isOpen={isCVModalOpen}
              onClose={handleCloseCVModal}
              onAutofill={handleCVAutofill}
            />
        </div>
      </div>
    </Sidebar>
  )
}
