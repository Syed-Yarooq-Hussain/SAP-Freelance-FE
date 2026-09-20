/** Display only. Pass the consultant user ID, never a membership/allocation ID. */
export function consultantLabel(consultantId: unknown): string {
  const raw = typeof consultantId === "number" || typeof consultantId === "string"
    ? String(consultantId).trim()
    : "";
  if (!/^\d+$/.test(raw)) return "Consultant (ID unavailable)";
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(id + 100000)) {
    return "Consultant (ID unavailable)";
  }
  return `Consultant ${100000 + id}`;
}
