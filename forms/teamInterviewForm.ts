import { INTERVIEW_DURATION_OPTIONS } from "@/data/options";
import { IFieldConfig } from "@/types/create-form";

export function getTeamInterviewFormFields(): IFieldConfig[] {
  return [
    {
      name: "date",
      label: "Date",
      type: "date",
      rules: { required: "Date is required" },
      column: { xs: 12, md: 6 },
    },
    {
      name: "duration",
      label: "Select Duration",
      placeholder: "Select duration",
      type: "select",
      options: INTERVIEW_DURATION_OPTIONS,
      rules: { required: "Duration is required" },
      column: { xs: 12, md: 6 },
    },
    {
      name: "time",
      label: "Time",
      type: "time",
      rules: { required: "Time is required" },
      column: { xs: 12, md: 6 },
    },
  ];
}
