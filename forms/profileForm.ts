import {
  LOCATION_OPTIONS,
  VISIBILITY_OPTIONS,
  ROLE_OPTIONS,
  DURATION_OPTIONS,
} from "@/data/options";
import { IFieldConfig } from "@/types/create-form";

export function getProfileMainFields(): IFieldConfig[] {
  return [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Your Name",
      column: { xs: 12, md: 4 },
      rules: { required: "Name is required" },
    },
    {
      name: "location",
      label: "Location",
      placeholder: "Select location",
      column: { xs: 12, md: 4 },
      rules: { required: "Location is required" },
      select: true,
      defaultValue: "",
      options: LOCATION_OPTIONS,
    },
    {
      name: "module",
      label: "Module",
      type: "text",
      placeholder: "Your Module",
      column: { xs: 12, md: 4 },
      rules: { required: "Module is required" },
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      placeholder: "Your Email",
      column: { xs: 12, md: 4 },
      rules: { required: "Email is required" },
    },
    {
      name: "rate",
      label: "Hourly Rate",
      type: "text",
      placeholder: "Your Hourly Rate",
      column: { xs: 12, md: 4 },
      rules: { required: "Hourly rate is required" },
    },
    {
      name: "experience",
      label: "Experience (Years)",
      type: "number",
      placeholder: "Your Experience",
      column: { xs: 12, md: 4 },
      rules: { required: "Experience is required" },
    },
  ];
}

export function getProfileBottomFields(): IFieldConfig[] {
  return [
    {
      name: "visibility",
      label: "Visibility",
      placeholder: "Select visibility",
      column: { xs: 12, md: 6 },
      rules: { required: "Visibility is required" },
      select: true,
      defaultValue: "",
      options: VISIBILITY_OPTIONS,
    },
    {
      name: "weeklyHours",
      label: "Weekly Hours",
      placeholder: "Your Weekly Hours",
      column: { xs: 12, md: 6 },
      rules: { required: "Weekly hours are required" },
    },
    {
      name: "description",
      label: "Bio",
      placeholder: "Your Bio Description",
      type: "textarea",
    },
  ];
}

export function getProfileExtraFields(): IFieldConfig[] {
  return [
    {
      name: "projectName",
      label: "Project name",
      type: "text",
      placeholder: "Project Name",
      column: { xs: 12, md: 4 },
      rules: { required: "Project name is required" },
    },
    {
      name: "role",
      label: "Role",
      placeholder: "Select role",
      column: { xs: 12, md: 4 },
      rules: { required: "Role is required" },
      select: true,
      defaultValue: "",
      options: ROLE_OPTIONS,
    },
    {
      name: "modules",
      label: "Modules",
      type: "text",
      placeholder: "Your Modules",
      column: { xs: 12, md: 4 },
    },
    {
      name: "client",
      label: "Client",
      type: "text",
      placeholder: "Your Client",
      column: { xs: 12, md: 4 },
    },
    {
      name: "duration",
      label: "Duration",
      placeholder: "Select duration",
      column: { xs: 12, md: 4 },
      rules: { required: "Duration is required" },
      select: true,
      defaultValue: "",
      options: DURATION_OPTIONS,
    },
    {
      name: "startDate",
      label: "Start date",
      type: "date",
      placeholder: "Your Start Date",
      column: { xs: 12, md: 4 },
      rules: { required: "Start date is required" },
    },
  ];
}
