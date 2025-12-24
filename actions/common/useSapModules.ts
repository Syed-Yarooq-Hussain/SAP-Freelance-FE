"use client";

import { fetchSapModules } from "@/services/common/sapModules";
import type { ApiResponse } from "@/types/api";
import type { ISapModulesResponse } from "@/services/common/sapModules";
import { useQuery } from "@tanstack/react-query";

export const useSapModules = () => {
  return useQuery<ApiResponse<ISapModulesResponse>, Error>({
    queryKey: ["sap-modules"],
    queryFn: fetchSapModules,
    staleTime: 1000 * 60 * 10,
  });
};
