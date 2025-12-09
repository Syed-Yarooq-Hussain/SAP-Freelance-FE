"use client";

import { useSignupClient } from "@/actions/auth/signupClient";
import { CreateForm } from "@/components/CreateForm";
import { getClientFormFields } from "@/forms/clientForm";
import { IBaseSignupDTO } from "@/types/common-auth";
import { Box, Paper } from "@mui/material";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { FieldValues } from "react-hook-form";
import AuthHeader from "./AuthHeader";
import LoginLink from "./LoginLink";

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

  const elements = getClientFormFields();

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
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f7f9fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: 4,
          borderRadius: 3,
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
            fullWidth: true,
            size: "large",
          }}
        />

        <LoginLink />
      </Paper>
    </Box>
  );
};

export default SignUpClient;
