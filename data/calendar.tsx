import { CalendarEvent } from "@/components/MonthlyCalendar";

export const buildSeedEvents = (
  onChangeAvailability: () => void
): CalendarEvent[] => [
  {
    date: "2025-10-02",
    type: "project",
    time: "9:00 AM - 5:00 PM",
    hours: "12 hrs",
  },
  {
    date: "2025-10-03",
    type: "project",
    time: "9:00 AM - 5:00 PM",
    hours: "3 hrs",
  },
  {
    date: "2025-10-05",
    type: "project",
    time: "9:00 AM - 5:00 PM",
    hours: "5 hrs",
  },
  {
    date: "2025-10-08",
    type: "interview",
    title: "Interview",
    time: "08:15",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
  },
  {
    date: "2025-10-07",
    type: "interview",
    title: "Rental Co",
    time: "12:30",
  },
  {
    date: "2025-10-28",
    type: "interview",
    title: "Weekend Festival",
    time: "13:20",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
  },
  {
    date: "2025-11-02",
    type: "project",
    time: "9:00 AM - 5:00 PM",
    hours: "2 hrs",
    changeAvailabilityLabel: "Change availability",
    onChangeAvailability,
  },
  {
    date: "2025-11-12",
    type: "project",
    time: "9:00 AM - 5:00 PM",
    hours: "7 hrs",
  },
  {
    date: "2025-11-18",
    type: "project",
    time: "9:00 AM - 5:00 PM",
    hours: "8 hrs",
  },
  {
    date: "2025-12-08",
    type: "interview",
    title: "Rental Co",
    time: "12:30",
  },
  {
    date: "2025-12-10",
    type: "interview",
    title: "Rental Co",
    time: "12:30",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
  },
];
