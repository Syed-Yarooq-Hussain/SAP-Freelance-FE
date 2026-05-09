"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AppButton from "@/components/Button";
import type { IClientPaymentDTO } from "@/types/client";
import type { IAdminConsultantMonthlyBill } from "@/types/adminPayments";
import { formatCurrencyValue } from "@/utils/payments";
import { useUploadDocument } from "@/actions/documents/useUploadDocument";
import { useUpdateAdminPaymentStatus } from "@/actions/admin/useUpdateAdminPaymentStatus";

interface MarkPaidDialogProps {
  open: boolean;
  onClose: () => void;
  payment: IClientPaymentDTO | IAdminConsultantMonthlyBill;
  paymentType: "client" | "consultant";
}

export default function MarkPaidDialog({
  open,
  onClose,
  payment,
  paymentType,
}: MarkPaidDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const uploadMutation = useUploadDocument();
  const updateStatusMutation = useUpdateAdminPaymentStatus();

  const isLoading = uploadMutation.isPending || updateStatusMutation.isPending;

  const isClientPayment = (
    p: IClientPaymentDTO | IAdminConsultantMonthlyBill
  ): p is IClientPaymentDTO => {
    return paymentType === "client";
  };

  const getPaymentDetails = () => {
    if (isClientPayment(payment)) {
      return {
        id: payment.id,
        amount: payment.amount,
        projectName: payment.project?.name || "N/A",
        milestoneName: payment.milestone?.name || "Custom",
        description: `${payment.payment_module?.toUpperCase()} Payment`,
      };
    } else {
      return {
        id: payment.id,
        amount: payment.amount,
        projectName: payment.project?.name || "N/A",
        milestoneName: payment.milestone?.name || "N/A",
        description: `Bill for ${payment.month} - ${payment.hours} hours`,
      };
    }
  };

  const details = getPaymentDetails();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please select a PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleMarkPaid = async () => {
    try {
      setError("");
      let docId: string | null = null;

      // If file is selected, upload it first
      if (selectedFile) {
        const uploadResult = await uploadMutation.mutateAsync({
          file: selectedFile,
          type: paymentType === "client" ? "client_payment" : "consultant_payment",
        });

        if (uploadResult.data?.doc_id) {
          docId = uploadResult.data.doc_id;
        }
      }

      // Update payment status
      await updateStatusMutation.mutateAsync({
        payment,
        paymentType,
        docId,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSelectedFile(null);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to mark payment as paid"
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mark Payment as Paid</DialogTitle>
      <DialogContent>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Payment marked as paid successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Payment Details */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: "#f5f5f5" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Project
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {details.projectName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Milestone
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {details.milestoneName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Type
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {details.description}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Amount
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                {formatCurrencyValue(details.amount)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* File Upload Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Upload Receipt/Invoice (Optional)
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              border: "2px dashed #ccc",
              borderRadius: 1,
              bgcolor: selectedFile ? "#e8f5e9" : "#fafafa",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "#f0f7ff",
              },
            }}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="file-upload"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                cursor: isLoading ? "default" : "pointer",
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 32, color: "primary.main" }} />
              {selectedFile ? (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ✓ {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    PDF files only, max 10MB
                  </Typography>
                </>
              )}
            </label>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <AppButton
          label="Cancel"
          colorKey="GREY"
          onClick={onClose}
          disabled={isLoading}
          width={100}
        />
        <AppButton
          label={isLoading ? "Processing..." : "Mark Paid"}
          colorKey="GREEN"
          onClick={handleMarkPaid}
          disabled={isLoading}
          width={120}
        />
      </DialogActions>
    </Dialog>
  );
}
