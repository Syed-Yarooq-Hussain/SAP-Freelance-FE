'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { ActiveProjects } from './active-projects';
import { DashboardData } from '@/types/dashboard';

export const ProjectsCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="rounded-lg p-4 border border-[#E5E5E5] shadow-custom">
      <div className="flex items-center gap-2 mb-6">
        <div className='bg-[#4A7BB51A] rounded-xl p-2'>
          <FileText className="w-5 h-5 text-[#3088B7]" />
        </div>
        <h3 className="font-medium text-sm text-gray-900 font-neue">Projects</h3>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex flex-1 flex-col justify-start items-start bg-brand-pink rounded-xl px-4 py-2 border border-[#E5E5E5]">
          <span className="text-xs text-gray-600 font-manrope">Total Projects</span>
          <span className="text-2xl font-neue text-gray-900">{data?.projects?.total_projects || 0}</span>
        </div>
        <div className="flex flex-1 flex-col justify-start items-start bg-brand-pink rounded-xl px-4 py-2 border border-[#E5E5E5]">
          <span className="text-xs text-gray-600 font-manrope">Active Projects</span>
          <span className="text-2xl font-neue text-gray-900">{data?.projects?.active || 0}</span>
        </div>
      </div>
      <ActiveProjects data={data as DashboardData} />
    </div>
  );
};
