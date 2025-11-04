"use client";

import Sidebar from "@/components/Sidebar";
import Interview from "@/components/specific/Interview";
import {
  adminInterviewColumns,
  adminInterviewRows,
} from "@/data/adminInterview";

export default function AdminInterviewPage() {
  return (
    <Sidebar>
      <Interview
        title="List of Interviews"
        stats={[]}
        columns={adminInterviewColumns}
        rows={adminInterviewRows}
      />
    </Sidebar>
  );
}
