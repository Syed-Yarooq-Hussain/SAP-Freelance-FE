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
          <div key={idx} className="flex rounded-xl items-center gap-4 py-3 px-2 bg-brand-yellow last:border-0">
            
            <div className="flex justify-between items-center flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 flex items-center gap-4"> <span className="w-1 bg-success rounded-full flex-shrink-0 h-5" /> {item.title}</p>
              <p className="text-xs text-gray-500">{item.company}</p>
              <p className="text-xs text-gray-500 mt-1">{item.time}</p>
              <p className={`text-[10px] font-bold px-2 py-1 rounded-xl flex-shrink-0 ${
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
