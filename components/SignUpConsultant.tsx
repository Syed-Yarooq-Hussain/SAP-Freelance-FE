"use client";

import { useSignupConsultant } from "@/actions/auth/signupConsultant";
import { CreateForm, IFieldConfig } from "@/components/CreateForm";
import { getConsultantFormFields } from "@/forms/consultantForm";
import { IConsultantSignupPayload } from "@/types/consultant";
import { Box, Paper } from "@mui/material";
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
  core_module: string;
  other_module: string;
  weekly_available_hours: number;
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
  const role = Number(searchParams.get("type"));
  const [elements, setElements] = React.useState<IFieldConfig[]>([]);

  const [prefillData, setPrefillData] = React.useState<Partial<FieldValues>>(
    {}
  );

  React.useEffect(() => {
    async function loadElements() {
      const fields = await getConsultantFormFields(); 
      setElements(fields);
    }
    loadElements();
  }, []);

  const handleCVParsed = (parsed: Partial<FieldValues>) => {
    setPrefillData((prev) => ({ ...prev, ...parsed }));
  };

  const handleSuccess = (data: FieldValues) => {
    const formData = { ...prefillData, ...data } as IConsultantForm;

    const payload: IConsultantSignupPayload = {
      consultant: {
        core_module: [formData.core_module],
        other_module: [formData.other_module],
        experience: Number(formData.experience) || 0,
        rate: formData.rate,
        weekly_available_hours: formData.weekly_available_hours,
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
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f7f9fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 2,
        overflowY: "auto",
        top: 0,
        left: 0,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 560,
          p: 4,
          borderRadius: 3,
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
            fullWidth: true,
            size: "large",
          }}
        />

        <LoginLink />
      </Paper>
    </Box>
  );
};

export default SignUpConsultant;
