"use client";

import { getConsultantLevelsService } from "@/services/getconsultantLevels";
import type { ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

export function useConsultantLevels() {
  return useMutation<ApiResponse<string[]>, Error>({
    mutationFn: () => getConsultantLevelsService(),
  });
}
