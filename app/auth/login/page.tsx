"use client";

import { useLogin } from "@/actions/auth/login";
import AuthHeader from "@/components/AuthHeader";
import { CreateForm } from "@/components/CreateForm";
import SignUpLink from "@/components/SignUpLink";
import { getLoginFormFields } from "@/forms/loginForm";
import { ILoginForm } from "@/types/common-auth";
import { Box, Paper } from "@mui/material";
import * as React from "react";
import { FieldValues } from "react-hook-form";

const LoginPage: React.FC = () => {
  const { mutate, error, isPending } = useLogin();

  const elements = getLoginFormFields();

  const handleSuccess = (data: FieldValues) => {
    const formData = data as ILoginForm;
    mutate(formData);
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
          textAlign: "center",
        }}
      >
        <AuthHeader
          heading="Welcome Back"
          description="Please sign in to continue"
        />

        <CreateForm
          elements={elements}
          onSuccess={handleSuccess}
          loading={isPending}
          error={error?.message}
          submitButton={{
            children: "Login",
            variant: "contained",
            fullWidth: true,
            size: "large",
          }}
        />
        <SignUpLink />
      </Paper>
    </Box>
  );
};

export default LoginPage;
