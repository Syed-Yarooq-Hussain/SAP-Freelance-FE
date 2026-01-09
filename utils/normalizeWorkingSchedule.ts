export interface WorkingDay {
  day: string;
  active: boolean;
  start?: string;
  end?: string;
}

type ApiWeeklyDay = {
  day: string;
  active: boolean;
  slot?: {
    start: string;
    end: string;
  }[];
};

type ApiWeekdayDay = {
  day: string;
  active: boolean;
  start?: string;
  end?: string;
};

type ApiWorkingSchedule = {
  weekly?: ApiWeeklyDay[];
  weekdays?: ApiWeekdayDay[];
  custom?: any[];
};

export function normalizeWorkingSchedule(
  schedule?: ApiWorkingSchedule | WorkingDay[]
): WorkingDay[] {
  if (!schedule) return [];

  if (Array.isArray(schedule)) {
    return schedule;
  }

  if (schedule.weekly) {
    return schedule.weekly.map((day) => {
      const slot = day.slot?.[0];
      return {
        day: day.day,
        active: day.active,
        start: slot?.start,
        end: slot?.end,
      };
    });
  }

  if (schedule.weekdays) {
    return schedule.weekdays.map((day) => ({
      day: day.day,
      active: day.active,
      start: day.start,
      end: day.end,
    }));
  }

  return [];
}
