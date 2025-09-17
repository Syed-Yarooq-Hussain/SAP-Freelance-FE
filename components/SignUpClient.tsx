"use client";

import * as React from "react";
import { Box, Container } from "@mui/material";
import { CreateForm, IFieldConfig } from "@/components/CreateForm";
import { FieldValues } from "react-hook-form";
import { useSignupClient } from "@/actions/auth/signupClient";
import { useSearchParams } from "next/navigation";
import { IBaseSignupDTO } from "@/types/commonauth";
import AuthHeader from "./AuthHeader";

interface ISignUpClientForm {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  country: string;
}

const SignUpClient: React.FC = () => {
  const { mutate, error, isPending } = useSignupClient();
  const searchParams = useSearchParams();
  const role = Number(searchParams.get("type")) || 0;

  const elements: IFieldConfig[] = [
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

  const handleSuccess = (data: FieldValues) => {
    const formData = data as ISignUpClientForm;

    const payload: IBaseSignupDTO = {
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
          heading="Create Client Account"
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

export default SignUpClient;
