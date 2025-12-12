"use client";

import { fetchConsultantProjects } from "@/services/projects";
import { ApiResponse } from "@/types/api";
import { IConsultantProject } from "@/types/consultant";
import { useMutation } from "@tanstack/react-query";

export function useConsultantProjects() {
  return useMutation<ApiResponse<IConsultantProject[]>, Error>({
    mutationFn: async () => {
      return await fetchConsultantProjects();
    },
  });
}