"use client";

import { useLogin } from "@/actions/auth/login";
import AuthHeader from "@/components/AuthHeader";
import { CreateForm } from "@/components/CreateForm";
import { getLoginFormFields } from "@/forms/loginForm";
import { ILoginForm } from "@/types/common-auth";
import { APP_ROUTES } from "@/utils/app_routes";
import { Box, Container, Typography, Link } from "@mui/material";
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
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}>
          <Typography variant="body2">Don’t have an account?</Typography>
          <Link
            variant="body2"
            href={APP_ROUTES.HOME}
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            Sign up
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
