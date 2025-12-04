"use client";

import { getProjectMilestonesService } from "@/services/getProjectMilestones";
import type { ApiResponse } from "@/types/api";
import type { IMilestone } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useGetProjectMilestones = () => {
  return useMutation<ApiResponse<IMilestone[]>, Error, string | number>({
    mutationFn: (projectId) => getProjectMilestonesService(projectId),
  });
};
