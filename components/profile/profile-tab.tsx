'use client'

import { useState, useEffect } from 'react'
import { FileUp } from 'lucide-react'
import { WorkExperienceTab } from './work-experience-tab'
import { CertificationsTab } from './certification-tab'
import { EducationTab } from './education-tab'
import { CVUploadModal } from './cv-upload-modal'
import { type WorkExperienceFormData } from '@/lib/schemas/experience'
import { type CertificationFormData } from '@/lib/schemas/certification'
import { type EducationFormData } from '@/lib/schemas/education'
import { useAppSelector, useAppDispatch } from '@/lib/store/hook'
import { updateConsultantProfile } from '@/services/consultants'
import { getConsultantMeService } from '@/services/getConsultantProfile'
import { updateUser } from '@/lib/store/features/user/userSlice'


interface ProfileTabsProps {
  /** When provided, CV modal open state is controlled by the parent (e.g. opened from ProfileHero). */
  cvModalOpen?: boolean
  onCloseCVModal?: () => void
}

export function ProfileTabs({ cvModalOpen, onCloseCVModal }: ProfileTabsProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const [activeTab, setActiveTab] = useState<'experience' | 'certifications' | 'education'>(
    'experience'
  )
  const [workExperience, setWorkExperience] = useState<WorkExperienceFormData[]>(user?.work_experiences || [])
  const [certifications, setCertifications] = useState<CertificationFormData[]>(user?.certification || [])
  const [education, setEducation] = useState<EducationFormData[]>(user?.education || [])
  const [internalCVModalOpen, setInternalCVModalOpen] = useState(false)
  const isControlled = cvModalOpen !== undefined
  const isCVModalOpen = isControlled ? cvModalOpen : internalCVModalOpen
  const handleCloseCVModal = () => (isControlled ? onCloseCVModal?.() : setInternalCVModalOpen(false))

  // Update state when user data changes
  useEffect(() => {
    if (user) {
      setWorkExperience(user.work_experiences || [])
      setCertifications(user.certification || [])
      setEducation(user.education || [])
    }
  }, [user])

  // Helper function to update consultant profile via API
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

  // API calls
  const handleAddWorkExperience = async (data: WorkExperienceFormData) => {
    const updated = [...workExperience, data]
    setWorkExperience(updated)
    await updateProfile({ work_experiences: updated })
  }

  const handleEditWorkExperience = async (index: number, data: WorkExperienceFormData) => {
    const updated = workExperience.map((item, i) => (i === index ? data : item))
    setWorkExperience(updated)
    await updateProfile({ work_experiences: updated })
  }

  const handleDeleteWorkExperience = async (index: number) => {
    const updated = workExperience.filter((_, i) => i !== index)
    setWorkExperience(updated)
    await updateProfile({ work_experiences: updated })
  }

  const handleAddCertification = async (data: CertificationFormData) => {
    const updated = [...certifications, data]
    setCertifications(updated)
    await updateProfile({ certification: updated })
  }

  const handleEditCertification = async (index: number, data: CertificationFormData) => {
    const updated = certifications.map((item, i) => (i === index ? data : item))
    setCertifications(updated)
    await updateProfile({ certification: updated })
  }

  const handleDeleteCertification = async (index: number) => {
    const updated = certifications.filter((_, i) => i !== index)
    setCertifications(updated)
    await updateProfile({ certification: updated })
  }

  const handleAddEducation = async (data: EducationFormData) => {
    const updated = [...education, data]
    setEducation(updated)
    await updateProfile({ education: updated })
  }

  const handleEditEducation = async (index: number, data: EducationFormData) => {
    const updated = education.map((item, i) => (i === index ? data : item))
    setEducation(updated)
    await updateProfile({ education: updated })
  }

  const handleDeleteEducation = async (index: number) => {
    const updated = education.filter((_, i) => i !== index)
    setEducation(updated)
    await updateProfile({ education: updated })
  }

  // Handle CV autofill data
  const handleCVAutofill = (cvData: any) => {
    if (cvData?.consultant) {
      const { clients_summary, work_experiences: cvWorkExp, education: cvEducation, certifications: cvCertifications } = cvData.consultant
      const {username, city, country, phone, currency} = cvData.user
      const updatedWorkExp = cvWorkExp && Array.isArray(cvWorkExp) ? cvWorkExp : workExperience
      const updatedEducation = cvEducation && Array.isArray(cvEducation) ? cvEducation : education
      const updatedCertifications = cvCertifications && Array.isArray(cvCertifications) ? cvCertifications : certifications

      if (cvWorkExp && Array.isArray(cvWorkExp)) {
        setWorkExperience(cvWorkExp)
      }
      if (cvEducation && Array.isArray(cvEducation)) {
        setEducation(cvEducation)
      }
      if (cvCertifications && Array.isArray(cvCertifications)) {
        setCertifications(cvCertifications)
      }

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
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
      {/* Header; Autofill button is in ProfileHero when cvModalOpen is controlled */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Professional Information</h2>
        {!isControlled && (
          <button
            onClick={() => setInternalCVModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand-blue text-brand-blue font-semibold rounded-input hover:bg-brand-blue/5 transition-colors"
          >
            <FileUp className="w-4 h-4" />
            Autofill by Resume
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'experience', label: 'Work Experience' },
          { id: 'certifications', label: 'Certifications' },
          { id: 'education', label: 'Education' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-6">
        {activeTab === 'experience' && (
          <WorkExperienceTab
            data={workExperience}
            onAdd={handleAddWorkExperience}
            onEdit={handleEditWorkExperience}
            onDelete={handleDeleteWorkExperience}
          />
        )}

        {activeTab === 'certifications' && (
          <CertificationsTab
            data={certifications}
            onAdd={handleAddCertification}
            onEdit={handleEditCertification}
            onDelete={handleDeleteCertification}
          />
        )}

        {activeTab === 'education' && (
          <EducationTab
            data={education}
            onAdd={handleAddEducation}
            onEdit={handleEditEducation}
            onDelete={handleDeleteEducation}
          />
        )}
      </div>

      {/* CV Upload Modal */}
      <CVUploadModal
        isOpen={isCVModalOpen}
        onClose={handleCloseCVModal}
        onAutofill={handleCVAutofill}
      />
    </div>
  )
}
