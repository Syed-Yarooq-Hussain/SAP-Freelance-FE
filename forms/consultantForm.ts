import { IFieldConfig } from "@/components/CreateForm";
import { LEVEL_OPTIONS, MODULE_OPTIONS } from "@/data/options";

export function getConsultantFormFields(): IFieldConfig[] {
  return [
    {
      name: "cv",
      label: "Upload CV",
      type: "file",
      rules: { required: "CV is required" },
      inputProps: { accept: ".pdf,.doc,.docx" },
    },
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter full name",
      type: "text",
      rules: { required: "Full Name is required" },
    },
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
      name: "phone",
      label: "Phone Number",
      placeholder: "Enter phone number",
      type: "tel",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter password",
      type: "password",
      rules: { required: "Password is required" },
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm password",
      type: "password",
      rules: { required: "Confirm Password is required" },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter city",
      type: "text",
    },
    {
      name: "country",
      label: "Country",
      placeholder: "Enter country",
      type: "text",
    },
    {
      name: "module",
      label: "Module",
      placeholder: "Select module",
      select: true,
      rules: { required: "Module is required" },
      defaultValue: "",
      options: MODULE_OPTIONS,
    },
    {
      name: "level",
      label: "Level",
      placeholder: "Select level",
      select: true,
      rules: { required: "Level is required" },
      defaultValue: "",
      options: LEVEL_OPTIONS,
    },
    {
      name: "experience",
      label: "Experience (Years)",
      placeholder: "Enter experience",
      type: "number",
      rules: { required: "Experience is required", min: 0 },
    },
    {
      name: "rate",
      label: "Rate (PKR/hr)",
      placeholder: "Enter rate",
      type: "number",
      rules: { required: "Rate is required", min: 1 },
    },
  ];
}
