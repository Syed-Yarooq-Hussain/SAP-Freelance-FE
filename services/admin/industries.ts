import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

// =========================
// 📥 GET ALL INDUSTRIES
// =========================
export async function fetchIndustries(): Promise<ApiResponse<any[]>> {
  const res = await request<undefined, any[]>({
    url: API_ROUTES.ADMIN_INDUSTRIES,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load industries");
  }

  const data = Array.isArray(res.data) ? res.data : [res.data];

  return { ...res, data };
}

// =========================
// ➕ CREATE INDUSTRY
// =========================
export async function createIndustry(data: {
  name: string;
  description?: string;
}): Promise<ApiResponse<any>> {
  const res = await request<typeof data, any>({
    url: API_ROUTES.ADMIN_INDUSTRIES,
    method: "POST",
    data,
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to create industry");
  }

  return res;
}

// =========================
// ✏️ UPDATE INDUSTRY
// =========================
export async function updateIndustry(
  id: number,
  data: {
    name: string;
    description?: string;
  }
): Promise<ApiResponse<any>> {
  const res = await request<typeof data, any>({
    url: `${API_ROUTES.ADMIN_INDUSTRIES}/${id}`,
    method: "PUT",
    data,
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to update industry");
  }

  return res;
}

// =========================
// ❌ DELETE INDUSTRY
// =========================
export async function deleteIndustry(
  id: number
): Promise<ApiResponse<null>> {
  const res = await request<undefined, null>({
    url: `${API_ROUTES.ADMIN_INDUSTRIES}/${id}`,
    method: "DELETE",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to delete industry");
  }

  return res;
}
