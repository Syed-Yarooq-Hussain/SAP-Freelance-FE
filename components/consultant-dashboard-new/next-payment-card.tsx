'use client';

import React from 'react';
import { DashboardData } from '@/types/dashboard';
import { CreditCard } from 'lucide-react';

export const NextPaymentCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="flex items-center justify-start bg-brand-pink rounded-xl p-6 border border-[#E5E5E5]">
      <div className='flex-1 md:max-w-[80%]'>
        <p className="text-sm font-medium text-gray-600 mb-2">Next Payment</p>
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold text-gray-900">${data?.payment?.next_payment || 0}</h2>
        </div>
      </div>
      <CreditCard className="w-6 h-6" />
    </div>
  );
};
