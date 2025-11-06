"use client";

import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import InvoiceDetails from "@/components/InvoiceDetails";
import DynamicPopup from "@/components/Popup";
import StatCard from "@/components/StatCard";
import {
  invoiceData,
  teamBuilderPaymentCustomRangeColumns,
  teamBuilderPaymentCustomRangeRows,
  teamBuilderPaymentMilestoneColumns,
  teamBuilderPaymentMilestoneRows,
  teamBuilderPaymentStats,
} from "@/data/teamBuilder";
import { APP_ROUTES } from "@/utils/app_routes";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamPayments() {
  const router = useRouter();
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const handleToggleRange = () => {
    setIsCustomRange(!isCustomRange);
  };

  const handleUploadClick = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleUploadSubmit = () => {
    setUploadedFileName(selectedFileName);
    setOpenPopup(false);
  };

  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleFileSelect = (file: File) => {
    if (file) setSelectedFileName(file.name);
  };

  const handleDeleteFile = () => {
    setUploadedFileName("");
    setSelectedFileName("");
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
        mt: 3,
      }}
    >
      <Grid container spacing={2}>
        {teamBuilderPaymentStats.map((s, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mt={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, textTransform: "capitalize" }}
            >
              Payment ({isCustomRange ? "Custom Range" : "By Milestone"})
            </Typography>

            <AppButton
              label={`Pay by ${isCustomRange ? "Milestones" : "Custom Range"}`}
              colorKey="BLUE"
              width={200}
              onClick={handleToggleRange}
            />
          </Box>

          <DataTable
            title=""
            columns={
              isCustomRange
                ? teamBuilderPaymentCustomRangeColumns
                : teamBuilderPaymentMilestoneColumns
            }
            rows={
              isCustomRange
                ? teamBuilderPaymentCustomRangeRows
                : teamBuilderPaymentMilestoneRows
            }
            pageSize={10}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InvoiceDetails
            {...invoiceData}
            showUpload={isCustomRange}
            onUpload={handleUploadClick}
            uploadedFileName={uploadedFileName}
            onDeleteFile={handleDeleteFile}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <AppButton label="Discard" colorKey="RED" width={180} />
        <AppButton
          label="Start the Project"
          colorKey="BLUE"
          width={180}
          onClick={() => router.push(APP_ROUTES.CLIENT.DASHBOARD)}
        />
      </Box>

      <DynamicPopup
        open={openPopup}
        onClose={handleClosePopup}
        title="Upload Receipt"
        fileUpload
        onFileChange={handleFileSelect}
        buttonText="Upload"
        onSubmit={handleUploadSubmit}
        disableSubmit={!selectedFileName}
      />
    </Box>
  );
}
