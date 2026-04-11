"use client";

import { useModuleTree } from "@/actions/admin/useModules";

export default function ModuleTreeSelect({ value, onChange }: any) {
  const { data, isLoading } = useModuleTree();

  if (isLoading) return <p>Loading tree...</p>;

  const renderTree = (nodes: any[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <div
          onClick={() => onChange(node.id)}
          className={`flex items-center gap-2 p-2 cursor-pointer rounded 
          ${value === node.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
          style={{ marginLeft: level * 16 }}
        >
          <span className="text-gray-400">
            {level > 0 ? "↳" : "•"}
          </span>

          <span>{node.name}</span>
        </div>

        {node.children?.length > 0 &&
          renderTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="border rounded-lg p-3 max-h-60 overflow-auto bg-white">
      <p className="text-sm font-semibold mb-2">Select Parent</p>

      <div
        onClick={() => onChange(null)}
        className={`p-2 cursor-pointer rounded ${
          value === null ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
      >
        No Parent
      </div>

      {data?.data && renderTree(data.data)}
    </div>
  );
}