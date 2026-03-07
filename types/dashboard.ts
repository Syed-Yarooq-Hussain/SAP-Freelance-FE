export interface DashboardData {
    calender: {
      weekly_availability: number;
      interview_schedule: number;
      next_interview: string; // ISO date string
    };
    projects: {
      total_projects: number;
      active: number;
      projects: string[];
    };
    payment: {
      next_payment: number;
      projected_earning: number;
    };
    documents: {
      pending: number;
      upcoming: number;
    };
    profile: {
      profile_strength: string; // e.g. "80%"
      badges: string[];
    };
  };