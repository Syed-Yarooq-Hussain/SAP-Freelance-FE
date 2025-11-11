"use client";

import { useLogin } from "@/actions/auth/login";
import AuthHeader from "@/components/AuthHeader";
import { CreateForm } from "@/components/CreateForm";
import SignUpLink from "@/components/SignUpLink";
import { getLoginFormFields } from "@/forms/loginForm";
import { ILoginForm } from "@/types/common-auth";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import * as React from "react";
import { FieldValues } from "react-hook-form";

const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === "true";

const LoginPage: React.FC = () => {
  const { mutate, error, isPending } = useLogin();
  const elements = getLoginFormFields();

  const handleSuccess = (data: FieldValues) => {
    const formData = data as ILoginForm;
    mutate(formData);
  };

  const quickLogin = (email: string) => {
    mutate({ email, password: "test" } as ILoginForm);
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

        {TEST_MODE && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="caption"
              sx={{ display: "block", mb: 1, opacity: 0.8 }}
            >
              Test mode (no backend required)
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => quickLogin("client@test.com")}
              >
                Login as CLIENT
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => quickLogin("consultant@test.com")}
              >
                Login as CONSULTANT
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => quickLogin("admin@test.com")}
              >
                Login as ADMIN
              </Button>
            </Stack>
          </>
        )}

        <SignUpLink />
      </Box>
    </Container>
  );
};

export default LoginPage;
