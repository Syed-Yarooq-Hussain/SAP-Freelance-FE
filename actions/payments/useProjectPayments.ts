"use client";

import { getProjectPaymentService } from "@/services/getProjectPayment";
import type { ApiResponse } from "@/types/api";
import type { IProjectPaymentDTO } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useProjectPayments = () => {
  return useMutation<ApiResponse<IProjectPaymentDTO[]>, Error, string>({
    mutationFn: (projectId: string) =>
      getProjectPaymentService(projectId),
  });
};
