"use client";

import { useLogin } from "@/actions/auth/login";
import AuthHeader from "@/components/AuthHeader";
import { CreateForm, IFieldConfig } from "@/components/CreateForm";
import { ILoginForm } from "@/types/commonauth";
import { APP_ROUTES } from "@/utils/app_routes";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import * as React from "react";
import { FieldValues } from "react-hook-form";

const LoginPage: React.FC = () => {
  const { mutate, error, isPending } = useLogin();

  const elements: IFieldConfig[] = [
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
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don’t have an account?
        <Link
          href={APP_ROUTES.HOME}
          style={{ textDecoration: "none", fontWeight: "bold" }}
        >
          Sign up
        </Link>
      </Typography>
    </Container>
  );
};

export default LoginPage;
