"use client";

import { fetchPendingConsultants } from "@/services/admin/consultants";
import { IAdminPendingConsultant } from "@/types/admin";
import type { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const usePendingConsultants = () => {
  return useQuery<ApiResponse<IAdminPendingConsultant[]>, Error>({
    queryKey: ["admin-pending-consultants"],
    queryFn: fetchPendingConsultants,
    staleTime: 1000 * 60 * 5,
  });
};
