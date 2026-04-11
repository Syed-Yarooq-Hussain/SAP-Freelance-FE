"use client";

import { useModuleTree } from "@/actions/admin/useModules";
import { useEffect, useRef, useState } from "react";

export default function ModuleTreeDropdownPro() {
  const { data } :any= useModuleTree();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // close outside
  useEffect(() => {
    const handler = (e: any) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id: number) => {
    setSelected((prev) =>
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
      const isSelected = selected.includes(node.id);

      return (
        <div key={node.id}>
          <div
            onClick={() => toggle(node.id)}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all
              ${
                isSelected
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }
            `}
            style={{
              paddingLeft: 12 + level * 18,
            }}
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-2">
              {/* Dot / icon */}
              <div
                className={`w-2 h-2 rounded-full transition
                  ${
                    isSelected
                      ? "bg-blue-600"
                      : "bg-gray-300 group-hover:bg-gray-400"
                  }
                `}
              />

              <span className="text-sm font-medium">
                {node.name}
              </span>
            </div>

            {/* RIGHT SIDE indicator */}
            {isSelected && (
              <span className="text-xs text-blue-600 font-semibold">
                ✓
              </span>
            )}
          </div>

          {node.children?.length > 0 &&
            renderTree(node.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* INPUT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-300 rounded-xl px-3 py-2 min-h-[48px] bg-white cursor-pointer flex flex-wrap gap-2 items-center shadow-sm hover:border-gray-400 transition"
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
              className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
            >
              {getName(id, data.data)}

              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(id);
                }}
                className="cursor-pointer text-white/80 hover:text-white"
              >
                ✕
              </span>
            </span>
          ))}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-auto p-2">
          {data?.data ? (
            <div className="space-y-1">
              {renderTree(data.data)}
            </div>
          ) : (
            <div className="p-3 text-gray-500 text-sm">
              Loading modules...
            </div>
          )}
        </div>
      )}
    </div>
  );
}