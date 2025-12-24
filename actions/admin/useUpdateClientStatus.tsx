"use client";

import { updateClientStatus } from "@/services/admin/clients";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateClientStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      status,
    }: {
      clientId: number;
      status: "active" | "rejected" | "locked";
    }) => updateClientStatus(clientId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-clients"],
      });

      queryClient.refetchQueries({
        queryKey: ["admin-clients"],
        type: "active",
      });
    },
  });
};
