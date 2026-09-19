import type { TeamBuilderRow } from "@/types/teamBuilder";

interface TeamStats {
  hoursPerWeek: number;
  avgRatePerHour: number;
  hoursPerMonth: number;
  perMonthCost: number;
}

function parseHourlyRate(rate: string | number | undefined): number {
  if (!rate) return 0;
  if (typeof rate === "number") return rate;
  const parsed = parseFloat(rate.replace(/[^0-9.]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateTeamStats(
  rows: TeamBuilderRow[],
  selectedIds: string[],
): TeamStats {
  if (!rows.length || !selectedIds.length) {
    return {
      hoursPerWeek: 0,
      avgRatePerHour: 0,
      hoursPerMonth: 0,
      perMonthCost: 0,
    };
  }

  const selectedSet = new Set(selectedIds.map(Number));

  let totalHoursPerWeek = 0;
  let totalRate = 0;
  let count = 0;
  let weeklyCost = 0;

  for (const row of rows) {
    if (selectedSet.has(Number(row.id))) {
      const hours = Number(row.request || 0);
      totalHoursPerWeek += hours;
      totalRate += parseHourlyRate(row.rate);
      weeklyCost += hours * parseHourlyRate(row.rate);
      count++;
    }
  }

  const avgRatePerHour = count > 0 ? Math.round(totalRate / count) : 0;
  const hoursPerMonth = totalHoursPerWeek * 4;
  const perMonthCost = weeklyCost * 4;

  return {
    hoursPerWeek: totalHoursPerWeek,
    avgRatePerHour,
    hoursPerMonth,
    perMonthCost,
  };
}
