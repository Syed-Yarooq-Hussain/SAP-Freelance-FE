import { getConsultantDashboard } from "@/services/dashboard";
// import { getConsultantSchedule } from "@/services/getConsultantSchedule";
// import { ApiCalendarResponse } from "@/types/calendar";
import { DashboardData } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useConsultantDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["consultant-dashboard"],
    queryFn: () => getConsultantDashboard()
  });
};
