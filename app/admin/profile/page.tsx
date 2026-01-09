"use client";

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
      <Suspense fallback={<div>Loading profile...</div>}>
        <ProfilePageContent />
      </Suspense>
    </Sidebar>
  );
}
