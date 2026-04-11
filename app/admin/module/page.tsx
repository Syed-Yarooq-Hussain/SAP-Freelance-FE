"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import ModuleTable from "./ModuleTable";
import ModuleForm from "./ModuleForm";
import ModuleTreeDropdown from "./ModuleTreeDropdown";
import CascadeDropdown from "./CascadeDropdown";

type Tab = "list" | "create" | "dropdown" | "cascade";

export default function ModulePage() {
  const [activeTab, setActiveTab] = useState<Tab>("list");
  const [editData, setEditData] = useState<any>(null);

  return (
    <Sidebar>
      <div className="p-4">
        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button onClick={() => setActiveTab("list")}>List</button>
          <button onClick={() => setActiveTab("create")}>Create</button>
          <button onClick={() => setActiveTab("dropdown")}>Dropdown</button>
          <button onClick={() => setActiveTab("cascade")}>Dropdown option 2 </button>
        </div>

        {activeTab === "list" && (
          <ModuleTable
            onEdit={(data: any) => {
              setEditData(data);
              setActiveTab("create");
            }}
          />
        )}

        {activeTab === "create" && (
          <ModuleForm editData={editData} />
        )}
        {activeTab === "dropdown" && (
            <div className="p-4 bg-white rounded shadow">
                <h2 className="font-semibold mb-3">
                Tree Dropdown Multi Select
                </h2>

                <ModuleTreeDropdown />
            </div>
            )}
            {activeTab === "cascade" && (
                <div className="p-4 bg-white rounded shadow">
                    <h2 className="font-semibold mb-3">
                    Cascade Menu (XP Style)
                    </h2>

                    <CascadeDropdown />
                </div>
                )}
      </div>
      
    </Sidebar>
  );
}