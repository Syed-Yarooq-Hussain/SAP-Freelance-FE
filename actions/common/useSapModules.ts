"use client";

import { fetchSapModules, fetchSapOtherModules } from "@/services/common/sapModules";
import type { ApiResponse } from "@/types/api";
import type { ISapModulesResponse } from "@/services/common/sapModules";
import { useQuery } from "@tanstack/react-query";
import { SapModuleGroup } from "@/types/modules";

export const useSapModules = () => {
  return useQuery<ApiResponse<ISapModulesResponse>, Error>({
    queryKey: ["sap-modules"],
    queryFn: fetchSapModules,
    staleTime: 1000 * 60 * 10,
  });
};

export const useSapOtherModules = () => {
  return useQuery<ApiResponse<SapModuleGroup[]>, Error>({
    queryKey: ["sap-other-modules"],
    queryFn: fetchSapOtherModules,
    staleTime: 1000 * 60 * 10,
  });
};