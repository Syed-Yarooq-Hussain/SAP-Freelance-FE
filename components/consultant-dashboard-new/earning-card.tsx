'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { DashboardData } from '@/types/dashboard';

export const EarningsCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="bg-brand-blue rounded-xl p-6 text-white">
      <div className="flex items-center justify-start mb-4">
        <div className='flex-1 md:max-w-[80%]'>
          <p className="text-sm font-medium opacity-90 mb-2">Projected Earnings</p>
          <h2 className="text-4xl font-bold">${data?.payment?.projected_earning || 0}</h2>
        </div>
        <Calendar className="w-6 h-6 opacity-75" />
      </div>
    </div>
  );
};
