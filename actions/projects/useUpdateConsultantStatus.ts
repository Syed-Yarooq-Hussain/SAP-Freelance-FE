"use client";

import { updateConsultantStatusService } from "@/services/updateConsultantStatus";
import type { ApiResponse } from "@/types/api";
import type {
  IUpdateConsultantStatusPayload,
  IUpdateConsultantStatusResponse,
} from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export function useUpdateConsultantStatus() {
  return useMutation<
    ApiResponse<IUpdateConsultantStatusResponse>,
    Error,
    IUpdateConsultantStatusPayload
  >({
    mutationFn: (body) => updateConsultantStatusService(body),
  });
}
