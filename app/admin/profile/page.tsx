"use client";

import AdminPageShell from "@/components/admin/AdminPageShell";
import Sidebar from "@/components/Sidebar";
import Profile from "@/components/specific/ConsultantProfile";
import { APP_ROUTES } from "@/utils/app_routes";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const modeParam = searchParams.get("mode");
  const mode: "view" | "edit" = modeParam === "edit" ? "edit" : "view";

  const setMode = (nextMode: "view" | "edit") => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextMode === "view") {
      params.delete("mode");
    } else {
      params.set("mode", "edit");
    }

    const qs = params.toString();
    const base = APP_ROUTES.ADMIN.PROFILE;
    const url = qs ? `${base}?${qs}` : base;

    router.push(url);
  };

  return (
    <Profile
      mode={mode}
      onRequestEdit={() => setMode("edit")}
      onRequestView={() => setMode("view")}
    />
  );
}

export default function AdminProfilePage() {
  return (
    <Sidebar>
      <AdminPageShell
        title="Admin Profile"
        description="View and manage the admin profile."
      >
        <Suspense
          fallback={
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              Loading profile...
            </div>
          }
        >
          <ProfilePageContent />
        </Suspense>
      </AdminPageShell>
    </Sidebar>
  );
}
