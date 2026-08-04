"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchConsultantDashboardSummary } from "@/services/admin/consultantDashboard";
import type { ApiResponse } from "@/types/api";
import type { ConsultantDashboardSummaryData } from "@/types/adminDashboard";

export function useConsultantDashboardSummary() {
  return useQuery<ApiResponse<ConsultantDashboardSummaryData>, Error>({
    queryKey: ["admin", "consultant-dashboard-summary"],
    queryFn: fetchConsultantDashboardSummary,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
