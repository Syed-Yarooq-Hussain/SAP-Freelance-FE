import { getConsultantMeService } from "@/services/getConsultantProfile";
import { useQuery } from "@tanstack/react-query";

export const useConsultantMe = () => {
  return useQuery({
    queryKey: ["consultant-me"],
    queryFn: getConsultantMeService,
    retry: false,
  });
};
