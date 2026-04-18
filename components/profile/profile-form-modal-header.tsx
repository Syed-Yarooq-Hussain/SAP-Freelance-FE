"use client";

import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ProfileFormModalHeaderProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClose: () => void;
};

export function ProfileFormModalHeader({
  icon: Icon,
  title,
  subtitle,
  onClose,
}: ProfileFormModalHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 font-manrope">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FB] text-slate-900">
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-snug text-light-grey">{subtitle}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-background-main text-slate-600 transition-colors hover:bg-slate-100"
        aria-label="Close dialog"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
