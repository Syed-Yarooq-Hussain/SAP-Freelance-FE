"use client";

import AppButton from "@/components/Button";
import { colors } from "@/utils/styles/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

export interface InvoiceDetailsProps {
  invoiceName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  invoiceNumber: string;
  amount: string;
  serviceCharges: string;
  vat: string;
  vatAmount?: string;
  totalAmount: string;
  showUpload?: boolean;
  onUpload?: () => void;
  uploadedFileName?: string;
  onDeleteFile?: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  invoiceName,
  accountTitle,
  accountNumber,
  iban,
  invoiceNumber,
  amount,
  serviceCharges,
  vat,
  vatAmount = "$35",
  totalAmount,
  showUpload = false,
  onUpload,
  uploadedFileName,
  onDeleteFile,
}) => {
  return (
    <Box
      sx={{
        p: 2.5,
        bgcolor: "#f7f7f7",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        mb={1.5}
        color="text.primary"
      >
        Details
      </Typography>

      <Grid container spacing={1.2}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Invoice Name
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }} textAlign="right">
          <Typography variant="body2" fontWeight={600}>
            {invoiceName}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Account Title
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }} textAlign="right">
          <Typography variant="body2" fontWeight={600}>
            {accountTitle}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Account Number
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }} textAlign="right">
          <Typography variant="body2" fontWeight={500}>
            {accountNumber}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">
            IBAN
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }} textAlign="right">
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            fontWeight={500}
          >
            {iban}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Invoice Number
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }} textAlign="right">
          <Typography variant="body2" fontWeight={600}>
            {invoiceNumber}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="subtitle1"
        fontWeight={700}
        mb={1}
        color="text.primary"
      >
        Payment Details
      </Typography>

      <Grid container spacing={1.2}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Amount
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }} textAlign="right">
          <Typography variant="body2" fontWeight={600}>
            ${amount}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Service Charges
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }} textAlign="right">
          <Typography variant="body2" fontWeight={600}>
            ${serviceCharges}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">
            VAT
          </Typography>
        </Grid>
        <Grid size={{ xs: 3 }} textAlign="center">
          <Typography variant="body2" fontWeight={600}>
            {vat}
          </Typography>
        </Grid>
        <Grid size={{ xs: 3 }} textAlign="right">
          <Typography variant="body2" fontWeight={600}>
            {vatAmount}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Grid container spacing={1.2}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Total Amount
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }} textAlign="right">
          <Typography variant="body2" fontWeight={700}>
            ${totalAmount}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      {showUpload && (
        <>
          <Grid container spacing={1.2} alignItems="center">
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Receipt
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 6 }}
              textAlign="right"
              display="flex"
              justifyContent="flex-end"
            >
              <AppButton
                label="Upload"
                colorKey="YELLOW"
                width={100}
                onClick={onUpload}
              />
            </Grid>
          </Grid>

          {uploadedFileName && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={1.2}
              pl={0.5}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#1976d2",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "80%",
                }}
              >
                {uploadedFileName}
              </Typography>

              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={onDeleteFile}
                  sx={{
                    color: colors.RED,
                    "&:hover": { bgcolor: `${colors.RED}15` },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Divider sx={{ mt: 2 }} />
        </>
      )}
    </Box>
  );
};

export default InvoiceDetails;
