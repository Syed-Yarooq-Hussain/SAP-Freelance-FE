"use client";

import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import StatusDropdown from "@/components/StatusDropdown";
import { STATUS } from "@/constants/status_dropdown";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

export default function ConsultantDocuments() {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleSend = () => {
    console.log("Rejection reason:", reason);
    setRejectOpen(false);
    setReason("");
  };

  const taskColumns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 2 },
    { field: "deadline", headerName: "Deadline", flex: 2 },
    { field: "expirationDate", headerName: "Expiration Date", flex: 2 },
    { field: "client", headerName: "Client Name", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <StatusDropdown
          value={params.value}
          onRejectClick={() => setRejectOpen(true)}
        />
      ),
    },
  ];

  const taskRows = [
    {
      id: 1,
      name: "NDA",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "ManuCorp",
      status: STATUS.SIGNED,
    },
    {
      id: 2,
      name: "Service",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "ManuCorp",
      status: STATUS.PENDING,
    },
    {
      id: 3,
      name: "Property ownership",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "ManuCorp",
      status: STATUS.REJECTED,
    },
    {
      id: 4,
      name: "NDA",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "RetailCo",
      status: STATUS.SIGNED,
    },
    {
      id: 5,
      name: "Service",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "RetailCo",
      status: STATUS.PENDING,
    },
    {
      id: 6,
      name: "Property ownership",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "RetailCo",
      status: STATUS.REJECTED,
    },
    {
      id: 7,
      name: "NDA",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "LogicCo",
      status: STATUS.SIGNED,
    },
    {
      id: 8,
      name: "Service",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "LogicCo",
      status: STATUS.PENDING,
    },
    {
      id: 9,
      name: "Property ownership",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "LogicCo",
      status: STATUS.REJECTED,
    },
    {
      id: 10,
      name: "NDA",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "TechFirm",
      status: STATUS.SIGNED,
    },
    {
      id: 11,
      name: "Service",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "TechFirm",
      status: STATUS.PENDING,
    },
    {
      id: 12,
      name: "Property ownership",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "TechFirm",
      status: STATUS.REJECTED,
    },
    {
      id: 13,
      name: "NDA",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "BankCorp",
      status: STATUS.SIGNED,
    },
    {
      id: 14,
      name: "Service",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "BankCorp",
      status: STATUS.PENDING,
    },
    {
      id: 15,
      name: "Property ownership",
      deadline: "15.09.2025",
      expirationDate: "15.09.2028",
      client: "BankCorp",
      status: STATUS.REJECTED,
    },
  ];

  return (
    <>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <DataTable
          title="Signed Contract"
          columns={taskColumns}
          rows={taskRows}
          pageSize={10}
        />
      </Box>

      <DynamicPopup
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reason for rejection"
        fields={[
          {
            id: "reason",
            label: "",
            type: "text",
            value: reason,
            onChange: setReason,
            placeholder: "Describe",
          },
        ]}
        buttonText="Send"
        buttonColor="BLUE"
        noteText="If customer agrees he will update the contract and re-send"
        onSubmit={handleSend}
        disableSubmit={!reason.trim()}
      />
    </>
  );
}
