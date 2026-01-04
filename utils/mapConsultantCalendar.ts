import { CalendarEvent } from "@/components/MonthlyCalendar";
import { ApiDay } from "@/types/calendar";
import { toAmPm } from "@/utils/dateTime";

export const mapApiDaysToCalendarEvents = (
  days: ApiDay[],
  onChangeAvailability: () => void
): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  days.forEach((day) => {
    if (day.availability?.available && day.availability.slots?.length) {
      day.availability.slots.forEach((slot) => {
        const hours =
          Number(slot.end_time.split(":")[0]) -
            Number(slot.start_time.split(":")[0]) || 0;

        events.push({
          date: day.date,
          type: "project",
          time: `${toAmPm(slot.start_time)} – ${toAmPm(slot.end_time)}`,
          hours: `${hours} hrs`,
          changeAvailabilityLabel: "Change availability",
          onChangeAvailability,
        });
      });
    }

    day.events?.forEach((e) => {
      const start = e.start_time?.split("T")[1];
      const end = e.end_time?.split("T")[1];

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
