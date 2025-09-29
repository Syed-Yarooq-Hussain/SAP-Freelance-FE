"use client";

import * as React from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { CreateForm } from "@/components/CreateForm";
import { FieldValues } from "react-hook-form";
import { useSignupClient } from "@/actions/auth/signupClient";
import { useSearchParams } from "next/navigation";
import { IBaseSignupDTO } from "@/types/common-auth";
import AuthHeader from "./AuthHeader";
import { getClientFormFields } from "@/forms/clientForm";
import { APP_ROUTES } from "@/utils/app_routes";

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
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        pb: 4,
      }}
    >
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
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}>
          <Typography variant="body2">Already have an account?</Typography>
          <Link variant="body2"
            href={APP_ROUTES.LOGIN}
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            Login here
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpClient;
