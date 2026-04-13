"use client";

import { useModules, useDeleteModule } from "@/actions/admin/useModules";

export default function ModuleTable({ onEdit }: any) {
  const { data, isLoading } = useModules();
  const deleteModule = useDeleteModule();

  if (isLoading) return <p className="p-4">Loading modules...</p>;

  // 🔥 build tree from flat data
  const buildTree = (modules: any[]) => {
    const map: any = {};
    const roots: any[] = [];

    modules.forEach((m) => {
      map[m.id] = { ...m, children: [] };
    });

    modules.forEach((m) => {
      if (m.parent_id) {
        map[m.parent_id]?.children.push(map[m.id]);
      } else {
        roots.push(map[m.id]);
      }
    });

    return roots;
  };

  const treeData = buildTree(data?.data || []);

  // 🔥 recursive render
  const renderRows: any = (nodes: any[], level = 0) => {
    return nodes.map((node) => (
      <>
      
        <tr
          key={node.id}
          className="border-t hover:bg-gray-50 transition"
        >
          {/* NAME + TREE */}
          <td className="p-3">
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: level * 20 }}
            >
              {/* ICON */}
              <span className="text-gray-500">
                {node.children.length > 0 ? "🪪": "🪪"}
              </span>

              <span className="font-medium text-gray-800">
                {node.name}
              </span>
            </div>
          </td>

          {/* ACTIONS */}
          <td className="p-3 text-right space-x-2">
            <button
              onClick={() => onEdit(node)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm 
              bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
            >
              ✏️ Edit
            </button>

            <button
              onClick={() => deleteModule.mutate(node.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm 
              bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
            >
              🗑 Delete
            </button>
          </td>
        </tr>

        {/* CHILDREN */}
        {node.children.length > 0 &&
          renderRows(node.children, level + 1)}
      </>
    ));
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Modules
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="p-3 font-medium">Module Name</th>
              <th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {treeData.length > 0 ? (
              renderRows(treeData)
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="text-center p-5 text-gray-400"
                >
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