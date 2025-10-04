"use client";

import { CreateForm } from "@/components/CreateForm";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { FieldValues } from "react-hook-form";

export default function ProfilePage() {
  const elements = [
    {
      name: "name",
      label: "Name",
      placeholder: "Aria Winters",
      column: { xs: 12, md: 6 },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Aria.Winters@mail.com",
      type: "email",
      column: { xs: 12, md: 6 },
    },
    {
      name: "weeklyHours",
      label: "Weekly working hours",
      placeholder: "30 hr / Weekly",
      column: { xs: 12, md: 6 },
    },
    {
      name: "hourlyRates",
      label: "Hourly rates",
      placeholder: "$20 / Hr",
      column: { xs: 12, md: 6 },
    },
    {
      name: "nationality",
      label: "Nationality",
      placeholder: "Pakistan",
      column: { xs: 12, md: 6 },
    },
    {
      name: "resume",
      label: "Resume",
      placeholder: "Resume",
      column: { xs: 12, md: 6 },
    },
    {
      name: "coreSapModel",
      label: "Core SAP Model",
      placeholder: "ABAP technical",
      column: { xs: 12, md: 6 },
    },
    {
      name: "otherModules",
      label: "Other Modules",
      placeholder: "PP - CO - FI",
      column: { xs: 12, md: 6 },
    },
    {
      name: "experience",
      label: "Experience",
      placeholder: "12 years",
      column: { xs: 12, md: 6 },
    },
    {
      name: "rate",
      label: "Rate",
      placeholder: "8 / 10",
      column: { xs: 12, md: 6 },
    },
    {
      name: "visibility",
      label: "Visibility",
      type: "select",
      options: [
        { label: "All clients", value: "all" },
        { label: "Private", value: "private" },
      ],
      column: { xs: 12, md: 6 },
    },
  ];

  const handleSuccess = (data: FieldValues) => {
    console.log("Form Submitted:", data);
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Personnel Details
      </Typography>

      <CreateForm
        elements={elements.slice(0, 6)}
        onSuccess={handleSuccess}
        submitButton={{ sx: { display: "none" } }}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom fontWeight="bold">
        Technical Expertise
      </Typography>

      <CreateForm
        elements={elements.slice(6)}
        onSuccess={handleSuccess}
        submitButton={{ sx: { display: "none" } }}
      />
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <Button variant="contained" color="primary">
          Update
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "green", "&:hover": { bgcolor: "darkgreen" } }}
        >
          Anonymous mode
        </Button>
        <Button variant="contained" color="error">
          Delete account
        </Button>
      </Stack>
    </Box>
  );
}
