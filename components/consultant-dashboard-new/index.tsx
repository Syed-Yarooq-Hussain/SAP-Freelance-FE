'use client';

import React from 'react';
import { CalendarWidget } from './calendar-widget';
import { EarningsCard } from './earning-card';
import { NextPaymentCard } from './next-payment-card';
import { ProjectsCard } from './project-card';
import { ActiveProjects } from './active-projects';
import { ProfileCard } from './profile-card';
import { StatsCards } from './stats-card';
import { TodaySchedule } from './today-schedule';
import { DocumentsCard } from './document-card';
import { DashboardData } from '@/types/dashboard';
import { WelcomeHeader } from '../consultant-dashboard/welcome-header';
import { ProfileSetupBanner } from './profile-setup-banner';

export default function DashboardPage({ data }: { data: DashboardData }) {
  return (
    <>
      <div className="-mt-3 w-[101%] relative left-[-1%] mx-auto mb-4">
        <WelcomeHeader />
      </div>
      <div className="bg-background-main rounded-xl">
        <main className="min-h-screen shadow-md rounded-xl p-4 md:p-8">
          <div className="">
            {
              data?.profile.profile_strength && Number(data?.profile.profile_strength?.replace('%', '')) < 100 && (
                <ProfileSetupBanner completionPercentage={Number(data?.profile.profile_strength?.replace('%', ''))} />
              )
            }
            {/* Top Section: Calendar, Earnings, Payment */}
            <div className="grid grid-cols-1 md:grid-cols-9 gap-1 mb-6">
              {/* Calendar - Takes 1 column on desktop */}
              <div className='col-span-1 md:col-span-4'>
                <CalendarWidget data={data}/>
              </div>

              {/* Right side: Earnings and Payment stacked */}
              <div className="flex flex-col gap-3 col-span-1 md:col-span-5">
                <EarningsCard data={data}/>
                <NextPaymentCard data={data} />
                {/* Middle Section: Projects, Active Projects, Profile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-10">
                  <ProjectsCard data={data}/>
                  {/* <div className="md:col-span-1 lg:col-span-1">
                    <ActiveProjects />
                  </div> */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <ProfileCard data={data}/>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div>
                <DocumentsCard data={data} />
              </div>
            </div>
          </div>
        </main>

      </div>
    </>
  );
}
