"use client";

import {
  useDeleteIndustry,
  useIndustries,
} from "@/actions/admin/useIndustries";

export default function IndustriesTable({ onEdit }: any) {
  const { data, isLoading } = useIndustries();
  const deleteIndustry = useDeleteIndustry();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Loading industries...
      </div>
    );
  }

  const industries = data?.data || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Industries
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-background-main text-left text-slate-600">
              <th className="p-3 font-medium">Industry Name</th>
              <th className="p-3 font-medium">Description</th>
              <th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {industries.length > 0 ? (
              industries.map((industry: any) => (
                <tr
                  key={industry.id}
                  className="border-t border-slate-100 transition hover:bg-background-main"
                >
                  <td className="p-3">
                    <span className="font-medium text-slate-800">
                      {industry.name}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">
                    {industry.description || "-"}
                  </td>
                  <td className="space-x-2 p-3 text-right">
                    <button
                      onClick={() => onEdit(industry)}
                      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this industry?"
                          )
                        ) {
                          deleteIndustry.mutate(industry.id);
                        }
                      }}
                      disabled={deleteIndustry.isPending}
                      className="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-5 text-center text-slate-400">
                  No industries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
