"use client";

import * as React from "react";
import { Box, Container } from "@mui/material";
import { CreateForm } from "@/components/CreateForm";
import { FieldValues } from "react-hook-form";
import { useSignupClient } from "@/actions/auth/signupClient";
import { useSearchParams } from "next/navigation";
import { IBaseSignupDTO } from "@/types/commonauth";
import AuthHeader from "./AuthHeader";
import { getClientFormFields } from "@/forms/clientForm";

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
