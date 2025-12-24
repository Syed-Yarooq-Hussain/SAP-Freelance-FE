import { IFieldConfig } from "@/types/create-form";

export function getTeamBuilderFormFields(): IFieldConfig[] {
  return [
    {
      name: "projectName",
      label: "Project Name",
      placeholder: "Enter project name",
      rules: { required: "Project name is required" },
      column: { xs: 12, sm: 4 },
    },
    {
      name: "industry",
      label: "Industry",
      placeholder: "Enter industry",
      rules: { required: "Industry is required" },
      column: { xs: 12, sm: 4 },
    },
    {
      name: "companyName",
      label: "Company Name",
      placeholder: "Enter company name",
      rules: { required: "Company name is required" },
      column: { xs: 12, sm: 4 },
    },
  ];
}
