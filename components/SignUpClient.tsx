"use client";

import { useSignupClient } from "@/actions/auth/signupClient";
import { CreateForm } from "@/components/CreateForm";
import { getClientFormFields } from "@/forms/clientForm";
import { useToast } from "@/providers/ToastProvider";
import { IBaseSignupDTO } from "@/types/common-auth";
import { ISignUpClientForm } from "@/types/signup-form";
import { Box, Paper } from "@mui/material";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { FieldValues } from "react-hook-form";
import AuthHeader from "./AuthHeader";
import LoginLink from "./LoginLink";

const SignUpClient: React.FC = () => {
  const { toast } = useToast();
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

    mutate(payload, {
      onError: (error: any) => {
        toast(error?.message || "Signup failed", "error");
      },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f7f9fc",
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
          maxWidth: 480,
          p: { xs: 3, sm: 4 },
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
          showProgress={true}
          mode="wizard"
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
