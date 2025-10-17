"use client";

import Sidebar from "@/components/Sidebar";
import Interview from "@/components/specific/Interview";
import {
  consultantInterviewStats,
  getConsultantInterviewColumns,
  consultantInterviewRows,
} from "@/data/consultantInterview";

export default function ConsultantInterviewPage() {
  return (
    <Sidebar>
      <Interview
        title="List of Interviews"
        stats={consultantInterviewStats}
        getColumns={getConsultantInterviewColumns}
        rows={consultantInterviewRows}
        rescheduleEnabled
      />
    </Sidebar>
  );
}
