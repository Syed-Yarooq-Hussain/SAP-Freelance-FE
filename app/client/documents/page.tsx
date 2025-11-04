"use client";

import Sidebar from "@/components/Sidebar";
import Document from "@/components/specific/Document";
import {
  adminContractRows,
  clientContractColumns,
  clientContractRows,
  signContractRows,
} from "@/data/clientDocument";
import { Box } from "@mui/material";

export default function ClientDocumentsPage() {
  return (
    <Sidebar>
      <Box sx={{ display: "grid", gap: 2 }}>
        <Document
          title="Contract"
          columns={clientContractColumns}
          rows={clientContractRows}
          showUpload
          showCreate
        />

        <Document
          title="Admin Contracts"
          columns={clientContractColumns}
          rows={adminContractRows}
          showUpload
          showCreate
        />

        <Document
          title="Sign Contracts"
          columns={clientContractColumns}
          rows={signContractRows}
          showUpload
          showCreate
        />
      </Box>
    </Sidebar>
  );
}
