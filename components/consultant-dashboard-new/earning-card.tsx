'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { DashboardData } from '@/types/dashboard';

export const EarningsCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="bg-[#3088B7] rounded-xl p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium opacity-90 mb-2">Projected Earnings</p>
          <h2 className="text-4xl font-bold">${data?.payment?.projected_earning || 0}</h2>
        </div>
        <Calendar className="w-6 h-6 opacity-75" />
      </div>
    </div>
  );
};
