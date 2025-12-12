"use client";

import { fetchConsultantPayments } from "@/services/payments";
import type { ApiResponse } from "@/types/api";
import type { IConsultantPaymentDTO } from "@/types/consultant";
import { useMutation } from "@tanstack/react-query";

export const useConsultantPayments = () => {
  return useMutation<ApiResponse<IConsultantPaymentDTO[]>, Error>({
    mutationFn: fetchConsultantPayments,
  });
};
