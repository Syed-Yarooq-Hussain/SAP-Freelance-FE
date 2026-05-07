"use client";

import { deleteConsultantProfile } from "@/services/consultants";
import type { ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

export const useDeleteConsultantProfile = () => {
  return useMutation<ApiResponse<null>, Error>({
    mutationFn: deleteConsultantProfile,
    onError: (error: any) => {
      console.error("Failed to delete profile:", error.message);
    },
  });
};

