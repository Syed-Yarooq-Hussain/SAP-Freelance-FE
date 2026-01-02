import { getConsultantSchedule } from "@/services/getConsultantSchedule";
import { ApiCalendarResponse } from "@/types/calendar";
import { useQuery } from "@tanstack/react-query";

export const useConsultantCalendar = (month: number, year: number) => {
  return useQuery<ApiCalendarResponse>({
    queryKey: ["consultant-calendar", month, year],
    queryFn: () => getConsultantSchedule(month + 1, year),
    enabled: month !== undefined && year !== undefined,
  });
};
