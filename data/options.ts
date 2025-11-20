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
