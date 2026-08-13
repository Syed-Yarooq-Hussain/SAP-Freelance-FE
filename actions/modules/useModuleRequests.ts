"use client";

import {
  createModuleRequest,
  decideModuleRequest,
  fetchModuleRequests,
} from "@/services/moduleRequests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateModuleRequest = () =>
  useMutation({ mutationFn: createModuleRequest });

export const useModuleRequests = () =>
  useQuery({
    queryKey: ["module-requests"],
    queryFn: fetchModuleRequests,
  });

export const useDecideModuleRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: decideModuleRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-requests"] });
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["module-tree"] });
      queryClient.invalidateQueries({ queryKey: ["sap-modules"] });
      queryClient.invalidateQueries({ queryKey: ["sap-other-modules"] });
    },
  });
};
