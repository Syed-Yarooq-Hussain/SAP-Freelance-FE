import { request } from "@/utils/request";
import type { SaveScopeStudio, ScopeStudioState } from "@/types/scopeStudio";
import { validateScopeState } from "@/utils/scopeStudio";

export const isScopeStudioApiEnabled = () =>
  process.env.NEXT_PUBLIC_SCOPE_STUDIO_API_ENABLED === "true";
const path = (id: string) => `/projects/${encodeURIComponent(id)}/scope-studio`;
export async function getScopeStudio(id: string) {
  const response = await request<undefined, ScopeStudioState>({
    url: path(id),
    method: "GET",
  });
  return validateScopeState(response.data);
}
export async function saveScopeStudio(id: string, body: SaveScopeStudio) {
  const response = await request<SaveScopeStudio, ScopeStudioState>({
    url: path(id),
    method: "PUT",
    data: body,
  });
  return validateScopeState(response.data);
}
export async function importScopeDocument(id: string, file: File) {
  const data = new FormData();
  data.append("file", file);
  const response = await request<FormData, { name: string; text: string }>({
    url: `${path(id)}/import`,
    method: "POST",
    data,
  });
  if (
    !response.data ||
    typeof response.data.text !== "string" ||
    !response.data.text.trim()
  )
    throw new Error(
      "No readable text was found. Upload a text-based PDF, Word or text document.",
    );
  return { name: file.name, text: response.data.text };
}
