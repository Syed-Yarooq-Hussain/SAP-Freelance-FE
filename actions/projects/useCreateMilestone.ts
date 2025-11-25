"use client";

import { createMilestoneService } from "@/services/createMilestone";
import type { ApiResponse } from "@/types/api";
import { ICreateMilestonePayload, IMilestone } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useCreateMilestone = () => {
  return useMutation<
    ApiResponse<IMilestone>,
    Error,
    { projectId: string | number; body: ICreateMilestonePayload }
  >({
    mutationFn: ({ projectId, body }) =>
      createMilestoneService(projectId, body),
  });
};
