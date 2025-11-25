"use client";

import { getMilestoneTasksService } from "@/services/getMilestoneTasks";
import type { ApiResponse } from "@/types/api";
import type { IMilestone } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useGetMilestoneTasks = () => {
  return useMutation<ApiResponse<IMilestone>, Error, string | number>({
    mutationFn: (milestoneId) => getMilestoneTasksService(milestoneId),
  });
};
