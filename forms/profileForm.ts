import { LOCATION_OPTIONS, VISIBILITY_OPTIONS } from "@/data/options";
import { IFieldConfig } from "@/types/create-form";

export function getProfileHeaderFields(): IFieldConfig[] {
  return [
    {
      name: "name",
      label: "Name",
      type: "text",
      column: { xs: 12, md: 6 },
    },
    {
      name: "email",
      label: "Contact",
      type: "email",
      column: { xs: 12, md: 6 },
      disabled: true,
    },
    {
      name: "location",
      label: "Location",
      select: true,
      options: LOCATION_OPTIONS,
      column: { xs: 12, md: 6 },
    },
    {
      name: "experience",
      label: "Experience (Years)",
      type: "number",
      placeholder: "e.g. 7",
      column: { xs: 12, md: 6 },
      rules: {
        required: "Experience is required",
        min: { value: 0, message: "Experience cannot be negative" },
        max: { value: 40, message: "Experience cannot exceed 40 years" },
      },
    },
    {
      name: "description",
      label: "Bio",
      type: "textarea",
      column: { xs: 12 },
    },
  ];
}

export function getProfileModuleFields(): IFieldConfig[] {
  return [
    {
      name: "module.core",
      label: "Core Modules",
      select: true,
      multiple: true,
      rules: { required: "At least one Core Module is required" },
      defaultValue: [],
      column: { xs: 12, md: 6 },
    },
    {
      name: "module.others",
      label: "Other Modules",
      select: true,
      multiple: true,
      rules: { required: "At least one Core Module is required" },
      defaultValue: [],
      column: { xs: 12, md: 6 },
    },
  ];
}

export function getProfileCommercialFields(): IFieldConfig[] {
  return [
    {
      name: "projects",
      label: "Projects",
      type: "number",
      column: { xs: 12, md: 4 },
      disabled: true,
    },
    {
      name: "rate",
      label: "Hourly Rate",
      type: "number",
      placeholder: "e.g. 600000",
      column: { xs: 12, md: 4 },
      rules: {
        required: "Rate is required",
        min: { value: 1, message: "Rate must be at least 1" },
        max: { value: 200, message: "Rate cannot exceed 200 per hour" },
      },
    },
    {
      name: "availability",
      label: "Weekly Availability",
      type: "text",
      column: { xs: 12, md: 4 },
      rules: {
        required: "Availability is required",
        min: { value: 5, message: "Minimum 5 hours required" },
        max: { value: 60, message: "Weekly hours cannot exceed 60" },
      },
    },
  ];
}

export function getProfileBottomFields(): IFieldConfig[] {
  return [
    {
      name: "rating",
      label: "Rating",
      type: "number",
      placeholder: "0 – 5",
      column: { xs: 12, md: 6 },
      rules: {
        min: { value: 0, message: "Min rating is 0" },
        max: { value: 5, message: "Max rating is 5" },
      },
      disabled: true,
    },
    {
      name: "visibility",
      label: "Visibility",
      placeholder: "Select visibility",
      column: { xs: 12, md: 6 },
      select: true,
      options: VISIBILITY_OPTIONS,
      rules: { required: "Visibility is required" },
    },
  ];
}

export const skillFormElements: IFieldConfig[] = [
  {
    name: "skill",
    label: "Add Skill",
    placeholder: "e.g. Next.js",
    type: "text",
    column: { xs: 12, md: 8 },
    rules: {
      required: "Skill is required",
      minLength: { value: 2, message: "Too short" },
    },
  },
];

export const workExperienceFormElements: IFieldConfig[] = [
  {
    name: "company",
    label: "Company Name",
    type: "text",
    column: { xs: 12, md: 6 },
    rules: { required: "Company name is required" },
  },
  {
    name: "role",
    label: "Role",
    type: "text",
    column: { xs: 12, md: 6 },
    rules: { required: "Role is required" },
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    column: { xs: 12, md: 6 },
    rules: { required: "Start date is required" },
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    column: { xs: 12, md: 6 },
  },
  {
    name: "technologies",
    label: "Responsibilities",
    type: "textarea",
    column: { xs: 12 },
    rules: { required: "Responsibilities are required" },
  },
];

export const educationFormElements: IFieldConfig[] = [
  {
    name: "degree",
    label: "Degree",
    type: "text",
    column: { xs: 12, md: 6 },
    rules: { required: "Degree is required" },
  },
  {
    name: "institution",
    label: "Institution Name",
    type: "text",
    column: { xs: 12, md: 6 },
    rules: { required: "Institution is required" },
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    column: { xs: 12, md: 6 },
    rules: { required: "Start date is required" },
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    column: { xs: 12, md: 6 },
  },
];
