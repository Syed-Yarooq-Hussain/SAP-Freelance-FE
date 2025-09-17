import { IFieldConfig } from "@/components/CreateForm";

export function getClientFormFields(): IFieldConfig[] {
  return [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter full name",
      rules: { required: "Full name is required" },
    },
    {
      name: "companyName",
      label: "Company Name",
      placeholder: "Enter company name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      rules: {
        required: "Email is required",
        pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
      },
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter phone number",
      rules: {
        required: "Phone is required",
        pattern: {
          value: /^[0-9]{8,15}$/,
          message: "Invalid phone number format",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      rules: {
        required: "Password is required",
        minLength: { value: 6, message: "At least 6 chars" },
      },
      column: { xs: 12, sm: 6 },
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm password",
      rules: { required: "Confirm your password" },
      column: { xs: 12, sm: 6 },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter city",
      rules: { required: "City is required" },
      column: { xs: 12, sm: 6 },
    },
    {
      name: "country",
      label: "Country",
      placeholder: "Enter country",
      rules: { required: "Country is required" },
      column: { xs: 12, sm: 6 },
    },
  ];
}
