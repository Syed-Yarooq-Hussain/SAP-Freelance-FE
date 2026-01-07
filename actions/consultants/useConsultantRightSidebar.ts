"use client";

import type { IConsultantRightSidebarResponse } from "@/services/consultantRightSidebar";
import { fetchConsultantRightSidebar } from "@/services/consultantRightSidebar";
import type { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useConsultantRightSidebar = () => {
  return useQuery<ApiResponse<IConsultantRightSidebarResponse>, Error>({
    queryKey: ["consultant-right-sidebar"],
    queryFn: fetchConsultantRightSidebar,
    staleTime: 1000 * 60 * 5,
  });
};
