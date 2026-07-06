"use client";

import type { TeamBuilderRow } from "@/types/teamBuilder";
import {
  Briefcase,
  Calendar,
  Check,
  DollarSign,
  FolderOpen,
  MapPin,
  Star,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConsultantProfileModalProps {
  open: boolean;
  consultant: TeamBuilderRow | null;
  isSelected: boolean;
  onClose: () => void;
  onAddToSelection: () => void;
  showAddButton?: boolean;
}

const parseModuleList = (value?: string): string[] => {
  if (!value || value === "N/A") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getModuleTags = (consultant: TeamBuilderRow): string[] => {
  const tags = [
    ...parseModuleList(consultant.coremodules),
    ...parseModuleList(consultant.othersmodules),
  ];
  return [...new Set(tags)];
};

const buildSummary = (consultant: TeamBuilderRow): string => {
  const name = consultant.name?.trim() || `Consultant #${consultant.id}`;
  const years = consultant.experienceYears;
  const modules = getModuleTags(consultant);
  const moduleText =
    modules.length > 0 ? modules.join(", ") : "SAP consulting";
  const location = consultant.country || "their region";
  const availability = consultant.avail ?? 0;

  if (years && years > 0) {
    return `${name} is an SAP consultant with ${years} years of experience, specializing in ${moduleText}. Based in ${location} with ${availability} hours of weekly availability.`;
  }

  return `${name} is an SAP consultant specializing in ${moduleText}. Based in ${location} with ${availability} hours of weekly availability.`;
};

const buildSubtitle = (consultant: TeamBuilderRow): string => {
  const modules = getModuleTags(consultant);
  if (modules.length > 0) {
    return `SAP ${modules[0]} Consultant`;
  }
  return "SAP Consultant";
};

export default function ConsultantProfileModal({
  open,
  consultant,
  isSelected,
  onClose,
  onAddToSelection,
  showAddButton = true,
}: ConsultantProfileModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !consultant) return null;

  const displayName = consultant.name?.trim() || `Consultant #${consultant.id}`;
  const moduleTags = getModuleTags(consultant);
  const badges = consultant.badges ?? [];
  const hasVerified = badges.some((b) => b.toUpperCase() === "VERIFIED");
  const hasCertified = badges.some((b) => b.toUpperCase() === "CERTIFIED");
  const experienceLabel =
    consultant.experienceYears != null && consultant.experienceYears > 0
      ? `${consultant.experienceYears} years`
      : consultant.experience !== "N/A"
      ? consultant.experience
      : "N/A";

  const modal = (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close consultant profile"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white font-manrope shadow-2xl">
        <div className="bg-brand-blue px-6 pb-6 pt-5 text-white">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
              Consultant Profile
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-xl font-bold">
              {String(consultant.id).slice(-2)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-2xl font-bold">{displayName}</h2>
              <p className="mt-1 text-sm text-white/80">{buildSubtitle(consultant)}</p>
              {(hasVerified || hasCertified) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {hasVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                      <Check className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                  {hasCertified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                      <Star className="h-3.5 w-3.5" />
                      SAP Certified
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <section className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-slate-900" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700">
                Professional Summary
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {buildSummary(consultant)}
            </p>
          </section>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatCard
              icon={<DollarSign className="h-4 w-4" />}
              label="Hourly Rate"
              value={`$${consultant.rateValue ?? 0} / hr`}
            />
            <StatCard
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={consultant.country || "N/A"}
            />
            <StatCard
              icon={<Calendar className="h-4 w-4" />}
              label="Availability"
              value={`${consultant.avail ?? 0} hrs/wk`}
            />
            <StatCard
              icon={<FolderOpen className="h-4 w-4" />}
              label="Projects"
              value={consultant.projectName || "N/A"}
            />
          </div>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-700" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700">
                Professional Information
              </h3>
            </div>

            <div className="mb-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F5E9] text-success">
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Work Experience
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {experienceLabel}
              </span>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold text-slate-500">Core Modules</p>
              {moduleTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {moduleTags.map((module) => (
                    <span
                      key={module}
                      className="rounded-lg bg-[#E3F2FD] px-3 py-1 text-xs font-semibold text-brand-blue"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-slate-400">N/A</span>
              )}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
          {showAddButton && (
            <button
              type="button"
              onClick={onAddToSelection}
              disabled={isSelected}
              className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSelected ? "Already Selected" : "Add to Selection"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-brand-yellow px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue text-white">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="truncate text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
