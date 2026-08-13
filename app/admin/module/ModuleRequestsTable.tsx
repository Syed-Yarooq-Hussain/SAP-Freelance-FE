"use client";

import {
  useDecideModuleRequest,
  useModuleRequests,
} from "@/actions/modules/useModuleRequests";
import type { ModuleRequest } from "@/types/modules";
import { toast } from "sonner";

const statusLabel = (value: boolean | null) =>
  value === null ? "Pending" : value ? "Accepted" : "Rejected";

export default function ModuleRequestsTable() {
  const { data, isLoading, isError } = useModuleRequests();
  const decision = useDecideModuleRequest();
  const requests = Array.isArray(data?.data) ? data.data : [];

  const decide = (item: ModuleRequest, isAccepted: boolean) => {
    decision.mutate(
      { id: item.id, is_accepted: isAccepted },
      {
        onSuccess: () =>
          toast.success(`Module request ${isAccepted ? "accepted" : "rejected"}`),
        onError: (error) =>
          toast.error(error instanceof Error ? error.message : "Unable to update request"),
      },
    );
  };

  if (isLoading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading module requests...</div>;
  }

  if (isError) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">Unable to load module requests.</div>;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Requested Modules</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-background-main text-left text-slate-600">
              <th className="p-3 font-medium">Module Name</th>
              <th className="p-3 font-medium">Requested By</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length ? requests.map((item) => {
              const isUpdating = decision.isPending && decision.variables?.id === item.id;
              return (
                <tr key={item.id} className="border-t border-slate-100 hover:bg-background-main">
                  <td className="p-3 font-medium text-slate-800">{item.name}</td>
                  <td className="p-3 text-slate-600">
                    <div>{item.user?.username || `User #${item.user_id}`}</div>
                    {item.user?.email ? <div className="text-xs text-slate-400">{item.user.email}</div> : null}
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.is_accepted === null
                        ? "bg-amber-50 text-amber-700"
                        : item.is_accepted
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                    }`}>
                      {statusLabel(item.is_accepted)}
                    </span>
                  </td>
                  <td className="space-x-2 p-3 text-right">
                    {item.is_accepted === null ? (
                      <>
                        <button
                          type="button"
                          disabled={decision.isPending}
                          onClick={() => decide(item, true)}
                          className="rounded-lg bg-green-50 px-3 py-1.5 font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                        >
                          {isUpdating ? "Saving..." : "Accept"}
                        </button>
                        <button
                          type="button"
                          disabled={decision.isPending}
                          onClick={() => decide(item, false)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Decision recorded</span>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">No module requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
