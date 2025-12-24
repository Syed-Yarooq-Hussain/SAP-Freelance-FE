"use client";

import { fetchClientProjects } from "@/services/projects";
import type { ApiResponse } from "@/types/api";
import type { IClientProjectDTO } from "@/types/client";
import { useMutation } from "@tanstack/react-query";

export const useClientProjects = () => {
  return useMutation<ApiResponse<IClientProjectDTO[]>, Error>({
    mutationFn: fetchClientProjects,
  });
};
