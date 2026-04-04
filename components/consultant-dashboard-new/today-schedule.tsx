'use client';

import React from 'react';

interface ScheduleItem {
  title: string;
  company: string;
  time: string;
  type: 'CLIENT' | 'INTERNAL';
}

const scheduleItems: ScheduleItem[] = [
  { title: 'Strategy Review', company: 'TechCorp Pvt Limited', time: '09:30 AM', type: 'CLIENT' },
  { title: 'Strategy Review', company: 'TechCorp Pvt Limited', time: '09:30 AM', type: 'CLIENT' },
  { title: 'Strategy Review', company: 'TechCorp Pvt Limited', time: '09:30 AM', type: 'CLIENT' },
];

export const TodaySchedule: React.FC = () => {
  return (
    <div className="mt-8">
      <h3 className="font-semibold text-xs text-gray-900 mb-4">Today&apos;s Schedule</h3>

      <div className="space-y-2">
        {scheduleItems.map((item, idx) => (
          <div key={idx} className="flex md:flex-row flex-col gap-y-2 rounded-md items-center gap-4 py-2 px-2 bg-brand-yellow last:border-0">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-900 flex items-center gap-3 min-w-0">
                <span className="w-1 bg-success rounded-full flex-shrink-0 h-5" />
                <span className="truncate font-manrope">{item.title}</span>
              </p>
              <p className="text-[9px] text-gray-500 truncate sm:max-w-[180px] font-manrope">{item.company}</p>
              <p className="text-[9px] text-gray-500 font-manrope">{item.time}</p>
              <p className={`text-[7px] font-bold px-2 py-1 rounded-xl flex-shrink-0 w-fit font-manrope ${
                item.type === 'CLIENT'
                  ? 'bg-[#E8F5E9] text-success'
                  : 'bg-[#E3F2FD] text-[#1976D2]'
              }`}>
                {item.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
