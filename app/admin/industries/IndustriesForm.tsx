"use client";

import {
  useCreateIndustry,
  useUpdateIndustry,
} from "@/actions/admin/useIndustries";
import { useEffect, useState } from "react";

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

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });
  };

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
        alert("Industry updated successfully");
      } else {
        await createIndustry.mutateAsync(form);
        alert("Industry created successfully");
      }

      resetForm();
      onCancel?.();
    } catch (error: any) {
      alert(error.message || "Error saving industry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">
        {editData ? "Edit Industry" : "Create Industry"}
      </h2>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Industry Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full rounded-xl border border-slate-300 bg-brand-yellow px-3 py-2 text-sm text-slate-900 transition focus:border-[#3088B7] focus:outline-none focus:ring-2 focus:ring-[#3088B7]"
          placeholder="e.g. Information Technology, Healthcare, Finance"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          className="w-full resize-none rounded-xl border border-slate-300 bg-brand-yellow px-3 py-2 text-sm text-slate-900 transition focus:border-[#3088B7] focus:outline-none focus:ring-2 focus:ring-[#3088B7]"
          placeholder="Enter industry description (optional)"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          onClick={handleSubmit}
          disabled={
            loading || createIndustry.isPending || updateIndustry.isPending
          }
          className="flex-1 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-brand-blue/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : editData ? "Update Industry" : "Create Industry"}
        </button>
        <button
          onClick={() => {
            resetForm();
            onCancel?.();
          }}
          disabled={loading}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      {(createIndustry.isError || updateIndustry.isError) && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {createIndustry.error?.message || updateIndustry.error?.message}
        </div>
      )}
    </div>
  );
}
