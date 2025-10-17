"use client";

import Sidebar from "@/components/Sidebar";
import Document from "@/components/specific/Document";
import {
  consultantDocumentColumns,
  consultantDocumentRows,
} from "@/data/consultantDocument";

export default function ConsultantDocumentsPage() {
  return (
    <Sidebar>
      <Document
        title=""
        columns={consultantDocumentColumns}
        rows={consultantDocumentRows}
        showRejectPopup
      />
    </Sidebar>
  );
}
