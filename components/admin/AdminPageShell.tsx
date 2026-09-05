"use client";

import type { ReactNode } from "react";

type AdminPageShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function AdminPageShell({
  title,
  description,
  children,
  actions,
}: AdminPageShellProps) {
  return (
    <div className="min-h-[calc(100vh-110px)] rounded-2xl bg-[#F4F5F8] font-manrope">
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue/70">
            Administration
          </p>
          <h1 className="font-neue text-2xl font-semibold text-slate-900 md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="space-y-4 [&>div]:rounded-2xl">{children}</div>
    </div>
  );
}
