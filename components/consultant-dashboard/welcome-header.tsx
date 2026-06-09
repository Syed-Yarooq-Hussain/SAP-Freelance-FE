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

  const badgeConfig: Record<string, { bg: string; label: string; icon: 'check' | 'shield' }> = {
    VERIFIED: { bg: 'bg-[#2E6E2D]', label: 'Verified', icon: 'check' },
    CERTIFIED: { bg: 'bg-[#3088B7]', label: 'Certified', icon: 'shield' },
    SENIOR_EXPERT: { bg: 'bg-purple-600', label: 'Senior Expert', icon: 'check' },
    EXPERT: { bg: 'bg-indigo-600', label: 'Expert', icon: 'check' },
    SOLUTION_ARCHITECT: { bg: 'bg-pink-600', label: 'Solution Architect', icon: 'check' },
  };

  const displayBadges = (user?.badges || [])
    .map((badge: string) => badgeConfig[badge])
    .filter(Boolean)
    .slice(0, 2);

  const initials = (user?.user?.username || 'U')
    .split(' ')
    .filter(Boolean)
    .map((part: string) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 1);

  return (
    <div className="px-0 py-0 sm:p-5 md:px-12 md:py-4 bg-white">
      <div style={{ backgroundImage: 'linear-gradient(360deg, #134481 -18.69%, #4A7AB5 89.76%)'}} className="md:hidden px-4 pt-5 pb-10 sm:px-6 sm:py-6 text-white shadow-custom">
        <div className="mx-auto max-w-3xl">
          {/* <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2D5C9A] font-bold">
              {initials}
            </div>
            <p className="text-[30px] font-bold font-neue tracking-tight leading-none">Vertex9</p>
          </div> */}

          <h1 className="text-lg md:text-4xl text-center font-bold font-neue tracking-tight mb-2">
            Welcome, {user?.user?.username || 'User'}! 👋
          </h1>

          <div className="flex items-center justify-center gap-1.5 sm:flex-row sm:justify-center sm:gap-4 text-xxs text-white/95">
            <span className="flex items-center gap-2 min-w-0">
              <MapPin size={16} className="flex-shrink-0" />
              <span className="truncate">{user?.user?.city || ''} {user?.user?.country || ''}</span>
            </span>
            <span className="hidden sm:inline text-white/70">•</span>
            <span className="flex items-center gap-2 min-w-0">
              <Calendar size={16} className="flex-shrink-0" />
              <span className="truncate">{date}</span>
            </span>
          </div>

          {displayBadges.length > 0 ? (
            <div className="mt-4 flex items-center justify-center gap-3">
              {displayBadges.map((config: { bg: string; label: string; icon: 'check' | 'shield' }, idx: number) => (
                <div
                  key={`${config.label}-${idx}`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-white text-xxs font-semibold ${config.bg}`}
                >
                  {config.icon === 'shield' ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {config.label}
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-white/20 bg-white/10 p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Clock className="w-5 h-5 flex-shrink-0 text-white" />
                </div>
                <p className="text-lg font-neue text-white tabular-nums leading-none">
                  {time}
                </p>
              </div>
              <span className="rounded-lg bg-white px-2 py-1 text-[#2D5C9A] font-semibold text-xs leading-none">
                GMT
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6  px-4 py-3 sm:p-5 md:px-0 md:py-0">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-xl sm:text-lg md:text-3xl font-light text-black break-words font-neue">
              Welcome, {user?.user?.username || ''}
            </h1>
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

        <div className="flex shadow-custom items-center justify-center gap-2 bg-[#00000005] border border-brand-blue rounded-[7px] px-4 md:px-7 py-2 w-full lg:w-auto">
          <Clock className="w-8 h-8 flex-shrink-0 text-brand-blue" />
          <div className="text-center">
            <p className="text-xxs font-thin text-brand-blue tracking-wide">GMT TIME ZONE</p>
            <p className="text-lg sm:text-lg md:text-lg font-neue text-brand-blue tabular-nums">{time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
