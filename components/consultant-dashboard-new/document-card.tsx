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
    <div className="rounded-xl p-6 border border-[#E5E5E5]">
      <div className="flex items-center gap-2 mb-6">
        <div className='bg-[#FEF8E8] rounded-xl p-2'>
          <FileText className="w-5 h-5 text-yellow-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Documents</h3>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="bg-white border border-[#E5DBDB] w-full md:w-1/4 rounded-xl p-4 text-start">
          <p className="text-xs text-gray-600 mb-1">Uploaded</p>
          <p className="text-3xl font-bold text-gray-900">{data?.documents?.upcoming || 0}</p>
        </div>
        <div className="bg-white border border-[#E5DBDB] w-full md:w-1/4 rounded-xl p-4 text-start">
          <p className="text-xs text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-gray-900">{data?.documents?.pending || 0}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => router.push(APP_ROUTES.CONSULTANT.DOCUMENTS)} className="w-fit bg-white border rounded-xl border-black">
          <Plus className="w-4 h-4 mr-2" />
          Add Documents
        </Button>
      </div>
    </div>
  );
};
