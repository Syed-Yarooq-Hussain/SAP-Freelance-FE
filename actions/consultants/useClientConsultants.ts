"use client";

import {
  fetchClientConsultants,
  type ClientConsultantsQuery,
} from "@/services/consultants";
import type { ApiResponse } from "@/types/api";
import type { IConsultantUser } from "@/types/consultant";
import { useMutation } from "@tanstack/react-query";

export const useClientConsultants = () => {
  return useMutation<ApiResponse<IConsultantUser[]>, Error, ClientConsultantsQuery | undefined>({
    mutationFn: fetchClientConsultants,
  });
};
