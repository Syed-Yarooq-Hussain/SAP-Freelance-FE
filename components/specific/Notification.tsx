"use client";

import DataTable from "@/components/DataTable";
import AppButton from "@/components/Button";
import DynamicPopup from "@/components/Popup";
import { getSendNotificationFormFields } from "@/forms/sendNotificationForm";
import { mapTaskFieldsToPopup } from "@/utils/mapFormToPopup";
import { Box, Typography } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { useState } from "react";
import {
  CUSTOM_CLIENT_OPTIONS,
  CUSTOM_CONSULTANT_OPTIONS,
} from "@/data/options";

interface NotificationProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  rows: T[];
  columns: GridColDef<T>[];
}

export default function Notification<
  T extends GridValidRowModel = GridValidRowModel
>({
  title,
  rows,
  columns,
}: NotificationProps<T>) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({
  name: "",
  target: "",
  recipients: [],
});


const baseFields = getSendNotificationFormFields();

const dynamicFields = [...baseFields];

if (formData.target === "custom_consultants") {
  dynamicFields.push({
    name: "recipients",
    label: "Select Consultants",
    type: "select",
    options: CUSTOM_CONSULTANT_OPTIONS,
  });
}

if (formData.target === "custom_clients") {
  dynamicFields.push({
    name: "recipients",
    label: "Select Clients",
    type: "select",
    options: CUSTOM_CLIENT_OPTIONS,
  });
}

  return (
    <Box
      sx={{
        p: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>

        <AppButton
          label="Send Notification"
          colorKey="BLUE"
          width={180}
          onClick={() => setOpen(true)}
        />
      </Box>

      <DataTable
        title=""
        rows={rows}
        columns={columns}
        pageSize={10}
        showAvatar={false}
      />

      <DynamicPopup
  open={open}
  onClose={() => {
    setOpen(false);
    setFormData({ name: "", target: "", recipients: [] });
  }}
  title="Send Notification"
  buttonText="Send"
  buttonColor="BLUE"
  disableSubmit={
    !formData.name ||
    !formData.target ||
    (["custom_clients", "custom_consultants"].includes(formData.target) &&
      formData.recipients.length === 0)
  }
  fields={mapTaskFieldsToPopup(
    dynamicFields,
    formData,
    (field, value) => {
      if (field === "target") {
        setFormData({ name: formData.name, target: value, recipients: [] });
        return;
      }

      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  )}
  onSubmit={() => {
    console.log("Notification Payload:", formData);
    setOpen(false);
  }}
/>

    </Box>
  );
}
