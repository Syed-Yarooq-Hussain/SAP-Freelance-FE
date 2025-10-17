"use client";

import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import {
  adminConsultantColumns,
  adminConsultantRows,
} from "@/data/adminConsultant";

export default function AdminConsultantPage() {
  return (
    <Sidebar>
      <Consultant
        title="Consultant"
        columns={adminConsultantColumns}
        rows={adminConsultantRows}
      />
    </Sidebar>
  );
}
