'use client';

import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '../homepage/ui/button';
import { DashboardData } from '@/types/dashboard';
import { APP_ROUTES } from '@/utils/app_routes';
import { useRouter } from 'next/navigation';

export const DocumentsCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="flex shadow-custom flex-col justify-between rounded-lg p-3 border h-full border-[#E5E5E5] bg-white md:bg-transparent">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className='bg-[#FEF8E8] rounded-xl p-2'>
            <FileText className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-sm text-gray-900 font-neue">Documents</h3>
        </div>

        <div className="flex gap-4 mb-2">
          <div className="bg-brand-pink border border-[#E5DBDB] w-full md:w-1/4 rounded-lg p-4 text-start">
            <p className="text-xs font-manrope font-bold mb-1">Uploaded</p>
            <p className="text-xl font-neue text-gray-900">{data?.documents?.upcoming || 0}</p>
          </div>
          <div className="bg-brand-pink border border-[#E5DBDB] w-full md:w-1/4 rounded-lg p-4 text-start">
            <p className="text-xs font-manrope font-bold mb-1">Pending</p>
            <p className="text-xl font-neue text-gray-900">{data?.documents?.pending || 0}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end justify-self-end">
        <Button onClick={() => router.push(APP_ROUTES.CONSULTANT.DOCUMENTS)} className="w-fit !text-xs bg-white border rounded-xl border-black">
          <Plus className="w-4 h-4 mr-2" />
          Add Documents
        </Button>
      </div>
    </div>
  );
};
