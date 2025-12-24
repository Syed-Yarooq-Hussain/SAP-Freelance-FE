"use client";

import { ClientStatus, fetchAdminClients } from "@/services/admin/clients";
import type { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useAdminClients = (status: ClientStatus) => {
  return useQuery<ApiResponse<any[]>, Error>({
    queryKey: ["admin-clients", status],
    queryFn: () => fetchAdminClients(status),

    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
