'use client';

import React from 'react';
import { Calendar, Wallet } from 'lucide-react';
import { DashboardData } from '@/types/dashboard';
import { formatNumberWithCommas } from '@/utils/formatNumber';

export const EarningsCard: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    // <div className="bg-[#4A7AB5] shadow-custom flex items-center rounded-lg px-5 py-3 text-white h-24">
    <div className="bg-[#00000005] border border-brand-blue shadow-custom flex items-center rounded-lg px-5 py-3 text-brand-blue h-24">
      <div className="flex items-center justify-start flex-1">
        <div className='flex-1 md:max-w-[80%]'>
          <div className="mb-2 flex items-center gap-1.5">
            <p className="text-xs font-thin opacity-90 font-neue">Projected Earnings</p>
            <div className="group relative inline-flex items-center">
              <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-brand-blue/30 bg-brand-blue text-[10px] font-semibold text-white shadow-sm">
                i
              </span>
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-64 -translate-x-1/2 rounded-lg border border-brand-blue/30 bg-brand-blue px-3 py-2 text-center text-[11px] leading-5 text-white shadow-xl group-hover:block">
                We calculate your projected earnings on the basis of hours availability and your rate/hr for current month
              </span>
            </div>
          </div>
          <h2 className="text-xl font-neue">${data?.payment?.projected_earning || 0}</h2>
        </div>
        <Wallet className="w-6 h-6 " />
      </div>
    </div>
  );
};
