import type { ApiResponse } from "@/types/api";
import { ISapModule } from "@/types/signup-form";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export interface ISapModulesResponse {
  core: ISapModule[];
  others: ISapModule[];
}

export async function fetchSapModules(): Promise<
  ApiResponse<ISapModulesResponse>
> {
  const res = await request<undefined, ISapModulesResponse>({
    url: API_ROUTES.SAP_MODULES,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to fetch SAP modules");
  }

  return res;
}
