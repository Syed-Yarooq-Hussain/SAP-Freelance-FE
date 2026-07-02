"use client";

import { SapModuleGroup } from "@/types/modules";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";

interface SapModulesDropdownProps {
  data: SapModuleGroup[];
  values: string[];
  onChange: (ids: string[]) => void;
  panelZIndex?: number;
  maxSelections?: number;
}

export default function SapModulesDropdown({
  data,
  values,
  onChange,
  panelZIndex = 300,
  maxSelections,
}: SapModulesDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [panelRect, setPanelRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 520,
  });

  const allModules = data.flatMap((g) => g.modules);
  const selectedSet = new Set(values);

  const updatePanelPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    const margin = 12;
    const spaceBelow = window.innerHeight - rect.bottom - gap - margin;
    const spaceAbove = rect.top - gap - margin;
    const preferredMax = 520;
    const maxHeight = Math.max(
      200,
      Math.min(preferredMax, Math.max(spaceBelow, spaceAbove))
    );
    const minPanel = window.innerWidth < 400 ? 0 : 260;
    const panelWidth = Math.min(
      window.innerWidth - 2 * margin,
      Math.max(rect.width, minPanel)
    );
    const maxLeft = window.innerWidth - panelWidth - margin;
    const left = Math.min(Math.max(margin, rect.left), Math.max(margin, maxLeft));
    setPanelRect({
      top: rect.bottom + gap,
      left,
      width: panelWidth,
      maxHeight,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [open, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const toggleModule = useCallback(
    (id: string, checked: boolean) => {
      const next = new Set(values);
      if (checked) next.add(id);
      else next.delete(id);
      const nextValues = [...next];
      onChange(nextValues);
      if (
        maxSelections &&
        checked &&
        nextValues.length === maxSelections
      ) {
        setOpen(false);
        setSearch("");
      }
    },
    [values, onChange, maxSelections]
  );

  const removeModule = (id: string) => {
    onChange(values.filter((v) => v !== id));
  };

  const allIds = allModules.map((m) => m.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedSet.has(id));

  const handleSelectAll = () => {
    onChange(allSelected ? [] : allIds);
  };

  const lowerSearch = search.toLowerCase().trim();
  const filteredGroups = data
    .map((group) => ({
      ...group,
      modules: group.modules.filter(
        (m) =>
          !lowerSearch ||
          m.name.toLowerCase().includes(lowerSearch) ||
          group.name.toLowerCase().includes(lowerSearch)
      ),
    }))
    .filter((g) => g.modules.length > 0);

  const dropdownPanel =
    open &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        ref={panelRef}
        className="fixed box-border max-w-[calc(100vw-24px)] rounded-lg border border-slate-200 bg-white p-3 font-manrope text-sm text-slate-800 shadow-lg sm:rounded-xl sm:p-4 sm:text-base"
        style={{
          top: panelRect.top,
          left: panelRect.left,
          width: panelRect.width,
          zIndex: panelZIndex,
        }}
      >
        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <h2 className="m-0 shrink-0 text-base font-semibold text-slate-800 sm:text-lg">
            SAP Modules
          </h2>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <div className="relative w-full min-w-0 sm:w-52 md:w-56">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Search modules..."
                className="h-9 w-full rounded-md border border-slate-200 bg-white py-0 pl-3 pr-9 text-xs text-slate-700 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 sm:h-10 sm:pl-3.5 sm:pr-10 sm:text-sm"
              />
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:text-sm">
                🔍
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAll();
              }}
              className="h-9 shrink-0 rounded-md border-2 border-brand-blue/35 bg-white px-3 text-xs font-semibold text-brand-blue transition-colors hover:bg-[#f5faff] sm:h-10 sm:px-4 sm:text-sm"
            >
              {allSelected ? "Clear All" : "Select All"}
            </button>
          </div>
        </div>

        <div
          className="overflow-y-auto pr-1"
          style={{
            maxHeight: panelRect.maxHeight,
          }}
        >
          {filteredGroups.length === 0 ? (
            <p className="px-1 py-4 text-xs text-slate-500 sm:text-sm">
              No modules found.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGroups.map((group) => (
                <div key={group.id} className="min-w-0">
                  <h3 className="mb-2 text-xs font-bold text-slate-600 sm:mb-2.5 sm:text-sm">
                    {group.name}
                  </h3>

                  {group.modules.map((mod) => {
                    const checked = selectedSet.has(mod.id);
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => toggleModule(mod.id, !checked)}
                        className={`mb-1.5 flex w-full cursor-pointer items-start gap-2 rounded-md border px-2.5 py-2 text-left text-xxs leading-snug transition sm:mb-2 sm:gap-2.5 sm:text-xs ${
                          checked
                            ? "border-brand-blue/45 bg-brand-blue/10 text-brand-blue"
                            : "border-slate-200 bg-white text-slate-600 hover:border-brand-blue/25 hover:bg-slate-50"
                        }`}
                      >
                        <span className="min-w-0 flex-1 break-words">{mod.name}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>,
      document.body
    );

  return (
    <div className="relative w-full font-manrope text-slate-800">
      <div
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[42px] cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-brand-yellow px-3 py-2 sm:min-h-[44px] sm:gap-3 sm:px-3.5 sm:py-2.5"
      >
        <div className="flex min-h-[26px] flex-1 flex-wrap items-center gap-1.5 sm:min-h-[28px]">
          {values.length === 0 ? (
            <span className="text-xs text-slate-500 sm:text-sm">
              Select SAP modules
            </span>
          ) : (
            values.map((id) => {
              const mod = allModules.find((m) => m.id === id);
              if (!mod) return null;
              return (
                <span
                  key={id}
                  className="inline-flex max-w-[min(100%,220px)] items-center gap-1.5 rounded-md bg-light-grey p-1.5 text-[11px] leading-none text-white sm:px-1 sm:py-0.5 sm:text-xs"
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {mod.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeModule(id);
                    }}
                    className="cursor-pointer border-0 bg-transparent p-0 text-xs leading-none text-white sm:text-base"
                  >
                    ×
                  </button>
                </span>
              );
            })
          )}
        </div>

        <span
          style={{
            width: 10,
            height: 10,
            borderRight: "2px solid #738391",
            borderBottom: "2px solid #738391",
            transform: open ? "rotate(-135deg)" : "rotate(45deg)",
            marginTop: open ? 4 : 0,
            marginRight: 4,
            flexShrink: 0,
            display: "inline-block",
            transition: "transform 0.2s ease",
          }}
        />
      </div>

      {dropdownPanel}
    </div>
  );
}