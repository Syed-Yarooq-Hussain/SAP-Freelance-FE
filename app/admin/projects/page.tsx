"use client";

import Sidebar from "@/components/Sidebar";
import Project from "@/components/specific/Project";
import {
  adminProjectColumns,
  adminProjectRows,
} from "@/data/adminProject";

export default function AdminProjectPage() {
  return (
    <Sidebar>
      <Project
        title="Created Projects"
        stats={[]}
        columns={adminProjectColumns}
        rows={adminProjectRows}
      />
    </Sidebar>
  );
}
