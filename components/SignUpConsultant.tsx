"use client";

import { useSignupConsultant } from "@/actions/auth/signupConsultant";
import { CreateForm } from "@/components/CreateForm";
import { getConsultantFormFields } from "@/forms/consultantForm";
import { useToast } from "@/providers/ToastProvider";
import { IConsultantSignupPayload } from "@/types/consultant";
import { Box, Paper } from "@mui/material";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { FieldValues } from "react-hook-form";
import AuthHeader from "./AuthHeader";
import LoginLink from "./LoginLink";

const SignUpConsultant: React.FC = () => {
  const { toast } = useToast();
  const { mutate, isPending } = useSignupConsultant();
  const searchParams = useSearchParams();
  const role = Number(searchParams.get("type"));
  const elements = getConsultantFormFields();
  const [cvPayload, setCvPayload] = React.useState<any | null>(null);

  const handleCVParsed = ({ __cvPayload }: { __cvPayload: any }) => {
    setCvPayload(__cvPayload);
  };

  const handleSuccess = (data: FieldValues) => {
    if (cvPayload?.consultant && cvPayload?.user) {
      const payload: IConsultantSignupPayload = {
        consultant: {
          ...cvPayload.consultant,

          core_module: data.coreModule ?? [],
          other_module: data.otherModule ?? [],

          rate: cvPayload.consultant.rate ?? Number(data.rate) ?? 0,

          weekly_available_hours: Number(data.weekly_available_hours) ?? 15,
        },

        user: {
          ...cvPayload.user,
          username: data.fullName,
          email: data.email,
          phone: data.phone,
          city: data.city,
          country: data.country,
          role,
          password: data.password,
          confirmPassword: data.confirmPassword,
          currency: cvPayload.user.currency ?? "PKR",
          status: "active",
        },
      };

      mutate(payload);
      return;
    }

    const payload: IConsultantSignupPayload = {
      consultant: {
        core_module: data.coreModule ?? [],
        other_module: data.otherModule ?? [],
        experience: Number(data.experience) || 0,
        rate: Number(data.rate) || 0,
        weekly_available_hours: data.weekly_available_hours ?? 15,
        cv_url: "",
      },
      user: {
        username: data.fullName,
        role,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        currency: "PKR",
        city: data.city,
        country: data.country,
        status: "active",
      },
    };

    mutate(payload, {
      onError: (error: any) => {
        toast(error?.message || "Signup failed", "error");
      },
    });
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
          showProgress
          mode="wizard"
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
