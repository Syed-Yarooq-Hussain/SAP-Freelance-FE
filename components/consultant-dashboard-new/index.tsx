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

export default function DashboardPage({ data }: { data: DashboardData }) {
  return (
    <main className="min-h-screen shadow-md rounded-xl p-4 md:p-8">
      <div className="">
        {/* Top Section: Calendar, Earnings, Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Calendar - Takes 1 column on desktop */}
          <div className="lg:col-span-1">
            <CalendarWidget data={data}/>
          </div>

          {/* Right side: Earnings and Payment stacked */}
          <div className="flex flex-col gap-6">
            <EarningsCard data={data}/>
            <NextPaymentCard data={data} />
            {/* Middle Section: Projects, Active Projects, Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
  );
}
