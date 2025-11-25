import { getProjectService } from "@/services/getProject";
import type { ApiResponse } from "@/types/api";
import type { IProject } from "@/types/projects";
import { useMutation } from "@tanstack/react-query";

export const useGetProject = () => {
  return useMutation<ApiResponse<IProject>, Error, string | number>({
    mutationFn: (id) => getProjectService(id),
  });
};
