"use client";

import { useState, useEffect } from "react";
import {
  useCreateModule,
  useUpdateModule,
} from "@/actions/admin/useModules";

import ModuleTreeSelect from "./ModuleTreeSelect";

export default function ModuleForm({ editData }: any) {
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();

  const [form, setForm] = useState({
    name: "",
    parent_id: null as number | null,
  });

  
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        parent_id: editData.parent_id,
      });
    }
  }, [editData]);

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Name required");

    const payload = {
      ...form,
      is_core: false, // ✅ force false
    };

    if (editData) {
      updateModule.mutate(
        {
          id: editData.id,
          data: payload,
        },
        {
          onSuccess: resetForm,
        }
      );
    } else {
      createModule.mutate(payload, {
        onSuccess: resetForm,
      });
    }
  };

  const resetForm = () => {
    alert("Saved successfully ✅");

    setForm({
      name: "",
      parent_id: null,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5 max-w-xl">
      
      {/* TITLE */}
      <h2 className="text-xl font-semibold text-gray-800">
        {editData ? "Edit Module" : "Create Module"}
      </h2>

      {/* MODULE NAME */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">
          Module Name
        </label>

        <input
          className="w-full border border-gray-300 px-3 py-2 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition"
          placeholder="Enter module name..."
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      {/* PARENT MODULE */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">
          Parent Module
        </label>

        <ModuleTreeSelect
          value={form.parent_id}
          onChange={(id: number | null) =>
            setForm({ ...form, parent_id: id })
          }
        />
      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] 
        text-white font-medium py-2.5 rounded-lg shadow-sm transition"
      >
        {editData ? "Update Module" : "Create Module"}
      </button>
    </div>
  );
}