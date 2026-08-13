import { getCachedSession } from "@/services/sessionCache";
import type { ApiResponse } from "@/types/api";
import type { ModuleRequest } from "@/types/modules";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

const getAuth = async () => {
  const session = await getCachedSession();
  const token = session?.accessToken;
  return {
    userId: session?.user?.id,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
};

export const createModuleRequest = async (name: string) => {
  const { userId, headers } = await getAuth();
  if (!userId) throw new Error("Unable to identify the logged-in user");

  return request<{ name: string; user_id: number }, ModuleRequest>({
    url: API_ROUTES.MODULE_REQUESTS,
    method: "POST",
    headers,
    data: { name: name.trim(), user_id: Number(userId) },
  });
};

export const fetchModuleRequests = async (): Promise<ApiResponse<ModuleRequest[]>> => {
  const { headers } = await getAuth();
  return request<undefined, ModuleRequest[]>({
    url: API_ROUTES.ADMIN_MODULE_REQUESTS,
    method: "GET",
    headers,
  });
};

export const decideModuleRequest = async ({
  id,
  is_accepted,
}: {
  id: number;
  is_accepted: boolean;
}) => {
  const { headers } = await getAuth();
  return request<{ is_accepted: boolean }, ModuleRequest>({
    url: `${API_ROUTES.ADMIN_MODULE_REQUESTS}/${id}`,
    method: "PATCH",
    headers,
    data: { is_accepted },
  });
};
