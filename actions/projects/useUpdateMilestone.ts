"use client";

import { updateMilestoneService } from "@/services/updateMilestone";
import type { ApiResponse } from "@/types/api";
import type { ICreateMilestonePayload, IMilestone } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

type UpdatePayload = {
  milestoneId: string | number;
  body: ICreateMilestonePayload;
};

export const useUpdateMilestone = () => {
  return useMutation<ApiResponse<IMilestone>, Error, UpdatePayload>({
    mutationFn: ({ milestoneId, body }) =>
      updateMilestoneService(milestoneId, body),
  });
};
