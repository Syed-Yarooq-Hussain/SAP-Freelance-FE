'use client';

import { useConsultantDashboard } from '@/actions/consultants/useConsultantDashboard';
import { DashboardCard } from '@/components/consultant-dashboard/dashboard-card';
import { WelcomeHeader } from '@/components/consultant-dashboard/welcome-header';
import { Badge } from '@/components/homepage/ui/badge';
import Sidebar from '@/components/Sidebar';
import { useAppSelector } from '@/lib/store/hook';
import { APP_ROUTES } from '@/utils/app_routes';
import { Calendar, Briefcase, CreditCard, FileText, User, Check, CircleCheck, CircleCheckBig, CircleAlert } from 'lucide-react';
import DashboardPage from '@/components/consultant-dashboard-new';
import { DashboardData } from '@/types/dashboard';

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
            <DashboardPage data={dashboardData as DashboardData} />
        </Sidebar>
    )
}
