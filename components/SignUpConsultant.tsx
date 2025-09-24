"use client";

import * as React from "react";
import { Box, Container } from "@mui/material";
import { CreateForm } from "@/components/CreateForm";
import { FieldValues } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useSignupConsultant } from "@/actions/auth/signupConsultant";
import { IConsultantSignupPayload } from "@/types/consultant";
import AuthHeader from "./AuthHeader";
import { getConsultantFormFields } from "@/forms/consultantForm";
import { parseCV } from "@/utils/cvParser";

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
  const formHelpers = React.useRef<any>(null);

  const handleSuccess = (data: FieldValues) => {
    const formData = data as IConsultantForm;

    const payload: IConsultantSignupPayload = {
      consultant: {
        module: formData.module,
        level: formData.level,
        experience: formData.experience,
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

  const handleCVUpload = async (file: File) => {
  try {
    const parsed = await parseCV(file);

    if (formHelpers.current?.setValue) {
      if (parsed.fullName) formHelpers.current.setValue("fullName", parsed.fullName);
      if (parsed.email) formHelpers.current.setValue("email", parsed.email);
      if (parsed.phone) formHelpers.current.setValue("phone", parsed.phone);
      if (parsed.experience)
        formHelpers.current.setValue("experience", Number(parsed.experience));
      if (parsed.city) formHelpers.current.setValue("city", parsed.city);
      if (parsed.country) formHelpers.current.setValue("country", parsed.country);
    }
  } catch (err) {
    console.error("Error parsing CV:", err);
  }
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
        <AuthHeader heading="Create Consultant Account" description="Sign up to get started" />

        <CreateForm
          elements={elements.map((el) =>
            el.name === "cv"
              ? {
                ...el,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) handleCVUpload(file);
                },
              }
              : el
          )}
          onSuccess={handleSuccess}
          loading={isPending}
          error={error?.message}
          onFormReady={(helpers) => (formHelpers.current = helpers)} // 👈 capture setValue
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

export default SignUpConsultant;
