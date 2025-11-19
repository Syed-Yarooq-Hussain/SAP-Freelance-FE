"use client";

import { createProjectService } from "@/services/projects";
import type { ApiResponse } from "@/types/api";
import type { IProject } from "@/types/projects";
import { useMutation } from "@tanstack/react-query";

export const useCreateProject = () => {
  return useMutation<ApiResponse<IProject>, Error>({
    mutationFn: createProjectService,
  });
};
