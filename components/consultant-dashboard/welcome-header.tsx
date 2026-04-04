'use client';

import { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, Shield } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hook';


export function WelcomeHeader() {
  const user = useAppSelector(state => state.user.user);
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    // Set initial time and date
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);

      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = now.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = now.getDate();
      const year = now.getFullYear();
      setDate(`${dayName}, ${monthName} ${dayNum}, ${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const badgeConfig: Record<string, { bg: string; label: string }> = {
    VERIFIED: { bg: 'bg-blue-600', label: 'Verified' },
    CERTIFIED: { bg: 'bg-green-600', label: 'Certified' },
    SENIOR_EXPERT: { bg: 'bg-purple-600', label: 'Senior Expert' },
    EXPERT: { bg: 'bg-indigo-600', label: 'Expert' },
    SOLUTION_ARCHITECT: { bg: 'bg-pink-600', label: 'Solution Architect' },
  };

  return (
    <div className="bg-background-main max-h-auto md:max-h-[87px] px-4 py-3 sm:p-5 md:px-12 md:py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-xl sm:text-lg md:text-3xl font-light text-black break-words font-neue">
              Welcome, {user?.user?.username || 'User'}! 👋
            </h1>
            {/* <div className="flex gap-2">
              {user?.badges.slice(0, 2).map((badge: string) => {
                const config = badgeConfig[badge] || { bg: 'bg-gray-600', label: badge };
                return (
                  <div
                    key={badge}
                    className={`group flex items-center gap-2 overflow-hidden rounded-xl ${config.bg} py-1 pl-1.5 pr-1 text-white transition-all duration-200 hover:pr-2.5`}
                  >
                    {badge === 'VERIFIED' && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                    {badge === 'CERTIFIED' && <Shield className="w-3.5 h-3.5 flex-shrink-0" />}
                    {(badge === 'EXPERT' ||
                      badge === 'SENIOR_EXPERT' ||
                      badge === 'SOLUTION_ARCHITECT' ||
                      badge === 'JUNIOR' ||
                      badge === 'ASSOCIATE' ||
                      badge === 'MID_LEVEL' ||
                      badge === 'SENIOR' ||
                      badge === 'PRINCIPAL') && (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    ) && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                    <span className="inline-block max-w-0 font-bold overflow-hidden whitespace-nowrap text-xs opacity-0 transition-all duration-200 ease-out group-hover:max-w-[120px] group-hover:opacity-100">
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div> */}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-[9px] text-gray-500">
            <span className="flex items-center gap-2 min-w-0">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">{user?.user?.city || ''} {user?.user?.country || ''}</span>
            </span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="flex items-center gap-2 min-w-0">
              <Calendar size={12} className="flex-shrink-0" />
              <span className="truncate">{date}</span>
            </span>
          </div>
        </div>

        {/* Working Clock */}
        <div className="flex items-center justify-center gap-2 bg-brand-blue rounded-[7px] px-4 md:px-7 py-2 border border-gray-200 shadow-sm w-full lg:w-auto ">
          <Clock className="w-8 h-8 flex-shrink-0 text-white" />
          <div className="text-center">
            <p className="text-xxs font-thin text-white tracking-wide">GMT TIME ZONE</p>
            <p className="text-lg sm:text-lg md:text-lg font-neue text-white tabular-nums">{time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
