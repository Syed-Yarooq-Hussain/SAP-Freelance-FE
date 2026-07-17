'use client';

import { Clock } from 'lucide-react';
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
    <div className="mt-4 md:mt-8 md:bg-transparent bg-white md:rounded-none rounded-box-xl md:p-0 p-3">
      <h3 className="flex items-center gap-2 font-medium text-sm text-gray-900 font-neue mb-4">
        <div className="bg-brand-blue/10 rounded-xl p-2 md:hidden block ">
          <Clock className="w-5 h-5 text-[#3088B7]" />
        </div>
        Today&apos;s Schedule
      </h3>

      <div className="space-y-2">
        {/* {scheduleItems.map((item, idx) => (
          <div key={idx} className="flex flex-row gap-y-2 rounded-md items-center gap-4 py-2 px-2 bg-brand-yellow last:border-0">
            
            <div className="flex flex-row sm:items-center justify-between gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="flex md:flex-row items-start md:items-center flex-col gap-1 md:gap-3 flex-1">
                <p className="text-[10px] font-medium text-gray-900 flex items-center gap-3 min-w-0">
                  <span className="w-1 bg-success rounded-full flex-shrink-0 h-5" />
                  <span className="truncate font-manrope">{item.title}</span>
                </p>
                <p className="text-[9px] text-gray-500 truncate sm:max-w-[180px] font-manrope">{item.company}</p>
              </div>

              <div className="flex md:flex-row flex-col gap-1  flex-1 md:items-center items-end md:justify-around justify-between">
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
          </div>
        ))} */}
        <p className="text-center text-sm text-gray-500 font-manrope rounded-md items-center gap-4 py-2 px-2 bg-brand-yellow last:border-0" >Your scheduled meetings will appear here</p>
      </div>
    </div>
  );
};
