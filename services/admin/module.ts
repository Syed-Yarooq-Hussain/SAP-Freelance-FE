import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

// =========================
// 📥 GET ALL MODULES
// =========================
export async function fetchModules(): Promise<ApiResponse<any[]>> {
  const res = await request<undefined, any[]>({
    url: API_ROUTES.MODULES,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load modules");
  }

  const data = Array.isArray(res.data) ? res.data : [res.data];

  return { ...res, data };
}

// =========================
// 🌳 GET MODULE TREE
// =========================
export async function fetchModuleTree(): Promise<ApiResponse<any[]>> {
  const res = await request<undefined, any[]>({
    url: `${API_ROUTES.MODULES}/tree`,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load module tree");
  }

  return res;
}

// =========================
// ➕ CREATE MODULE
// =========================
export async function createModule(data: {
  name: string;
  abbreviation: string | null;
  is_core: boolean;
  parent_id: number | null;
}): Promise<ApiResponse<any>> {
  const res = await request<typeof data, any>({
    url: API_ROUTES.MODULES,
    method: "POST",
    data,
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to create module");
  }

  return res;
}

// =========================
// ✏️ UPDATE MODULE
// =========================
export async function updateModule(
  id: number,
  data: {
    name: string;
    abbreviation: string | null;
    is_core: boolean;
    parent_id: number | null;
  }
): Promise<ApiResponse<any>> {
  const res = await request<typeof data, any>({
    url: `${API_ROUTES.MODULES}/${id}`,
    method: "PUT",
    data,
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to update module");
  }

  return res;
}

// =========================
// ❌ DELETE MODULE
// =========================
export async function deleteModule(
  id: number
): Promise<ApiResponse<null>> {
  const res = await request<undefined, null>({
    url: `${API_ROUTES.MODULES}/${id}`,
    method: "DELETE",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to delete module");
  }

  return res;
}
