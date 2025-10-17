"use client";

import Sidebar from "@/components/Sidebar";
import Project from "@/components/specific/Project";
import {
  consultantProjectColumns,
  consultantProjectRows,
  consultantProjectStats,
} from "@/data/consultantProject";

export default function ConsultantProjectPage() {
  return (
    <Sidebar>
      <Project
        title=""
        stats={consultantProjectStats}
        columns={consultantProjectColumns}
        rows={consultantProjectRows}
      />
    </Sidebar>
  );
}
