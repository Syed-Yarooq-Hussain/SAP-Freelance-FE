'use client';

import { DashboardData } from '@/types/dashboard';
import { ymd } from '@/utils/dateTime';
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl px-3 py-4 border border-gray-400 text-start">
      <p className="text-xs font-manrope font-medium text-gray-600 mb-2">{label}</p>
      <p className="text-xl font-neue text-gray-900">{value}</p>
      {icon && <span className="text-2xl mt-2 inline-block">{icon}</span>}
    </div>
  );
};

export const StatsCards: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Weekly Availability" value={data?.calender?.weekly_availability || '0'} />
      <StatCard label="Interview Schedule" value={data?.calender?.interview_schedule || '0'} />
      <StatCard label="Next Interview" value={data?.calender?.next_interview ? ymd(new Date(data?.calender?.next_interview as any)) : '-'} />
    </div>
  );
};
