'use client';

import React from 'react';
import { AlertCircle, Clock, Star } from 'lucide-react';
import { Button } from '../homepage/ui/button';
import { DashboardData } from '@/types/dashboard';
import { APP_ROUTES } from '@/utils/app_routes';
import { useRouter } from 'next/navigation';

export const ProfileCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="rounded-xl shadow-custom p-4 border border-[#E5E5E5] md:bg-transparent bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white font-bold">
          AA
        </div>
        <div>
          <h3 className="font-medium text-sm text-gray-900 font-neue">Profile</h3>
        </div>
      </div>

      <div className="mb-6">
        {!data?.profile?.badges.includes('VERIFIED') && <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-medium text-yellow-600">Verification Pending</span>
        </div>}
        <h4 className="font-semibold text-sm font-manrope text-gray-900">{data?.profile?.name}</h4>
        <p className="text-xs text-gray-500">{data?.profile?.modules || ''}</p>
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium text-gray-600 mb-2">Profile Completion</p>
        <div className="w-full bg-[#F5F3EF] rounded-full h-2">
          <div className="bg-brand-blue h-2 rounded-full" style={{ width: `${data?.profile?.profile_strength || '0%'}` }}></div>
        </div>
      </div>

          <div className='flex flex-col md:flex-row items-center gap-2'>
      <Button className="flex-1 w-full md:w-auto !text-xs bg-brand-blue text-white rounded-xl h-10 hover:bg-[#2670A0]">
        <Clock className="w-2 h-2 " /> Complete your profile now
      </Button>

      <Button onClick={() => router.push(APP_ROUTES.CONSULTANT.PROFILE)} variant="outline" className="flex-1 w-full md:w-auto h-10 !text-xs rounded-xl text-success">
        <Star className="w-4 h-4" /> Add your certifications
      </Button>

          </div>
    </div>
  );
};
