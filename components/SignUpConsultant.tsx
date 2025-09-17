"use client";

import * as React from "react";
import { Box, Container, MenuItem } from "@mui/material";
import { CreateForm, IFieldConfig } from "@/components/CreateForm";
import { FieldValues } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useSignupConsultant } from "@/actions/auth/signupConsultant";
import { IConsultantSignupPayload } from "@/types/consultant";
import AuthHeader from "./AuthHeader";

interface IConsultantForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  country: string;
  module: string;
  level: string;
  experience: number;
  rate: number;
  availableHours: number;
  availability: {
    day: string;
    enabled: boolean;
    start?: string;
    end?: string;
  }[];
  cvUrl: string;
}

const SignUpConsultant: React.FC = () => {
  const { mutate, error, isPending } = useSignupConsultant();
  const searchParams = useSearchParams();
  const role = Number(searchParams.get("type")) || "Invalid role";

  const elements: IFieldConfig[] = [
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
      children: [
        <MenuItem key="frontend" value="frontend">
          Frontend
        </MenuItem>,
        <MenuItem key="backend" value="backend">
          Backend
        </MenuItem>,
        <MenuItem key="fullstack" value="fullstack">
          Full Stack
        </MenuItem>,
        <MenuItem key="design" value="design">
          Design
        </MenuItem>,
      ],
    },
    {
      name: "level",
      label: "Level",
      placeholder: "Select level",
      select: true,
      rules: { required: "Level is required" },
      defaultValue: "",
      children: [
        <MenuItem key="junior" value="junior">
          Junior
        </MenuItem>,
        <MenuItem key="senior" value="senior">
          Senior
        </MenuItem>,
        <MenuItem key="lead" value="lead">
          Lead
        </MenuItem>,
      ],
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
      type: "number",
      rules: { required: "Rate is required", min: 1 },
    },
    {
      name: "cv",
      label: "Upload CV",
      type: "file",
      rules: { required: "CV is required" },
      inputProps: { accept: ".pdf,.doc,.docx" },
    },
  ];

  const handleSuccess = (data: FieldValues) => {
    const formData = data as IConsultantForm;

    const payload: IConsultantSignupPayload = {
      consultant: {
        module: formData.module,
        level: formData.level,
        experience: formData.experience,
        rate: formData.rate,
        weekly_available_hours: 20,
        schedule: {
          monday: "9-5",
          tuesday: "9-5",
          wednesday: "off",
          thursday: "9-5",
          friday: "9-5",
          saturday: "off",
          sunday: "off",
        },
        cv_url: formData.cvUrl ?? "",
      },
      user: {
        username: formData.fullName,
        role,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        currency: "EUR",
        city: formData.city,
        country: formData.country,
        status: 1,
      },
    };

    mutate(payload);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <AuthHeader
          heading="Create Consultant Account"
          description="Sign up to get started"
        />

        <CreateForm
          elements={elements}
          onSuccess={handleSuccess}
          loading={isPending}
          error={error?.message}
          submitButton={{
            children: "Create an Account",
            variant: "contained",
            fullWidth: false,
            size: "medium",
          }}
        />
      </Box>
    </Container>
  );
};

export default SignUpConsultant;
