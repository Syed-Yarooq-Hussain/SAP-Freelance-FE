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
    <div className="min-h-screen rounded-xl bg-slate-50 px-4 py-4 font-manrope md:px-5 md:py-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-neue text-2xl text-slate-900 md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-light-grey">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
