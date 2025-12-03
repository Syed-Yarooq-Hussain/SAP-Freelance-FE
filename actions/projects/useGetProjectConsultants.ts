"use client";

import { ConsultantStatus } from "@/constants/status";
import { getProjectConsultantsService } from "@/services/getProjectConsultants";
import type { ApiResponse } from "@/types/api";
import type { IProjectConsultant } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useGetProjectConsultants = () => {
  return useMutation<
    ApiResponse<IProjectConsultant[]>,
    Error,
    { projectId: string | number; statuses: ConsultantStatus[] }
  >({
    mutationFn: ({ projectId, statuses }) =>
      getProjectConsultantsService(projectId, statuses),
  });
};
