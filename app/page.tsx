'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import DashboardCard from '@/components/Card';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BarChartIcon from '@mui/icons-material/BarChart';
import MapItems from '@/components/MapItems';

const cards = [
  {
    key: 'user-management',
    component: (
      <DashboardCard
        icon={<PeopleIcon />}
        title="User Management"
        description="Approve, edit, or deactivate consultant and client profiles."
        buttonText="View Users"
        onClick={() => alert('Go to Users')}
      />
    ),
    grid: { xs: 12, sm: 6, md: 4 },
  },
  {
    key: 'projects',
    component: (
      <DashboardCard
        icon={<AssignmentIcon />}
        title="Project Oversight"
        description="Track all active, completed, and planned projects."
        buttonText="View Projects"
        onClick={() => alert('Go to Projects')}
      />
    ),
    grid: { xs: 12, sm: 6, md: 4 },
  },
  {
    key: 'payments',
    component: (
      <DashboardCard
        icon={<PaymentIcon />}
        title="Payment Monitoring"
        description="Monitor client payments and consultant disbursements."
        buttonText="Check Payments"
        onClick={() => alert('Go to Payments')}
      />
    ),
    grid: { xs: 12, sm: 6, md: 4 },
  },
  {
    key: 'notifications',
    component: (
      <DashboardCard
        icon={<NotificationsIcon />}
        title="Notifications Center"
        description="Manage all alerts and announcements in the system."
        buttonText="View Alerts"
        onClick={() => alert('Go to Notifications')}
      />
    ),
    grid: { xs: 12, sm: 6, md: 4 },
  },
  {
    key: 'reports',
    component: (
      <DashboardCard
        icon={<BarChartIcon />}
        title="Report Generation"
        description="Export data reports on users, payments, and engagements."
        buttonText="Export Reports"
        onClick={() => alert('Go to Reports')}
      />
    ),
    grid: { xs: 12, sm: 6, md: 4 },
  },
];

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <h1 style={{ marginBottom: '20px' }}>Admin Dashboard</h1>
      <MapItems items={cards} spacing={3} />
    </Box>
  );
}
