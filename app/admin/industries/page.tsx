"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import IndustriesTable from "./IndustriesTable";
import IndustriesForm from "./IndustriesForm";

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
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Industries Management</h1>
          <p className="text-gray-500 mt-2">Manage SAP industry classifications</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab("list");
              setEditData(null);
            }}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "list"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            📋 List Industries
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "create"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {editData ? "✏️ Edit Industry" : "➕ Create Industry"}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "list" && (
            <IndustriesTable onEdit={handleEdit} />
          )}

          {activeTab === "create" && (
            <IndustriesForm editData={editData} onCancel={handleCancel} />
          )}
        </div>
      </div>
    </Sidebar>
  );
}
