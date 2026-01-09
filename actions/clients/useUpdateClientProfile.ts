import { updateClientProfileService } from "@/services/updateClientProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientProfileService,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-me"] });
    },
  });
};
