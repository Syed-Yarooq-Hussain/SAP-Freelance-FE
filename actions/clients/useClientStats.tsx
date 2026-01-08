"use client";

import type { IClientStatsResponse } from "@/services/clientStats";
import { fetchClientStats } from "@/services/clientStats";
import type { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useClientStats = () => {
  return useQuery<ApiResponse<IClientStatsResponse>, Error>({
    queryKey: ["client-stats"],
    queryFn: fetchClientStats,
    staleTime: 1000 * 60 * 5,
  });
};
