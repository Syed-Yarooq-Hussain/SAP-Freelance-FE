"use client";

import AdminPageShell from "@/components/admin/AdminPageShell";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import CascadeDropdown from "./CascadeDropdown";
import ModuleForm from "./ModuleForm";
import ModuleTable from "./ModuleTable";
import ModuleTreeDropdown from "./ModuleTreeDropdown";

type Tab = "list" | "create" | "dropdown" | "cascade";

const tabs: Array<{ key: Tab; label: string }> = [
  { key: "list", label: "Modules" },
  { key: "create", label: "Create Module" },
  { key: "dropdown", label: "Tree Dropdown" },
  { key: "cascade", label: "Cascade Menu" },
];

export default function ModulePage() {
  const [activeTab, setActiveTab] = useState<Tab>("list");
  const [editData, setEditData] = useState<any>(null);

  return (
    <Sidebar>
      <AdminPageShell
        title="Modules"
        description="Manage SAP module hierarchy and dropdown behavior."
      >
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key !== "create") setEditData(null);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-brand-blue text-white"
                    : "bg-background-main text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.key === "create" && editData ? "Edit Module" : tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "list" && (
          <ModuleTable
            onEdit={(data: any) => {
              setEditData(data);
              setActiveTab("create");
            }}
          />
        )}

        {activeTab === "create" && <ModuleForm editData={editData} />}

        {activeTab === "dropdown" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-base font-semibold text-slate-900">
              Tree Dropdown Multi Select
            </h2>
            <ModuleTreeDropdown />
          </div>
        )}

        {activeTab === "cascade" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-base font-semibold text-slate-900">
              Cascade Menu
            </h2>
            <CascadeDropdown />
          </div>
        )}
      </AdminPageShell>
    </Sidebar>
  );
}
