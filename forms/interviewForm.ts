import { IFieldConfig } from "@/components/CreateForm";
import { INTERVIEW_DURATION_OPTIONS } from "@/data/options";

export function getInterviewFormFields(): IFieldConfig[] {
  return [
    {
      name: "project",
      label: "Project",
      placeholder: "Select project",
      type: "select",
      column: { xs: 12, md: 6 },
    },
    {
      name: "user",
      label: "User Name",
      placeholder: "Select user",
      type: "select",
      column: { xs: 12, md: 6 },
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      rules: { required: "Date is required" },
      column: { xs: 12, md: 6 },
    },
    {
      name: "time",
      label: "Time",
      type: "time",
      rules: { required: "Time is required" },
      column: { xs: 12, md: 6 },
    },
    {
      name: "duration",
      label: "Duration",
      placeholder: "Select duration",
      type: "select",
      options: INTERVIEW_DURATION_OPTIONS,
      rules: { required: "Duration is required" },
      column: { xs: 12, md: 6 },
    },
    {
      name: "meeting_type",
      label: "Meeting Type",
      placeholder: "Select meeting type",
      type: "select",
      options: [
        { label: "Interview", value: "Interview" },
        { label: "Meeting", value: "Meeting" },
      ],
      rules: { required: "Meeting type is required" },
      column: { xs: 12, md: 6 },
    },
  ];
}
