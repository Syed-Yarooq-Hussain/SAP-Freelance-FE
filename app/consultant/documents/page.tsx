"use client";

import Sidebar from "@/components/Sidebar";
import Document from "@/components/specific/Document";
import {
  consultantDocsColumns,
  consultantDocsRows,
  consultantDocumentColumns,
  consultantDocumentRows,
} from "@/data/consultantDocument";

export default function ConsultantDocumentsPage() {
  return (
    <Sidebar>
      <div className='p-2'>
        <Document
          title="Documents"
          columns={consultantDocsColumns}
          rows={consultantDocsRows}
        />

        <div style={{ marginTop: 16 }} />
        <Document
          title="Contracts"
          columns={consultantDocumentColumns}
          rows={consultantDocumentRows}
          showRejectPopup
        />
      </div>
    </Sidebar>
  );
}
