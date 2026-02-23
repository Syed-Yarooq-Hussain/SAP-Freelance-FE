'use client'

import { useState } from 'react'
import { ProfileView } from '@/components/account-settings/profile-view'
import { ProfileEdit } from '@/components/account-settings/profile-edit'
import { ProfileTabs } from '@/components/profile/profile-tab'
import Sidebar from '@/components/Sidebar'

// Mock data
const mockUserData = {
  name: 'John Doe',
  email: 'john@example.com',
  headline: 'Senior SAP Consultant',
  coreModules: ['SAP ECC', 'MM', 'FI'],
  otherModules: ['SAP Analytics Cloud'],
  availability: 'ASAP' as const,
  weeklyHours: 40,
  rate: 150,
  experience: 8,
  location: 'New York, USA',
  profileImage: '/api/placeholder/100/100',
  skills: [
    { name: 'SAP ECC', verified: true },
    { name: 'MM', verified: true },
    { name: 'FI', verified: false },
  ],
}

const mockWorkExperience = [
  {
    id: '1',
    companyName: 'Tech Solutions Inc.',
    industry: 'Information Technology',
    role: 'Senior SAP Consultant',
    startDate: new Date('2018-01-15'),
    endDate: new Date('2022-06-30'),
    description: 'Led SAP implementation projects for enterprise clients',
  },
  {
    id: '2',
    companyName: 'Global Systems',
    industry: 'Consulting',
    role: 'SAP Consultant',
    startDate: new Date('2015-03-20'),
    endDate: new Date('2017-12-31'),
    description: 'Implemented and configured SAP modules for manufacturing clients',
  },
]

const mockCertifications = [
  {
    id: '1',
    organizationName: 'SAP',
    certificationName: 'SAP Certified Associate – SAP Analytics Cloud',
    dateOfIssue: new Date('2023-05-15'),
    dateOfExpire: new Date('2026-05-15'),
  },
]

const mockEducation = [
  {
    id: '1',
    universityName: 'Stanford University',
    degree: 'Master of Science',
    field: 'Computer Science',
    startDate: new Date('2013-09-01'),
    endDate: new Date('2015-05-31'),
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Sidebar>
      <div className="min-h-screen bg-gradient-to-br from-white via-white to-cyan-50/70 py-8 px-4">
        <div>
            <div className="mb-8">
              <ProfileView
                onEdit={() => setIsEditing(true)}
                canEdit={false}
              />
            </div>

          {!isEditing && (
            <>
              <div className="h-px bg-slate-200 my-8" />

              {/* Profile Tabs */}
              <ProfileTabs/>
            </>
          )}
        </div>
      </div>
    </Sidebar>
  )
}
