'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { WorkExperienceTab } from '../profile/work-experience-tab'
import { CertificationsTab } from '../profile/certification-tab'
import { EducationTab } from '../profile/education-tab'

import { FileUp } from 'lucide-react'
import { type WorkExperienceFormData } from '@/lib/schemas/experience'
import { type CertificationFormData } from '@/lib/schemas/certification'
import { type EducationFormData } from '@/lib/schemas/education'
import { useAppSelector, useAppDispatch } from '@/lib/store/hook'
import { updateConsultantProfile } from '@/services/consultants'
import { getConsultantMeService } from '@/services/getConsultantProfile'
import { updateUser } from '@/lib/store/features/user/userSlice'
import { ProjectsTab } from '../profile/projects-tab'
import { ProjectFormData } from '@/lib/schemas/projects'


const tabs = [
  { id: 'work-experience', label: 'Work Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
]

export function ProfessionalInfo() {
  const [activeTab, setActiveTab] = useState('work-experience')
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)

  const workExperience = user?.work_experiences || []
  const certifications = user?.certification || []
  const education = user?.education || []

  // const [workExperience, setWorkExperience] = useState<WorkExperienceFormData[]>(user?.work_experiences || [])
  // const [certifications, setCertifications] = useState<CertificationFormData[]>(user?.certification || [])
  // const [education, setEducation] = useState<EducationFormData[]>(user?.education || [])
  // const [internalCVModalOpen, setInternalCVModalOpen] = useState(false)
  // // const isControlled = cvModalOpen !== undefined
  // // const isCVModalOpen = isControlled ? cvModalOpen : internalCVModalOpen
  // // const handleCloseCVModal = () => (isControlled ? onCloseCVModal?.() : setInternalCVModalOpen(false))

  // // Update state when user data changes
  // useEffect(() => {
  //   if (user) {
  //     setWorkExperience(user.work_experiences || [])
  //     setCertifications(user.certification || [])
  //     setEducation(user.education || [])
  //   }
  // }, [user])

  // Helper function to update consultant profile via API
  const updateProfile = async (payload: {
    work_experiences?: WorkExperienceFormData[]
    education?: EducationFormData[]
    certification?: CertificationFormData[],
    projects?: ProjectFormData[],
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
    // setWorkExperience(updated)
    await updateProfile({ work_experiences: updated })
  }

  const handleEditWorkExperience = async (index: number, data: WorkExperienceFormData) => {
    const updated = workExperience.map((item:any, i:any) => (i === index ? data : item))
    // setWorkExperience(updated)
    await updateProfile({ work_experiences: updated })
  }

  const handleDeleteWorkExperience = async (index: number) => {
    const updated = workExperience.filter((_:any, i:any) => i !== index)
    // setWorkExperience(updated)
    await updateProfile({ work_experiences: updated })
  }

  const handleAddCertification = async (data: CertificationFormData) => {
    const updated = [...certifications, data]
    // setCertifications(updated)
    await updateProfile({ certification: updated })
  }

  const handleEditCertification = async (index: number, data: CertificationFormData) => {
    const updated = certifications.map((item:any, i:any) => (i === index ? data : item))
    // setCertifications(updated)
    await updateProfile({ certification: updated })
  }

  const handleDeleteCertification = async (index: number) => {
    const updated = certifications.filter((_:any, i:any) => i !== index)
    // setCertifications(updated)
    await updateProfile({ certification: updated })
  }

  const handleAddEducation = async (data: EducationFormData) => {
    const updated = [...education, data]
    // setEducation(updated)
    await updateProfile({ education: updated })
  }

  const handleEditEducation = async (index: number, data: EducationFormData) => {
    const updated = education.map((item:any, i:any) => (i === index ? data : item))
    // setEducation(updated)
    await updateProfile({ education: updated })
  }

  const handleDeleteEducation = async (index: number) => {
    const updated = education.filter((_:any, i:any) => i !== index)
    // setEducation(updated)
    await updateProfile({ education: updated })
  }

  const handleAddProject = async (data: ProjectFormData) => {
    const projects = user?.projects || []
    const updated = [...projects, data]
    // setProjects(updated)
    await updateProfile({ projects: updated })
  }

  const handleEditProject = async (index: number, data: ProjectFormData) => {
    const projects = user?.projects || []
    const updated = projects.map((item:any, i:any) => (i === index ? data : item))
    // setProjects(updated)
    await updateProfile({ projects: updated })
  }

  const handleDeleteProject = async (index: number) => {
    const projects = user?.projects || []
    const updated = projects.filter((_:any, i:any) => i !== index)
    // setProjects(updated)
    await updateProfile({ projects: updated })
  }
  return (
    <div className="border border-slate-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="bg-[#EAF1FB] p-2 rounded-xl flex items-center justify-center text-sm">
            <Briefcase className="w-4 h-4" />
          </span>
          Professional Information
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-brand-yellow rounded-xl p-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium text-sm rounded-xl flex-1 whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-white'
                : 'text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'work-experience' && <WorkExperienceTab
            data={workExperience}
            onAdd={handleAddWorkExperience}
            onEdit={handleEditWorkExperience}
            onDelete={handleDeleteWorkExperience}
          />}
        {activeTab === 'certifications' && <CertificationsTab data={certifications} onAdd={handleAddCertification} onEdit={handleEditCertification} onDelete={handleDeleteCertification} />}
        {activeTab === 'education' && <EducationTab data={education} onAdd={handleAddEducation} onEdit={handleEditEducation} onDelete={handleDeleteEducation} />}
        {activeTab === 'projects' && (
          <ProjectsTab data={user?.projects || []} onAdd={handleAddProject} onEdit={handleEditProject} onDelete={handleDeleteProject} />
        )}
      </div>
    </div>
  )
}
