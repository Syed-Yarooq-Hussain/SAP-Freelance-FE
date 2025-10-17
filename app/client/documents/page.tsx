"use client";

import Sidebar from "@/components/Sidebar";
import Document from "@/components/specific/Document";
import {
  clientDocumentColumns,
  clientDocumentRows,
} from "@/data/clientDocument";

export default function ClientDocumentsPage() {
  return (
    <Sidebar>
      <Document
        title="Contracts"
        columns={clientDocumentColumns}
        rows={clientDocumentRows}
        showUpload
        showCreate
      />
    </Sidebar>
  );
}
