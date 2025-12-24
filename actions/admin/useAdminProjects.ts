"use client";

import { fetchAdminProjects } from "@/services/admin/adminProjects";
import type { ApiResponse } from "@/types/api";
import { IAdminProject } from "@/types/projects";
import { useQuery } from "@tanstack/react-query";

export const useAdminProjects = () => {
  return useQuery<ApiResponse<IAdminProject[]>, Error>({
    queryKey: ["admin-projects"],
    queryFn: fetchAdminProjects,
    staleTime: 1000 * 60 * 5,
  });
};
