import { IFieldConfig } from "@/types/create-form";
import { IOption } from "@/types/options";

export function getTaskFormFields(
  milestones: IOption[],
  assignees: IOption[]
): IFieldConfig[] {
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
      options: assignees,
      placeholder: "Select Assignee",
      rules: { required: "Assignee is required" },
      column: { xs: 12, md: 4 },
    },
    {
      name: "taskDoc",
      label: "Description Document",
      placeholder: "Enter description document",
      column: { xs: 12, md: 6 },
    },
    {
      name: "taskMilestone",
      label: "Milestone",
      select: true,
      options: milestones,
      placeholder: "Select Milestone",
      column: { xs: 12, md: 6 },
    },
  ];
}
