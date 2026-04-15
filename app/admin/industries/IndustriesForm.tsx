"use client";

import { useState, useEffect } from "react";
import {
  useCreateIndustry,
  useUpdateIndustry,
} from "@/actions/admin/useIndustries";

export default function IndustriesForm({ editData, onCancel }: any) {
  const createIndustry = useCreateIndustry();
  const updateIndustry = useUpdateIndustry();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        description: editData.description || "",
      });
    } else {
      setForm({
        name: "",
        description: "",
      });
    }
  }, [editData]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Industry name is required");
      return;
    }

    setLoading(true);

    try {
      if (editData) {
        await updateIndustry.mutateAsync({
          id: editData.id,
          data: form,
        });
        alert("Industry updated successfully ✅");
      } else {
        await createIndustry.mutateAsync(form);
        alert("Industry created successfully ✅");
      }

      resetForm();
      onCancel?.();
    } catch (error: any) {
      alert(error.message || "Error saving industry");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5 max-w-2xl">
      {/* TITLE */}
      <h2 className="text-xl font-semibold text-gray-800">
        {editData ? "✏️ Edit Industry" : "➕ Create Industry"}
      </h2>

      {/* INDUSTRY NAME */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Industry Name <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition"
          placeholder="e.g., Information Technology, Healthcare, Finance"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          className="w-full border border-gray-300 px-3 py-2 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition resize-none"
          placeholder="Enter industry description (optional)"
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSubmit}
          disabled={loading || createIndustry.isPending || updateIndustry.isPending}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg 
          hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : editData ? "Update Industry" : "Create Industry"}
        </button>

        <button
          onClick={() => {
            resetForm();
            onCancel?.();
          }}
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg 
          hover:bg-gray-300 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {(createIndustry.isError || updateIndustry.isError) && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {createIndustry.error?.message || updateIndustry.error?.message}
        </div>
      )}
    </div>
  );
}
