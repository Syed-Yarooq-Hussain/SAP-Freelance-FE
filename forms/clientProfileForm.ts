import { IFieldConfig } from "@/types/create-form";

export function getClientProfileHeaderFields(): IFieldConfig[] {
  return [
    {
      name: "name",
      label: "Name",
      type: "text",
      column: { xs: 12, md: 6 },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      disabled: true,
      column: { xs: 12, md: 6 },
    },
    {
      name: "city",
      label: "City",
      type: "text",
      column: { xs: 12, md: 6 },
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      column: { xs: 12, md: 6 },
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      column: { xs: 12, md: 6 },
    },
  ];
}
