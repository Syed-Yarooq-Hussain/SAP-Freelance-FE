"use client";

import { fetchAdminStats } from "@/services/admin/adminStats";
import type { ApiResponse } from "@/types/api";
import { IAdminStatsResponse } from "@/types/stats";
import { useQuery } from "@tanstack/react-query";

export const useAdminStats = () => {
  return useQuery<ApiResponse<IAdminStatsResponse>, Error>({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
    staleTime: 1000 * 60 * 5,
  });
};
