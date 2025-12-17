import { IOption } from "@/types/options";

export const MODULE_OPTIONS: IOption[] = [
  { value: "frontend", label: "frontend" },
  { value: "backend", label: "backend" },
  { value: "fullstack", label: "fullstack" },
  { value: "design", label: "design" },
];

export const LEVEL_OPTIONS: IOption[] = [
  { value: "junior", label: "junior" },
  { value: "senior", label: "senior" },
  { value: "lead", label: "lead" },
];

export const LOCATION_OPTIONS: IOption[] = [
  { value: "Germany", label: "Germany" },
  { value: "USA", label: "USA" },
  { value: "UK", label: "UK" },
  { value: "Remote", label: "Remote" },
];

export const VISIBILITY_OPTIONS: IOption[] = [
  { value: "All clients", label: "All clients" },
  { value: "Only verified clients", label: "Only verified clients" },
  { value: "Private", label: "Private" },
];

export const ROLE_OPTIONS: IOption[] = [
  { value: "Developer", label: "Developer" },
  { value: "Designer", label: "Designer" },
  { value: "Manager", label: "Manager" },
  { value: "Tester", label: "Tester" },
];

export const DURATION_OPTIONS: IOption[] = [
  { value: "1 Month", label: "1 Month" },
  { value: "2 Months", label: "2 Months" },
  { value: "3 Months", label: "3 Months" },
  { value: "4 Months", label: "4 Months" },
  { value: "5 Months", label: "5 Months" },
  { value: "6 Months", label: "6 Months" },
  { value: "7 Months", label: "7 Months" },
  { value: "8 Months", label: "8 Months" },
  { value: "9 Months", label: "9 Months" },
  { value: "10 Months", label: "10 Months" },
  { value: "11 Months", label: "11 Months" },
  { value: "12 Months", label: "12 Months" },
];

export const SKILLS_OPTIONS: IOption[] = [
  { value: "SAP SD, S/4HANA", label: "SAP SD, S/4HANA" },
  { value: "Order-to-Cash", label: "Order-to-Cash" },
  { value: "S/4HANA", label: "S/4HANA" },
  { value: "Integration", label: "Integration" },
  { value: "Client Onboarding", label: "Client Onboarding" },
  { value: "ABAP (basic)", label: "ABAP (basic)" },
];

export const INDUSTRY_OPTIONS: IOption[] = [
  { value: "SAP Consulting", label: "SAP Consulting" },
  { value: "IT Services", label: "IT Services" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Telecommunications", label: "Telecommunications" },
  { value: "Banking", label: "Banking" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Retail", label: "Retail" },
  { value: "Energy & Utilities", label: "Energy & Utilities" },
  { value: "Oil & Gas", label: "Oil & Gas" },
  { value: "Other", label: "Other" },
];

export const DEPENDENCIES_OPTIONS: IOption[] = [
  { value: "Business Blueprint", label: "Business Blueprint" },
  { value: "Functional Spec", label: "Functional Spec" },
  { value: "Technical Spec", label: "Technical Spec" },
  { value: "Integration Document", label: "Integration Document" },
  { value: "Security Document", label: "Security Document" },
  { value: "Master Data Template", label: "Master Data Template" },
  { value: "Test Cases", label: "Test Cases" },
  { value: "UAT Sign-off", label: "UAT Sign-off" },
  { value: "Deployment Checklist", label: "Deployment Checklist" },
  { value: "Other", label: "Other" },
];

export const ASSIGNEE_OPTIONS: IOption[] = [
  { value: "1", label: "Savannah Nguyen" },
  { value: "2", label: "Courtney Henry" },
  { value: "3", label: "Dianne Russell" },
  { value: "4", label: "Guy Hawkins" },
];

export const INTERVIEW_DURATION_OPTIONS: IOption[] = [
  { value: "15", label: "15 mins" },
  { value: "30", label: "30 mins" },
  { value: "45", label: "45 mins" },
  { value: "60", label: "60 mins" },
  { value: "75", label: "75 mins" },
  { value: "90", label: "90 mins" },
];

export const NOTIFICATION_TARGET_OPTIONS: IOption[] = [
  { value: "consultants", label: "All Consultants" },
  { value: "custom_consultants", label: "Custom Consultants" },
  { value: "custom_clients", label: "Custom Clients" },
];

export const CUSTOM_CONSULTANT_OPTIONS: IOption[] = [
  { value: "1", label: "Albert Flores" },
  { value: "2", label: "Marvin McKinney" },
  { value: "3", label: "Savannah Nguyen" },
];

export const CUSTOM_CLIENT_OPTIONS: IOption[] = [
  { value: "101", label: "Client – ABC Corp" },
  { value: "102", label: "Client – Delta Ltd" },
  { value: "103", label: "Client – Nova Systems" },
];