"use client";

import { useIndustries, useDeleteIndustry } from "@/actions/admin/useIndustries";

export default function IndustriesTable({ onEdit }: any) {
  const { data, isLoading } = useIndustries();
  const deleteIndustry = useDeleteIndustry();

  if (isLoading) return <p className="p-4">Loading industries...</p>;

  const industries = data?.data || [];

  return (
    <div className="bg-white shadow-md rounded-2xl p-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Industries Management
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
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
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* INDUSTRY NAME */}
                  <td className="p-3">
                    <span className="font-medium text-gray-800">
                      {industry.name}
                    </span>
                  </td>

                  {/* DESCRIPTION */}
                  <td className="p-3 text-gray-600">
                    {industry.description || "-"}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => onEdit(industry)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm 
                      bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                    >
                      ✏️ Edit
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm 
                      bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center p-5 text-gray-400"
                >
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
