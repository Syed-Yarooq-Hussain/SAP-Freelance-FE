import { IFieldConfig } from "@/components/CreateForm";
import { INDUSTRY_OPTIONS } from "@/data/options";

export function getProjectFormFields(): IFieldConfig[] {
  return [
    {
      name: "projectName",
      label: "Project name",
      placeholder: "Enter name",
      rules: { required: "Project name is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "client",
      label: "Client",
      placeholder: "Enter client",
      column: { xs: 12, md: 4 },
    },
    {
      name: "industry",
      label: "Industry",
      select: true,
      options: INDUSTRY_OPTIONS,
      rules: { required: "Industry is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "startDate",
      label: "Start date",
      type: "date",
      rules: { required: "Start date is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "endDate",
      label: "End date",
      type: "date",
      rules: { required: "End date is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "duration",
      label: "Duration",
      type: "number",
      placeholder: "in hours",
      inputProps: { min: 0 },
      column: { xs: 12, md: 4 },
    },
  ];
}
