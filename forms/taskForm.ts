import { IFieldConfig } from "@/components/CreateForm";
import { ASSIGNEE_OPTIONS } from "@/data/options";

export function getTaskFormFields(): IFieldConfig[] {
  return [
    {
      name: "taskName",
      label: "Task name",
      placeholder: "Enter task name",
      rules: { required: "Task name is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "taskEnd",
      label: "End date",
      type: "date",
      rules: { required: "End date is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "taskAssignee",
      label: "Assignee",
      select: true,
      options: ASSIGNEE_OPTIONS,
      rules: { required: "Assignee is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "taskDoc",
      label: "Description Document",
      placeholder: "Select document",
      column: { xs: 12, md: 6 },
    },
    {
      name: "taskMilestone",
      label: "Milestone",
      select: true,
      options: [],
      column: { xs: 12, md: 6 },
    },
  ];
}
