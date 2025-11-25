"use client";

import { updateProjectService } from "@/services/updateProject";
import type { ApiResponse } from "@/types/api";
import type { IProject } from "@/types/projects";
import { IUpdateProjectPayload } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProject = () => {
  return useMutation<
    ApiResponse<IProject>,
    Error,
    { projectId: string | number; body: IUpdateProjectPayload }
  >({
    mutationFn: ({ projectId, body }) => updateProjectService(projectId, body),
  });
};
