import { IFieldConfig } from "@/components/CreateForm";
import { DEPENDENCIES_OPTIONS } from "@/data/options";

export function getMilestoneFormFields(): IFieldConfig[] {
  return [
    {
      name: "milestoneName",
      label: "Milestone name",
      placeholder: "Enter name",
      rules: { required: "Milestone name is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "milestoneEnd",
      label: "End date",
      type: "date",
      rules: { required: "End date is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "milestoneDeps",
      label: "Dependencies",
      placeholder: "Select document",
      options: DEPENDENCIES_OPTIONS,
      column: { xs: 12, md: 4 },
    },
    {
      name: "milestoneDescDoc",
      label: "Description",
      placeholder: "Select document",
      column: { xs: 12 },
    },
  ];
}
