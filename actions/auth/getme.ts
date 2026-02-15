import { getConsultantSchedule } from "@/services/getConsultantSchedule";
import { getMe } from "@/services/getMe";
import { ApiCalendarResponse } from "@/types/calendar";
import { useQuery } from "@tanstack/react-query";

export const useGetme = (token:string) => {
  return useQuery<ApiCalendarResponse>({
    queryKey: ["me", token],
    queryFn: () => getMe(token)
  });
};
