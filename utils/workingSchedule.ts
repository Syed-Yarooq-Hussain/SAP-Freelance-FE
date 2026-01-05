export interface WorkingDay {
  day: string;
  start?: string;
  end?: string;
  active: boolean;
}

export function normalizeWorkingSchedule(schedule: any): WorkingDay[] {
  if (Array.isArray(schedule)) return schedule;
  if (schedule?.weekdays) return schedule.weekdays;
  return [];
}
