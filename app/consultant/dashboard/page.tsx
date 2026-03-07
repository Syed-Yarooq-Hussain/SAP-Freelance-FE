'use client';

import { useConsultantDashboard } from '@/actions/consultants/useConsultantDashboard';
import { DashboardCard } from '@/components/consultant-dashboard/dashboard-card';
import { WelcomeHeader } from '@/components/consultant-dashboard/welcome-header';
import { Badge } from '@/components/homepage/ui/badge';
import Sidebar from '@/components/Sidebar';
import { useAppSelector } from '@/lib/store/hook';
import { APP_ROUTES } from '@/utils/app_routes';
import { Calendar, Briefcase, CreditCard, FileText, User, Check, CircleCheck, CircleCheckBig, CircleAlert } from 'lucide-react';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Dashboard() {
    const { data: dashboardData } = useConsultantDashboard();
  return (
    <Sidebar>
        <main className="min-h-screen bg-background p-8">
        <div className="max-w-screen-2xl mx-auto">
            <WelcomeHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Calendar Card */}
            <DashboardCard
                icon={<Calendar className="w-5 h-5 text-blue-600" />}
                title="Calendar"
                href={APP_ROUTES.CONSULTANT.CALENDAR}
            >
                <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Weekly Availability</span>
                    <span className="text-lg font-semibold text-foreground">
                    {dashboardData?.calender?.weekly_availability} hrs
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Interviews Scheduled</span>
                    <span className="text-lg font-semibold text-foreground bg-gray-50 px-2 py-1 rounded-md">
                    {dashboardData?.calender?.interview_schedule}
                    </span>
                </div>
                {dashboardData?.calender?.next_interview && <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground mb-1">Next Interview</p>
                    <p className="font-semibold text-foreground">
                    {formatDate(dashboardData?.calender?.next_interview)}
                    </p>
                </div>}
                </div>
            </DashboardCard>

            {/* Projects Card */}
            <DashboardCard
                icon={<Briefcase className="w-5 h-5 text-green-600" />}
                title="Projects"
                href={APP_ROUTES.CONSULTANT.PROJECTS}
            >
                <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Projects</span>
                    <span className="text-lg font-semibold text-foreground">
                    {dashboardData?.projects?.total_projects}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Badge variant="secondary" className="bg-green-600 text-white">
                    {dashboardData?.projects?.active}
                    </Badge>
                </div>
                <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground mb-2">Recent Clients</p>
                    <ul className="space-y-1">
                    {dashboardData?.projects?.projects.slice(0, 3).map((project, idx) => (
                        <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                        <span className="text-muted-foreground">•</span>
                        {project}
                        </li>
                    ))}
                    </ul>
                    {dashboardData?.projects && dashboardData?.projects?.projects && dashboardData?.projects?.projects?.length > 3 && (
                    <p className="text-sm text-blue-600 mt-2 cursor-pointer hover:underline">
                        +{dashboardData?.projects?.projects?.length - 3} more
                    </p>
                    )}
                </div>
                </div>
            </DashboardCard>

            {/* Payments Card */}
            <DashboardCard
                icon={<CreditCard className="w-5 h-5 text-purple-600" />}
                title="Payments"
                href={APP_ROUTES.CONSULTANT.PAYMENTS}
            >
                <div className="space-y-4">
                <div className="bg-pink-50 p-4 rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Next Payment</p>
                    <p className="text-2xl font-bold text-foreground">
                    ${dashboardData?.payment?.next_payment?.toLocaleString()}
                    </p>
                </div>
                <div className="border-t pt-4">
                    <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-muted-foreground">Projected Earnings</p>
                        <p className="text-xl font-semibold text-foreground">
                        ${dashboardData?.payment?.projected_earning?.toLocaleString()}
                        </p>
                    </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                    Based on current availability & rate
                    </p>
                </div>
                </div>
            </DashboardCard>

            {/* Documents Card */}
            <DashboardCard
                icon={<FileText className="w-5 h-5 text-orange-600" />}
                title="Documents"
                href={APP_ROUTES.CONSULTANT.DOCUMENTS}
            >
                <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <CircleCheckBig className="w-4 h-4 text-green-600" />
                    Uploaded
                    </span>
                    <span className="text-lg font-semibold text-foreground">5</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <CircleAlert className="w-4 h-4 text-orange-600" />
                    Pending
                    </span>
                    <span className="text-lg font-semibold text-orange-600">
                    {dashboardData?.documents?.pending}
                    </span>
                </div>
                <button className="w-full mt-2 py-2 px-3 border border-gray-300 rounded-xl text-sm font-medium text-foreground hover:bg-gray-50 transition-colors">
                    ⬇ Add Documents
                </button>
                </div>
            </DashboardCard>

            {/* Profile Card */}
            <DashboardCard
                icon={<User className="w-5 h-5 text-indigo-600" />}
                title="Profile"
                href={APP_ROUTES.CONSULTANT.PROFILE}
            >
                <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground mb-2">Profile Completion</p>
                        <p className="text-sm font-semibold text-foreground">
                        {dashboardData?.profile?.profile_strength}
                        </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: dashboardData?.profile?.profile_strength }}
                    />
                    </div>
                    
                </div>
                <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground mb-2">Verification Status</p>
                    <Badge className="bg-blue-600 text-white">
                    <CircleCheckBig className="w-4 h-4 text-white mr-1" /> {dashboardData?.profile?.badges?.[0]}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground italic">
                    Complete profile to get verified & certified
                </p>
                </div>
            </DashboardCard>
            </div>
        </div>
        </main>
    </Sidebar>
  );
}
