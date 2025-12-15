import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export interface IModuleOption {
  id: number;
  name: string;
  is_core: boolean;
}

export async function fetchSapModules(): Promise<ApiResponse<{
  core: IModuleOption[];
  others: IModuleOption[];
}>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return await request<undefined, { core: IModuleOption[]; others: IModuleOption[] }>({
    url: API_ROUTES.SAP_MODULE,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
