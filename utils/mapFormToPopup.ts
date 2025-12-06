import type { IFieldConfig } from "@/components/CreateForm";

export const mapMilestoneFieldsToPopup = (
  fields: IFieldConfig[],
  milestoneData: Record<string, string>,
  handleFieldChange: (field: string, value: string) => void
) => {
  return fields.map((f) => ({
    id: f.name,
    label: f.label,
    placeholder: f.placeholder,
    type: f.type,
    options: f.options,
    value: milestoneData[f.name] ?? "",
    onChange: (val: string) => handleFieldChange(f.name, val),
  }));
};

export const mapTaskFieldsToPopup = (
  fields: IFieldConfig[],
  taskData: Record<string, string>,
  handleFieldChange: (field: string, value: string) => void
) => {
  return fields.map((f) => ({
    id: f.name,
    label: f.label,
    placeholder: f.placeholder,
    type: f.type,
    options: f.options,
    value: taskData[f.name] ?? "",
    onChange: (val: string) => handleFieldChange(f.name, val),
  }));
};

