"use client";

import { fetchClientPayments } from "@/services/payments";
import type { ApiResponse } from "@/types/api";
import type { IClientPaymentDTO } from "@/types/client";
import { useMutation } from "@tanstack/react-query";

export const useClientPayments = () => {
  return useMutation<ApiResponse<IClientPaymentDTO[]>, Error>({
    mutationFn: fetchClientPayments,
  });
};
