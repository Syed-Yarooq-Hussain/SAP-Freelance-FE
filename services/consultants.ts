import type { ApiResponse } from "@/types/api";
import type { IConsultantUser } from "@/types/consultant";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "./sessionCache";

export async function fetchClientConsultants(): Promise<
  ApiResponse<IConsultantUser[]>
> {
  const res = await request<undefined, IConsultantUser[]>({
    url: API_ROUTES.CLIENT_CONSULTANTS,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load consultants");
  }

  return res;
}

export async function updateConsultantProfile(id: number, data: IConsultantUser): Promise<ApiResponse<IConsultantUser>> {
  const session = await getCachedSession();
  const token = session?.accessToken;
  const res = await request<IConsultantUser, IConsultantUser>({
    url: API_ROUTES.UPDATE_CONSULTANT_PROFILE,
    method: "PUT",
    data,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (res.status !== "success") {
    throw new Error(res.message || "Failed to update consultant profile");
  }

  return res;
}