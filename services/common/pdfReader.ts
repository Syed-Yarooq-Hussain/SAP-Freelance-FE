import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export async function parseCVViaAPI(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await request<FormData, any>({
    url: API_ROUTES.PDF_READER,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (res.status !== "success") {
    throw new Error(res.message || "CV parsing failed");
  }

  return res.data;
}
