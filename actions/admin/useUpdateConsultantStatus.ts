"use client";

import { updateConsultantStatus } from "@/services/admin/consultants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateConsultantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      consultantId,
      status,
    }: {
      consultantId: number;
      status: "active" | "rejected";
    }) => updateConsultantStatus(consultantId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-pending-consultants"],
      });
    },
  });
};
