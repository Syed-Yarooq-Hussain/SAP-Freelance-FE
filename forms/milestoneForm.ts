import { IFieldConfig } from "@/types/create-form";

export function getMilestoneFormFields(): IFieldConfig[] {
  return [
    {
      name: "milestoneName",
      label: "Milestone name",
      placeholder: "Enter milestone name",
      rules: { required: "Milestone name is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "milestoneStart",
      label: "Start date",
      type: "date",
      rules: { required: "Start date is required" },
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
      name: "milestoneDescDoc",
      label: "Description",
      placeholder: "Add milestone description",
      column: { xs: 12 },
    },
  ];
}
