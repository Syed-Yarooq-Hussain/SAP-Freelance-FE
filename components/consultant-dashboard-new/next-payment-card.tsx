'use client';

import React from 'react';
import { DashboardData } from '@/types/dashboard';

export const NextPaymentCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
      <p className="text-sm font-medium text-gray-600 mb-2">Next Payment</p>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-gray-900">${data?.payment?.next_payment || 0}</h2>
        <div className="text-2xl">⚖️</div>
      </div>
    </div>
  );
};
