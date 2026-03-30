'use client';

import React from 'react';
import { AlertCircle, Star } from 'lucide-react';
import { Button } from '../homepage/ui/button';
import { DashboardData } from '@/types/dashboard';
import { APP_ROUTES } from '@/utils/app_routes';
import { useRouter } from 'next/navigation';

export const ProfileCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="rounded-xl p-6 border border-[#E5E5E5]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#3088B7] rounded-lg flex items-center justify-center text-white font-bold">
          AA
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Profile</h3>
        </div>
      </div>

      <div className="mb-6">
        {!data?.profile?.badges.includes('VERIFIED') && <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-medium text-yellow-600">Verification Pending</span>
        </div>}
        <h4 className="font-semibold text-gray-900">{data?.profile?.name}</h4>
        <p className="text-xs text-gray-500">{data?.profile?.modules || ''}</p>
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium text-gray-600 mb-2">Profile Completion</p>
        <div className="w-full bg-[#F5F3EF] rounded-full h-2">
          <div className="bg-[#3088B7] h-2 rounded-full" style={{ width: `${data?.profile?.profile_strength || '0%'}` }}></div>
        </div>
      </div>

      <Button className="w-full bg-[#3088B7] text-white rounded-xl mb-3 hover:bg-[#2670A0]">
        ✓ Complete Profile & Get Certified
      </Button>

      <Button onClick={() => router.push(APP_ROUTES.CONSULTANT.PROFILE)} variant="outline" className="w-full rounded-xl text-sm text-success">
        <Star className="w-4 h-4" /> View SAP Certifications
      </Button>
    </div>
  );
};
