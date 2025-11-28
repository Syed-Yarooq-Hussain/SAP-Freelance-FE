"use client";

import { getProjectConsultantsService } from "@/services/getProjectConsultants";
import type { ApiResponse } from "@/types/api";
import type { IProjectConsultant } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useGetProjectConsultants = () => {
  return useMutation<ApiResponse<IProjectConsultant[]>, Error, string | number>(
    {
      mutationFn: (projectId) => getProjectConsultantsService(projectId),
    }
  );
};
