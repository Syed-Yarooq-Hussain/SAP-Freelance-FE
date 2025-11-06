"use client";

import { useSignupConsultant } from "@/actions/auth/signupConsultant";
import { CreateForm } from "@/components/CreateForm";
import { getConsultantFormFields } from "@/forms/consultantForm";
import { IConsultantSignupPayload } from "@/types/consultant";
import { Box, Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { FieldValues } from "react-hook-form";
import AuthHeader from "./AuthHeader";
import LoginLink from "./LoginLink";

interface IConsultantForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  country: string;
  module: string;
  level: string;
  experience: number;
  rate: number;
  availableHours: number;
  availability: {
    day: string;
    enabled: boolean;
    start?: string;
    end?: string;
  }[];
  cvUrl: string;
}

const SignUpConsultant: React.FC = () => {
  const { mutate, error, isPending } = useSignupConsultant();
  const searchParams = useSearchParams();
  const role = Number(searchParams.get("type")) || "Invalid role";

  const elements = getConsultantFormFields();
  const [prefillData, setPrefillData] = React.useState<Partial<FieldValues>>(
    {}
  );

  const handleCVParsed = (parsed: Partial<FieldValues>) => {
    setPrefillData((prev) => ({ ...prev, ...parsed }));
  };

  const handleSuccess = (data: FieldValues) => {
    const formData = { ...prefillData, ...data } as IConsultantForm;

    const payload: IConsultantSignupPayload = {
      consultant: {
        module: formData.module,
        level: formData.level,
        experience: Number(formData.experience) || 0,
        rate: formData.rate,
        weekly_available_hours: 20,
        schedule: {
          monday: "9-5",
          tuesday: "9-5",
          wednesday: "off",
          thursday: "9-5",
          friday: "9-5",
          saturday: "off",
          sunday: "off",
        },
        cv_url: formData.cvUrl ?? "",
      },
      user: {
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
      },
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
          heading="Create Consultant Account"
          description="Sign up to get started"
        />

        <CreateForm
          elements={elements}
          onSuccess={handleSuccess}
          loading={isPending}
          error={error?.message}
          onCVParsed={handleCVParsed}
          submitButton={{
            children: "Create an Account",
            variant: "contained",
            fullWidth: false,
            size: "medium",
          }}
        />
        <LoginLink />
      </Box>
    </Container>
  );
};

export default SignUpConsultant;
