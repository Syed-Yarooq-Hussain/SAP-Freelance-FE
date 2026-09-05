import type { ClientConsultantsQuery } from "@/services/consultants";

export const buildConsultantQuery = (
  filters: ClientConsultantsQuery = {},
  selectedClientId?: string | number
): ClientConsultantsQuery => ({
  ...filters,
  ...(selectedClientId !== undefined && selectedClientId !== null
    ? { client_id: selectedClientId }
    : {}),
});
