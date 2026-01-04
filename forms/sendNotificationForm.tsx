/* import { IFieldConfig } from "@/components/CreateForm";
 */import {
  NOTIFICATION_TARGET_OPTIONS,
} from "@/data/options";

export function getSendNotificationFormFields(): any[] {
  return [
    {
      name: "name",
      label: "Notification Name",
      placeholder: "Enter notification title",
      type: "text",
      rules: { required: "Name is required" },
      column: { xs: 12 },
    },
    {
      name: "target",
      label: "Send To",
      placeholder: "Select target",
      type: "select",
      options: NOTIFICATION_TARGET_OPTIONS,
      rules: { required: "Target is required" },
      column: { xs: 12 },
    }
  ];
}
