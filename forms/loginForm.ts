import { IFieldConfig } from "@/types/create-form";

export function getLoginFormFields(): IFieldConfig[] {
  return [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter email",
      type: "email",
      rules: {
        required: "Email is required",
        pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
      },
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter password",
      type: "password",
      rules: { required: "Password is required" },
    },
  ];
}
