"use client";

import {
  useCreateModule,
  useUpdateModule,
} from "@/actions/admin/useModules";
import { useEffect, useState } from "react";
import ModuleTreeSelect from "./ModuleTreeSelect";

export default function ModuleForm({ editData }: any) {
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();

  const [form, setForm] = useState({
    name: "",
    abbreviation: "",
    parent_id: null as number | null,
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name:
          editData.abbreviation &&
          editData.name.endsWith(` (${editData.abbreviation})`)
            ? editData.name.slice(0, -(` (${editData.abbreviation})`.length))
            : editData.name,
        abbreviation: editData.abbreviation ?? "",
        parent_id: editData.parent_id,
      });
    }
  }, [editData]);

  const resetForm = () => {
    alert("Saved successfully");
    setForm({
      name: "",
      abbreviation: "",
      parent_id: null,
    });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Name required");

    const payload = {
      name: form.name.trim(),
      abbreviation: form.abbreviation.trim() || null,
      parent_id: form.parent_id,
      is_core: false,
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

  return (
    <div className="max-w-xl space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">
        {editData ? "Edit Module" : "Create Module"}
      </h2>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Module Name
        </label>
        <input
          className="w-full rounded-xl border border-slate-300 bg-brand-yellow px-3 py-2 text-sm text-slate-900 transition focus:border-[#3088B7] focus:outline-none focus:ring-2 focus:ring-[#3088B7]"
          placeholder="Enter module name..."
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Abbreviation <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          className="w-full rounded-xl border border-slate-300 bg-brand-yellow px-3 py-2 text-sm text-slate-900 transition focus:border-[#3088B7] focus:outline-none focus:ring-2 focus:ring-[#3088B7]"
          placeholder="e.g. FI"
          value={form.abbreviation}
          onChange={(e) => setForm({ ...form, abbreviation: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Parent Module
        </label>
        <ModuleTreeSelect
          value={form.parent_id}
          onChange={(id: number | null) => setForm({ ...form, parent_id: id })}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full rounded-xl bg-brand-blue py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-brand-blue/30"
      >
        {editData ? "Update Module" : "Create Module"}
      </button>
    </div>
  );
}
