export const CONSULTANT_STATUS = {
  OFFERED: "offered",
  HIRED: "hired",
  REJECTED: "rejected",
  INTERVIEWED: "interviewed",
  INTERVIEW_SCHEDULE: "interview-schedule",
  SHORTLISTED: "shortlisted",
} as const;

export type ConsultantStatus =
  (typeof CONSULTANT_STATUS)[keyof typeof CONSULTANT_STATUS];

