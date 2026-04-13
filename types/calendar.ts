export interface ApiSlot {
  start_time: string;
  end_time: string;
}

export interface ApiAvailability {
  available: boolean;
  slots: ApiSlot[];
}

export interface ApiEvent {
  id?: string;
  title?: string;
  type?: "INTERVIEW" | "PROJECT";
  start_time?: string;
  end_time?: string;
  all_day: boolean;
  meeting_link?: string | null;
}

export interface ApiDay {
  active: boolean;
  date: string;
  slots: ApiSlot[];
  events: ApiEvent[];
}

export interface ApiCalendarResponse {
  month: string;
  days: ApiDay[];
}
