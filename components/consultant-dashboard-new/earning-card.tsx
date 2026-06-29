'use client';

import React from 'react';
import { Calendar, Wallet } from 'lucide-react';
import { DashboardData } from '@/types/dashboard';

export const EarningsCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    // <div className="bg-[#4A7AB5] shadow-custom flex items-center rounded-lg px-5 py-3 text-white h-24">
    <div className="bg-[#00000005] border border-brand-blue shadow-custom flex items-center rounded-lg px-5 py-3 text-brand-blue h-24">
      <div className="flex items-center justify-start flex-1">
        <div className='flex-1 md:max-w-[80%]'>
          <p className="text-xs font-thin opacity-90 mb-2 font-neue">Projected Earnings</p>
          <h2 className="text-xl font-neue">${data?.payment?.projected_earning || 0}</h2>
        </div>
        <Wallet className="w-6 h-6 " />
      </div>
    </div>
  );
};
