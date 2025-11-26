"use client";

import { addConsultantsService } from "@/services/addConsultant";
import type { ApiResponse } from "@/types/api";
import type {
    IAddConsultantsPayload,
    IAddConsultantsResponse,
} from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useAddConsultants = () => {
  return useMutation<
    ApiResponse<IAddConsultantsResponse[]>,
    Error,
    { projectId: string | number; body: IAddConsultantsPayload[] }
  >({
    mutationFn: ({ projectId, body }) => addConsultantsService(projectId, body),
  });
};
