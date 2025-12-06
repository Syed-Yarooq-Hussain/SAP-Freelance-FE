"use client";

import { fetchProjectDetails } from "@/services/projects";
import type { ApiResponse } from "@/types/api";
import type { IProjectDetailsResponse } from "@/types/projects";
import { useMutation } from "@tanstack/react-query";

export const useProjectDetails = () => {
  return useMutation<ApiResponse<IProjectDetailsResponse>, Error, string>({
    mutationFn: (projectId) => fetchProjectDetails(projectId),
  });
};
