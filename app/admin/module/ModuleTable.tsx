"use client";

import { useDeleteModule, useModules } from "@/actions/admin/useModules";

export default function ModuleTable({ onEdit }: any) {
  const { data, isLoading } = useModules();
  const deleteModule = useDeleteModule();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Loading modules...
      </div>
    );
  }

  const buildTree = (modules: any[]) => {
    const map: any = {};
    const roots: any[] = [];

    modules.forEach((module) => {
      map[module.id] = { ...module, children: [] };
    });

    modules.forEach((module) => {
      if (module.parent_id) {
        map[module.parent_id]?.children.push(map[module.id]);
      } else {
        roots.push(map[module.id]);
      }
    });

    return roots;
  };

  const treeData = buildTree(data?.data || []);

  const renderRows: any = (nodes: any[], level = 0) => {
    return nodes.map((node) => (
      <>
        <tr
          key={node.id}
          className="border-t border-slate-100 transition hover:bg-background-main"
        >
          <td className="p-3">
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: level * 20 }}
            >
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="font-medium text-slate-800">{node.name}</span>
            </div>
          </td>
          <td className="p-3 text-slate-600">{node.abbreviation || "—"}</td>
          <td className="space-x-2 p-3 text-right">
            <button
              onClick={() => onEdit(node)}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              onClick={() => deleteModule.mutate(node.id)}
              className="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Delete
            </button>
          </td>
        </tr>
        {node.children.length > 0 && renderRows(node.children, level + 1)}
      </>
    ));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Modules</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-background-main text-left text-slate-600">
              <th className="p-3 font-medium">Module Name</th>
              <th className="p-3 font-medium">Abbreviation</th>
              <th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {treeData.length > 0 ? (
              renderRows(treeData)
            ) : (
              <tr>
                <td colSpan={3} className="p-5 text-center text-slate-400">
                  No modules found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
