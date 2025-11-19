"use client";

import { fetchClientConsultants } from "@/services/consultants";
import type { ApiResponse } from "@/types/api";
import type { IConsultantUser } from "@/types/consultant";
import { useMutation } from "@tanstack/react-query";

export const useClientConsultants = () => {
  return useMutation<ApiResponse<IConsultantUser[]>, Error>({
    mutationFn: fetchClientConsultants,
  });
};
