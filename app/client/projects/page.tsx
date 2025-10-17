"use client";

import Sidebar from "@/components/Sidebar";
import Project from "@/components/specific/Project";
import {
  clientProjectColumns,
  clientProjectRows,
  clientProjectStats,
} from "@/data/clientProject";

export default function ClientProjectPage() {
  return (
    <Sidebar>
      <Project
        title=""
        stats={clientProjectStats}
        columns={clientProjectColumns}
        rows={clientProjectRows}
      />
    </Sidebar>
  );
}
