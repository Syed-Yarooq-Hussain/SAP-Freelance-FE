"use client";

import {
  ConsultantStatus,
  fetchAdminConsultants,
} from "@/services/admin/consultants";
import type { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useAdminConsultants = (status: ConsultantStatus) => {
  return useQuery<ApiResponse<any[]>, Error>({
    queryKey: ["admin-consultants", status],
    queryFn: () => fetchAdminConsultants(status),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
