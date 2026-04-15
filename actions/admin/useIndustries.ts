"use client";

import {
  fetchIndustries,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} from "@/services/admin/industries";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 📥 GET ALL INDUSTRIES
export const useIndustries = () => {
  return useQuery({
    queryKey: ["industries"],
    queryFn: fetchIndustries,
    staleTime: 1000 * 60 * 5,
  });
};

// ➕ CREATE INDUSTRY
export const useCreateIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIndustry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
    },
    onError: (error: any) => {
      console.error("Failed to create industry:", error.message);
    },
  });
};

// ✏️ UPDATE INDUSTRY
export const useUpdateIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateIndustry(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
    },
    onError: (error: any) => {
      console.error("Failed to update industry:", error.message);
    },
  });
};

// ❌ DELETE INDUSTRY
export const useDeleteIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIndustry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
    },
    onError: (error: any) => {
      console.error("Failed to delete industry:", error.message);
    },
  });
};
