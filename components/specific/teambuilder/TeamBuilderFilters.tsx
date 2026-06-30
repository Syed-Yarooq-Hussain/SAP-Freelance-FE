"use client";

import { useSapOtherModules } from "@/actions/common/useSapModules";
import SapModulesDropdown from "@/components/profile/profile-edit/SapModulesDropdown";
import { countries } from "@/utils/common";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Check, ChevronDown, Filter, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

interface TeamBuilderFiltersProps {
  open: boolean;
  onApply: (filters: Record<string, unknown>) => void;
}

const initialFilters = {
  experienceMin: "",
  experienceMax: "",
  availabilityMin: "",
  availabilityMax: "",
  budgetMin: "",
  budgetMax: "",
  country: "",
};

const inputClassName =
  "w-full rounded-input border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue/30";

export default function TeamBuilderFilters({
  open,
  onApply,
}: TeamBuilderFiltersProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [modulesModalOpen, setModulesModalOpen] = useState(false);
  const { data: sapOtherModulesData } = useSapOtherModules();
  const moduleDropdownData = sapOtherModulesData?.data || [];

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedModules.length > 0) count += 1;
    if (filters.experienceMin || filters.experienceMax) count += 1;
    if (filters.availabilityMin || filters.availabilityMax) count += 1;
    if (filters.budgetMin || filters.budgetMax) count += 1;
    if (filters.country) count += 1;
    return count;
  }, [filters, selectedModules]);

  const handleReset = () => {
    setFilters(initialFilters);
    setSelectedModules([]);
  };

  const handleApply = () => {
    onApply({
      experience: filters.experienceMin,
      experienceMax: filters.experienceMax,
      availability: filters.availabilityMin,
      availabilityMax: filters.availabilityMax,
      budgetMin: filters.budgetMin,
      budgetMax: filters.budgetMax,
      country: filters.country,
      modules: selectedModules,
    });
  };

  if (!open) return null;

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-background-main p-5 font-manrope">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-success">
            <Filter className="h-5 w-5 text-success" strokeWidth={2.25} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Filters</h3>
            <p className="text-sm text-slate-500">
              Refine your consultant search
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-500">
            {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"}{" "}
            active
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue-light"
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Apply Filters
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="md:col-span-2 xl:col-span-1">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-800">
            Core Modules
          </label>
          <button
            type="button"
            onClick={() => setModulesModalOpen(true)}
            className="flex w-full items-center justify-between rounded-input border border-slate-200 bg-white px-3 py-2.5 text-left text-sm transition-colors hover:border-brand-blue hover:bg-slate-50"
          >
            <span className="truncate text-slate-500">
              {selectedModules.length > 0
                ? `${selectedModules.length} selected`
                : "Select SAP modules..."}
            </span>
            <span className="ml-2 flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-blue">
              Open
              <ChevronDown className="h-4 w-4" />
            </span>
          </button>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-800">
            Experience
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.experienceMin}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  experienceMin: e.target.value,
                }))
              }
              className={inputClassName}
            />
            <span className="text-slate-400">—</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.experienceMax}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  experienceMax: e.target.value,
                }))
              }
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-800">
            Availability
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.availabilityMin}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  availabilityMin: e.target.value,
                }))
              }
              className={inputClassName}
            />
            <span className="text-slate-400">—</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.availabilityMax}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  availabilityMax: e.target.value,
                }))
              }
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-800">
            Budget
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="$ Min"
              value={filters.budgetMin}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, budgetMin: e.target.value }))
              }
              className={inputClassName}
            />
            <span className="text-slate-400">—</span>
            <input
              type="number"
              min={0}
              placeholder="$ Max"
              value={filters.budgetMax}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, budgetMax: e.target.value }))
              }
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-800">
            Country
          </label>
          <div className="relative">
            <select
              value={filters.country}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, country: e.target.value }))
              }
              className={`${inputClassName} appearance-none pr-9`}
            >
              <option value="">Select country</option>
              {countries.map((country: string) => (
                <option key={country} value={country.toLowerCase()}>
                  {country}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <Dialog
        open={modulesModalOpen}
        onClose={() => setModulesModalOpen(false)}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "14px",
            overflow: "visible",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            pb: 1,
          }}
        >
          Select Core Modules
        </DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <SapModulesDropdown
            data={moduleDropdownData}
            values={selectedModules}
            onChange={setSelectedModules}
            panelZIndex={1600}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              onClick={() => setModulesModalOpen(false)}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                backgroundColor: "#4A7AB5",
              }}
            >
              Done
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
