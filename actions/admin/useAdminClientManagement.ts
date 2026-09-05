"use client";

import {
  createAdminClient,
  updateClientProfitMargin,
} from "@/services/admin/clients";
import type {
  CreateAdminClientPayload,
  UpdateClientProfitMarginPayload,
} from "@/types/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAdminClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminClientPayload) => createAdminClient(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      await queryClient.refetchQueries({
        queryKey: ["admin-clients"],
        type: "active",
      });
    },
  });
};

export const useUpdateClientProfitMargin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateClientProfitMarginPayload) =>
      updateClientProfitMargin(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
  });
};
