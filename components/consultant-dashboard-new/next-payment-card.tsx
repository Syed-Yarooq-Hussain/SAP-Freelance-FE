'use client';

import React from 'react';
import { DashboardData } from '@/types/dashboard';
import { CreditCard } from 'lucide-react';

export const NextPaymentCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    // <div className="flex items-center shadow-custom justify-start bg-brand-pink rounded-lg px-5 py-3 border border-[#E5E5E5] h-24">
    <div className="flex bg-[#00000005] border border-brand-blue items-center shadow-custom justify-start rounded-lg px-5 py-3  h-24">
      <div className='flex-1 md:max-w-[80%]'>
        <p className="text-xs font-thin text-brand-blue mb-2 font-neue">Next Payment</p>
        <div className="flex items-center justify-between">
          <h2 className="text-4xl text-brand-blue font-neue">${data?.payment?.next_payment || 0}</h2>
        </div>
      </div>
      <CreditCard className="w-6 h-6 text-brand-blue" />
    </div>
  );
};
