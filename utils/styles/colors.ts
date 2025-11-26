export const colors = {
  BLUE: "#3088B7",
  GREEN: "#00997B",
  YELLOW: "#f9a825",
  ORANGE: "#FFB64E",
  RED: "#FF5471",
  LIGHT_BLUE: "#0288d1",
  GOLD: "#fbc02d",
  DARK_RED: "#c62828",
  DARK_GREEN: "#388e3c",
  GREY: "#9e9e9e",
  PURPLE: "#8e24aa",
  GRAY_DARK: "#616161",
};

export const statusColors: Record<string, keyof typeof colors> = {
  "Under review": "YELLOW",
  Confirmed: "BLUE",
  "In progress": "GREEN",
  Paid: "GREEN",
  Pending: "ORANGE",
  Overdue: "RED",
  Request: "LIGHT_BLUE",
  Reschedule: "GOLD",
  Rejected: "RED",
  "To do": "ORANGE",
  Delayed: "DARK_RED",
  Signed: "DARK_GREEN",
  "Project started": "PURPLE",
  Negotiating: "LIGHT_BLUE",
  Interviewing: "YELLOW",
  Waiting: "ORANGE",
  Accepted: "GREEN",
  Planning: "BLUE",
  "Not selected": "RED",
};

export const buttonColors: Record<string, keyof typeof colors> = {
  Download: "BLUE",
  "Upload receipt": "GREEN",
  "Make payment": "ORANGE",
};

export default colors;
