"use client";

import { useState } from "react";
import { Box, Tab, Tabs, Paper, CircularProgress, Alert } from "@mui/material";
import { useAdminPayments } from "@/actions/admin/useAdminPayments";
import DataTable from "@/components/DataTable";
import {
  createClientPaymentColumns,
  createConsultantPaymentColumns,
} from "@/data/adminPayments";
import type { IClientPaymentDTO } from "@/types/client";
import type { IAdminConsultantMonthlyBill } from "@/types/adminPayments";
import MarkPaidDialog from "./MarkPaidDialog";

type TabValue = "client" | "consultant";

export default function AdminPaymentsPanel() {
  const [activeTab, setActiveTab] = useState<TabValue>("client");
  const [selectedPayment, setSelectedPayment] = useState<
    IClientPaymentDTO | IAdminConsultantMonthlyBill | null
  >(null);
  const [openMarkPaid, setOpenMarkPaid] = useState(false);

  const { data, isLoading, error } = useAdminPayments();

  const handleMarkPaidClick = (
    payment: IClientPaymentDTO | IAdminConsultantMonthlyBill
  ) => {
    setSelectedPayment(payment);
    setOpenMarkPaid(true);
  };

  const handleCloseDialog = () => {
    setOpenMarkPaid(false);
    setSelectedPayment(null);
  };

  const clientPaymentColumns = createClientPaymentColumns(
    handleMarkPaidClick
  );
  const consultantPaymentColumns = createConsultantPaymentColumns(
    handleMarkPaidClick
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Failed to load payments: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, md: 2 },
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          bgcolor: "#fff",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 2,
            minHeight: 40,
            borderBottom: "1px solid #E2E8F0",
            "& .MuiTab-root": {
              minHeight: 40,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "#64748B",
            },
            "& .Mui-selected": {
              color: "#134481",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#134481",
            },
          }}
        >
          <Tab
            label={`Client Payments (${data?.client_payments.length || 0})`}
            value="client"
          />
          <Tab
            label={`Consultant Payments (${
              data?.consultant_payments.length || 0
            })`}
            value="consultant"
          />
        </Tabs>

        {activeTab === "client" && data?.client_payments && (
          <DataTable
            title="Client Payments"
            columns={clientPaymentColumns}
            rows={data.client_payments.map((payment, idx) => ({
              ...payment,
              id: payment.id,
              _rowIndex: idx,
            }))}
            pageSize={10}
          />
        )}

        {activeTab === "consultant" && data?.consultant_payments && (
          <DataTable
            title="Consultant Payments"
            columns={consultantPaymentColumns}
            rows={data.consultant_payments.map((payment, idx) => ({
              ...payment,
              id: payment.id,
              _rowIndex: idx,
            }))}
            pageSize={10}
          />
        )}
      </Paper>

      {selectedPayment && (
        <MarkPaidDialog
          open={openMarkPaid}
          onClose={handleCloseDialog}
          payment={selectedPayment}
          paymentType={activeTab}
        />
      )}
    </Box>
  );
}
