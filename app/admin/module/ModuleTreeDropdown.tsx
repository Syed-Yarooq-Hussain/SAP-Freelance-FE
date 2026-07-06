"use client";

import { useModuleTree } from "@/actions/admin/useModules";
import { useEffect, useRef, useState } from "react";

export default function PatternTreeDropdown() {
  const { data  }: any = useModuleTree();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // close outside
  useEffect(() => {
    const handler = (e: any) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const getName = (id: number, nodes: any[]): string => {
    for (const n of nodes) {
      if (n.id === id) return n.name;
      if (n.children) {
        const found = getName(id, n.children);
        if (found) return found;
      }
    }
    return "";
  };

  const renderTree = (nodes: any[], level = 0) => {
    return nodes.map((node) => {
      const isExpanded = expanded.includes(node.id);
      const isSelected = selected.includes(node.id);
      const hasChildren = node.children?.length > 0;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition
              ${isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}
            `}
            style={{
              paddingLeft: 12 + level * 20,
            }}
          >
            {/* Expand Icon */}
            <div className="w-4 flex justify-center">
              {hasChildren && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(node.id);
                  }}
                  className="text-gray-500 text-xs cursor-pointer"
                >
                  {isExpanded ? "▼" : "▶"}
                </span>
              )}
            </div>

            {/* Label */}
            <div
              onClick={() => toggleSelect(node.id)}
              className="flex-1 text-sm cursor-pointer"
            >
              {node.name}
            </div>

            {/* Selected Dot */}
            {isSelected && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </div>

          {/* Children */}
          {hasChildren && isExpanded && (
            <div className="ml-1">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* INPUT */}
      <div
        onClick={() => setOpen(!open)}
        className="border rounded-lg px-3 py-2 min-h-[44px] bg-white cursor-pointer flex flex-wrap gap-2 items-center shadow-sm"
      >
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm">
            Select modules...
          </span>
        )}

        {data?.data &&
          selected.map((id) => (
            <span
              key={id}
              className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1"
            >
              {getName(id, data.data)}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelect(id);
                }}
                className="cursor-pointer"
              >
                ✕
              </span>
            </span>
          ))}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-xl max-h-80 overflow-auto py-2">
          {data?.data ? (
            renderTree(data.data)
          ) : (
            <div className="p-3 text-gray-500">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}
