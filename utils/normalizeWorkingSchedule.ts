export function normalizeWorkingSchedule(schedule?: {
  weekdays: { day: string; start?: string; end?: string; active: boolean }[];
}) {
  if (!schedule?.weekdays) return [];
  return schedule.weekdays
    .filter((d) => d.active)
    .map((d) => ({
      day: d.day,
      start: d.start ?? null,
      end: d.end ?? null,
      active: d.active,
    }));
}
