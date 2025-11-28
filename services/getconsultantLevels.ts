import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export async function getConsultantLevelsService(): Promise<
  ApiResponse<string[]>
> {
  const session = await getSession();
  const token = session?.accessToken;

  return await request<undefined, string[]>({
    url: API_ROUTES.GET_CONSULTANT_LEVELS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
