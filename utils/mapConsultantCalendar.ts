import { CalendarEvent } from "@/components/MonthlyCalendar";
import { ApiDay } from "@/types/calendar";
import { toAmPm } from "@/utils/dateTime";

export const mapApiDaysToCalendarEvents = (
  days: any[],
  onChangeAvailability?: (date: string, start: string, end: string) => void
): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  days.forEach((day) => {
    if (day.availability?.available && day.availability.slots?.length) {
      day.availability.slots.forEach((slot:any) => {
        const hours =
          Number(slot.end_time.split(":")[0]) -
            Number(slot.start_time.split(":")[0]) || 0;

        events.push({
          date: day.date,
          type: "project",
          time: `${toAmPm(slot.start_time)} – ${toAmPm(slot.end_time)}`,
          hours: `${hours} hrs`,
          ...(onChangeAvailability && {
            changeAvailabilityLabel: "Change availability",
            onChangeAvailability: () =>
              onChangeAvailability(day.date, slot.start_time, slot.end_time),
          }),
        });
      });
    }

    day.events?.forEach((e:any) => {
      const start = e.start_time;
      const end = e.end_time;

      events.push({
        date: day.date,
        type: "interview",
        title: e.title,
        time: start && end ? `${toAmPm(start)} – ${toAmPm(end)}` : undefined,
        meetingUrl: e.meeting_link ?? undefined,
      });
    });
  });

  return events;
};
