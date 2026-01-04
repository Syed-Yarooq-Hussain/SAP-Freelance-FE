import { IFieldConfig } from "@/types/create-form";
import { SKILLS_OPTIONS } from "./options";

export const skillFormElements: IFieldConfig[] = [
  {
    name: "skill",
    label: "Select skills",
    placeholder: "Select skills",
    select: true,
    defaultValue: "",
    options: SKILLS_OPTIONS,
    column: { xs: 12, md: 4 },
  },
];
