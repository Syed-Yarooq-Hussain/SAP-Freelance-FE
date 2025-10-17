"use client";

import Sidebar from "@/components/Sidebar";
import Interview from "@/components/specific/Interview";
import {
  clientInterviewColumns,
  clientInterviewRows,
  clientInterviewStats,
} from "@/data/clientInterview";

export default function ClientInterviewPage() {
  return (
    <Sidebar>
      <Interview
        title="Meetings"
        stats={clientInterviewStats}
        columns={clientInterviewColumns}
        rows={clientInterviewRows}
      />
    </Sidebar>
  );
}
