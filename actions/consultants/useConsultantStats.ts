"use client";

import {
  fetchConsultantStats,
  IConsultantStatsResponse,
} from "@/services/consultantStats";
import type { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useConsultantStats = () => {
  return useQuery<ApiResponse<IConsultantStatsResponse>, Error>({
    queryKey: ["consultant-stats"],
    queryFn: fetchConsultantStats,
    staleTime: 1000 * 60 * 5,
  });
};
