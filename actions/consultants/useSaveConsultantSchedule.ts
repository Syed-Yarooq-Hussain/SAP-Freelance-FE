import { postConsultantSchedule } from "@/services/postConsultantSchedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSaveConsultantSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postConsultantSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["consultant-calendar"],
      });
    },
  });
};
