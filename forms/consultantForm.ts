import { IFieldConfig } from "@/components/CreateForm";
import { LEVEL_OPTIONS, MODULE_OPTIONS } from "@/data/options";
import { fetchSapModules } from "@/services/common";
import { IOption } from "@/types/options";

export async function getConsultantFormFields(): Promise<IFieldConfig[]> {
  const { data } = await fetchSapModules();

  const coreOptions = convertModuleOptions(data?.core || []);
  const otherOptions = convertModuleOptions(data?.others || []);
  
  
  return [
    {
      name: "cv",
      label: "Upload CV",
      type: "file",
      rules: {},
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
      name: "core_module",
      label: "Core Module",
      placeholder: "Select module",
      select: true,
      rules: { required: "Module is required" },
      defaultValue: "",
      multiple: true,
      options: coreOptions,
    },
    {
      name: "other_module",
      label: "Other Module",
      placeholder: "Select module",
      select: true,
      rules: { required: "Module is required" },
      defaultValue: "",
      options: otherOptions,
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
    {
      name: "weekly_available_hours",
      label: "Hours (Available per week)",
      placeholder: "Enter hours",
      type: "number",
      rules: { required: "Rate is required", min: 1 },
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
  ];

  
}

interface IModule {
  id: number;
  name: string;
}

export function convertModuleOptions(modules: IModule[]): IOption[] {
  return modules.map((m) => ({
    label: m.name,
    value: String(m.id),
  }));
}

