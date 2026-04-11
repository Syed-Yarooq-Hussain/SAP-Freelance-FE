"use client";

import {
  fetchModules,
  fetchModuleTree,
  createModule,
  updateModule,
  deleteModule,
} from "@/services/admin/module";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 📥 GET
export const useModules = () => {
  return useQuery({
    queryKey: ["modules"],
    queryFn: fetchModules,
    staleTime: 1000 * 60 * 5,
  });
};

// 🌳 TREE
export const useModuleTree = () => {
  return useQuery({
    queryKey: ["module-tree"],
    queryFn: fetchModuleTree,
    staleTime: 1000 * 60 * 5,
  });
};

// ➕ CREATE
export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["module-tree"] });
    },
  });
};

// ✏️ UPDATE
export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateModule(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["module-tree"] });
    },
  });
};

// ❌ DELETE
export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["module-tree"] });
    },
  });
};