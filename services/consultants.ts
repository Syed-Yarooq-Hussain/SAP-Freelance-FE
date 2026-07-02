import type { ApiResponse } from "@/types/api";
import type { IConsultantUser } from "@/types/consultant";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "./sessionCache";

export type ClientConsultantsQuery = Record<
  string,
  string | number | boolean | Array<string | number | boolean> | null | undefined
>;

export async function fetchClientConsultants(
  filters?: ClientConsultantsQuery
): Promise<
  ApiResponse<IConsultantUser[]>
> {
  const params =
    filters && Object.keys(filters).length > 0
      ? Object.fromEntries(
          Object.entries(filters).filter(([, value]) => {
            if (value === undefined || value === null) return false;
            if (typeof value === "string") return value.trim() !== "";
            if (Array.isArray(value)) return value.length > 0;
            return true;
          })
        )
      : undefined;

  const res = await request<undefined, IConsultantUser[]>({
    url: API_ROUTES.CLIENT_CONSULTANTS,
    method: "GET",
    params,
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

export async function getConsultantMeetings(): Promise<ApiResponse<any[]>> {
  const session = await getCachedSession();
  const token = session?.accessToken;
  const res = await request<void, any>({
    url: API_ROUTES.COMMON_MEETINGS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (res.status !== "success") {
    throw new Error(res.message || "Failed to get consultant meetings");
  }

  return res;
}

export async function deleteConsultantProfile(): Promise<ApiResponse<null>> {
  const session = await getCachedSession();
  const token = session?.accessToken;
  const res = await request<void, null>({
    url: API_ROUTES.DELETE_CONSULTANT_PROFILE+'/'+session?.user?.id,
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to delete profile");
  }

  return res;
}