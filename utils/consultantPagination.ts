import type { ApiPagination } from "@/types/api";
import type { ClientConsultantDTO } from "@/types/teamBuilder";

export const extractConsultantListAndPagination = (
  payload: unknown,
  fallbackPagination?: ApiPagination | null
) => {
  if (Array.isArray(payload)) {
    return {
      list: payload as ClientConsultantDTO[],
      pagination: fallbackPagination ?? null,
    };
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidates = [
      record.data,
      record.results,
      record.items,
      record.consultants,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return {
          list: candidate as ClientConsultantDTO[],
          pagination:
            (record.pagination as ApiPagination | undefined) ??
            fallbackPagination ??
            null,
        };
      }
    }

    if (record.data && typeof record.data === "object") {
      const nested = record.data as Record<string, unknown>;
      const nestedCandidates = [
        nested.data,
        nested.results,
        nested.items,
        nested.consultants,
      ];

      for (const candidate of nestedCandidates) {
        if (Array.isArray(candidate)) {
          return {
            list: candidate as ClientConsultantDTO[],
            pagination:
              (record.pagination as ApiPagination | undefined) ??
              (nested.pagination as ApiPagination | undefined) ??
              fallbackPagination ??
              null,
          };
        }
      }
    }
  }

  return {
    list: [] as ClientConsultantDTO[],
    pagination: fallbackPagination ?? null,
  };
};

export const appendUniqueRows = <T extends { id: string | number }>(
  current: T[],
  incoming: T[]
) => {
  const byId = new Map(current.map((row) => [String(row.id), row]));
  incoming.forEach((row) => byId.set(String(row.id), row));
  return Array.from(byId.values());
};
