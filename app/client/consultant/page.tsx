"use client";

import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import {
  clientConsultantColumns,
  clientConsultantRows,
} from "@/data/clientConsultant";

export default function ClientConsultantPage() {
  return (
    <Sidebar>
      <Consultant
        title="Consultant"
        columns={clientConsultantColumns}
        rows={clientConsultantRows}
        showMeetingActions
        showFilters
      />
    </Sidebar>
  );
}
