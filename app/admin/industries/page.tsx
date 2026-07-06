"use client";

import AdminPageShell from "@/components/admin/AdminPageShell";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import IndustriesForm from "./IndustriesForm";
import IndustriesTable from "./IndustriesTable";

type Tab = "list" | "create";

export default function IndustriesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("list");
  const [editData, setEditData] = useState<any>(null);

  const handleEdit = (data: any) => {
    setEditData(data);
    setActiveTab("create");
  };

  const handleCancel = () => {
    setEditData(null);
    setActiveTab("list");
  };

  return (
    <Sidebar>
      <AdminPageShell
        title="Industries"
        description="Manage SAP industry classifications."
      >
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveTab("list");
                setEditData(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "list"
                  ? "bg-brand-blue text-white"
                  : "bg-background-main text-slate-600 hover:bg-slate-100"
              }`}
            >
              List Industries
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "create"
                  ? "bg-brand-blue text-white"
                  : "bg-background-main text-slate-600 hover:bg-slate-100"
              }`}
            >
              {editData ? "Edit Industry" : "Create Industry"}
            </button>
          </div>
        </div>

        {activeTab === "list" && <IndustriesTable onEdit={handleEdit} />}
        {activeTab === "create" && (
          <IndustriesForm editData={editData} onCancel={handleCancel} />
        )}
      </AdminPageShell>
    </Sidebar>
  );
}
