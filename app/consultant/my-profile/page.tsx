'use client'

import Sidebar from '@/components/Sidebar'
import { ConsultantProfilePageContent } from '@/components/profile-new/consultant-profile-page-content'

export default function MyProfilePage() {
  return (
    <Sidebar>
      <ConsultantProfilePageContent tourVariant="my_profile" />
    </Sidebar>
  )
}
