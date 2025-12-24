import type { TeamBuilderRow } from "@/types/teamBuilder";

export function calculateHoursPerWeek(
  rows: TeamBuilderRow[],
  selectedIds: string[]
): number {
  if (!rows.length || !selectedIds.length) return 0;

  return rows
    .filter((row) => selectedIds.includes(row.id.toString()))
    .reduce((sum, row) => sum + Number(row.request || 0), 0);
}

export function calculateAvgRatePerHour(hoursPerWeek: number): number {
  return hoursPerWeek * 4;
}

function parseHourlyRate(rate: string | number): number {
  if (typeof rate === "number") return rate;
  if (!rate) return 0;
  return Number(rate.replace(/[^0-9.]/g, ""));
}

export function calculateHoursPerMonthFromRates(
  rows: TeamBuilderRow[],
  selectedIds: string[]
): number {
  const selected = rows.filter((r) => selectedIds.includes(r.id.toString()));

  if (!selected.length) return 0;

  const total = selected.reduce((sum, r) => sum + parseHourlyRate(r.rate), 0);

  return Math.round(total / selected.length);
}

export function calculatePerMonthCost(
  hoursPerMonth: number,
  avgRatePerHour: number
): number {
  return hoursPerMonth * avgRatePerHour;
}
