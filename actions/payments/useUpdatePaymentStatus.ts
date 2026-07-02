"use client";

import { updatePaymentStatus, type UpdatePaymentPayload } from "@/services/updatePaymentStatus";
import type { ApiResponse } from "@/types/api";
import type { IProjectPaymentDTO } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useUpdatePaymentStatus = () => {
  return useMutation<
    ApiResponse<IProjectPaymentDTO>,
    Error,
    { paymentId: string | number; payload: UpdatePaymentPayload }
  >({
    mutationFn: async ({ paymentId, payload }) =>
      updatePaymentStatus(paymentId, payload),
  });
};
