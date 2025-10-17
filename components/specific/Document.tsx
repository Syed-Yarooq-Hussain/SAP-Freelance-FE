"use client";

import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import StatusDropdown from "@/components/StatusDropdown";
import { Box, Stack, Typography } from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useState } from "react";

interface DocumentProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  columns: GridColDef<T>[];
  rows: T[];
  showUpload?: boolean;
  showCreate?: boolean;
  showRejectPopup?: boolean;
}

export default function Document<
  T extends GridValidRowModel = GridValidRowModel
>({
  title,
  columns,
  rows,
  showUpload = false,
  showCreate = false,
  showRejectPopup = false,
}: DocumentProps<T>) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleUpload = () => setUploadOpen(true);
  const handleReject = () => setRejectOpen(true);
  const handleClose = () => {
    setUploadOpen(false);
    setRejectOpen(false);
  };

  const enhancedColumns = showRejectPopup
    ? columns.map((col) => {
        if (col.field === "status") {
          return {
            ...col,
            renderCell: (params: GridRenderCellParams<T>) => (
              <StatusDropdown
                value={params.value}
                onRejectClick={handleReject}
              />
            ),
          };
        }
        return col;
      })
    : columns;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      {(showUpload || showCreate) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Stack direction="row" spacing={2}>
            {showUpload && (
              <AppButton
                label="Upload"
                colorKey="GREEN"
                onClick={handleUpload}
              />
            )}
            {showCreate && <AppButton label="Create" colorKey="BLUE" />}
          </Stack>
        </Box>
      )}

      <DataTable
        title={showUpload || showCreate ? "" : title}
        columns={enhancedColumns}
        rows={rows}
        pageSize={10}
      />

      {showUpload && (
        <DynamicPopup
          open={uploadOpen}
          onClose={handleClose}
          title="Upload Document"
          fileUpload
          buttonText="Save"
          buttonColor="BLUE"
          onSubmit={() => setUploadOpen(false)}
        />
      )}

      {showRejectPopup && (
        <DynamicPopup
          open={rejectOpen}
          onClose={handleClose}
          title="Reason for rejection"
          fields={[
            {
              id: "reason",
              label: "",
              type: "text",
              value: reason,
              onChange: (val: string | File) => {
                if (typeof val === "string") setReason(val);
              },
              placeholder: "Describe reason",
            },
          ]}
          buttonText="Send"
          buttonColor="BLUE"
          noteText="If customer agrees, they will update and re-send."
          onSubmit={() => {
            console.log("Rejection reason:", reason);
            setRejectOpen(false);
            setReason("");
          }}
          disableSubmit={!reason.trim()}
        />
      )}
    </Box>
  );
}
