"use client";

import { useLogin } from "@/actions/auth/login";
import AuthHeader from "@/components/AuthHeader";
import { CreateForm } from "@/components/CreateForm";
import SignUpLink from "@/components/SignUpLink";
import { getLoginFormFields } from "@/forms/loginForm";
import { ILoginForm } from "@/types/common-auth";
import { Box, Container } from "@mui/material";
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
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
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
            fullWidth: false,
            size: "medium",
          }}
        />
        <SignUpLink />
      </Box>
    </Container>
  );
};

export default LoginPage;
