/**
 * Maps stored date strings to a value suitable for plain text inputs
 * (no native date picker). Preserves readable values from the API.
 */
export function formatDateFieldForInput(value?: string | null): string {
  if (!value?.trim()) return "";
  const t = value.trim();
  const lower = t.toLowerCase();
  if (lower === "current" || lower === "present") return "Present";
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const parsed = new Date(t);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return t;
}
