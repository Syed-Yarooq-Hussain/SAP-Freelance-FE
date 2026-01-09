import { getClientMeService } from "@/services/getClientProfile";
import { useQuery } from "@tanstack/react-query";

export const useClientMe = () => {
  return useQuery({
    queryKey: ["client-me"],
    queryFn: getClientMeService,
    retry: false,
  });
};
