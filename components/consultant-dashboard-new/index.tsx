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
  const projectExists = data?.projects?.projects?.length > 0;
  return (
    <>
      <div className="-mt-5 w-[101%] relative left-[-1%] mx-auto mb-4">
        <WelcomeHeader />
      </div>
      <div className="bg-[#F4F5F8] md:bg-background-main rounded-xl relative top-[-2rem] md:-top-0">
        <main className="min-h-screen shadow-md rounded-xl p-4 md:px-6 md:py-5">
          <div className="">
            {/* {
              data?.profile.profile_strength && Number(data?.profile.profile_strength?.replace('%', '')) < 100 && (
                <ProfileSetupBanner completionPercentage={Number(data?.profile.profile_strength?.replace('%', ''))} />
              )
            } */}
            {/* Top Section: Calendar, Earnings, Payment */}
            <div className='col-span-1 md:col-span-7 flex mb-6 md:hidden flex-col gap-2'>
              <EarningsCard data={data}/>
              <NextPaymentCard data={data} />
              <div className='col-span-1 shadow-custom md:col-span-2 rounded-xl md:mt-0 mt-3'>
                    <div className=' bg-white p-4 md:p-2 flex justify-center items-start md:items-center flex-col gap-3 rounded-xl h-full'>
                      <p className='text-xs font-bold font-manrope'>My Total Earnings</p>
                      <p className='text-3xl md:text-4xl font-bold font-manrope'>$ {data?.payment?.projected_earning || 0}</p>
                    </div>
                  </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-9 gap-1 mb-6">
              {/* Calendar - Takes 1 column on desktop */}
              <div className='col-span-1 md:col-span-4'>
                <CalendarWidget data={data}/>
              </div>

              {/* Right side: Earnings and Payment stacked */}
              <div className="flex flex-col gap-3 col-span-1 md:col-span-5">
                <div className='grid grid-cols-1 md:grid-cols-9 gap-2'>
                  <div className='col-span-1 md:col-span-7 hidden md:flex flex-col gap-2'>
                    <EarningsCard data={data}/>
                    <NextPaymentCard data={data} />
                  </div>
                  {/* 0 0px 4px 1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1) */}
                  <div className='col-span-1 md:block hidden shadow-custom md:col-span-2 rounded-xl md:mt-0 mt-3'>
                    <div className=' bg-white text-  p-2 flex justify-center items-center flex-col gap-3 rounded-xl h-full'>
                      <p className='text-xl md:text-4xl font-bold font-manrope'>$ {data?.payment?.projected_earning || 0}</p>
                      <p className='text-sm font-bold font-manrope'>My Total Earnings</p>
                    </div>
                  </div>
                </div>
                {/* Middle Section: Projects, Active Projects, Profile */}
                <div className="mt-1">
                  <ProjectsCard data={data}/>
                  {/* <div className="md:col-span-1 lg:col-span-1">
                    <ActiveProjects />
                  </div> */}
                   <div className="md:col-span-5 mt-2 col-span-full md:block hidden">
                    <ProfileCard data={data}/>
                  </div>
                  
                </div>
              </div>
            </div>

            <div className='grid grid-cols-9 gap-2'>
              <div className='col-span-full'>
                <DocumentsCard data={data} />
              </div>
              {/* <div className="md:col-span-5 col-span-full">
                    <ProfileCard data={data}/>
                  </div> */}
              <div className="md:col-span-5 mt-2 col-span-full md:hidden block">
                <ProfileCard data={data}/>
              </div>
            </div>
          </div>
        </main>

      </div>
    </>
  );
}
