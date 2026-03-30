import { getConsultantMeetings } from "@/services/consultants";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";

export const useConsultantMeetings = () => {
  return useQuery<ApiResponse<any>>({
    queryKey: ["consultant-meetings"],
    queryFn: getConsultantMeetings,
  });
};