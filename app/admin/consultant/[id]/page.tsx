"use client";

import Sidebar from "@/components/Sidebar";
import AdminConsultantProfileView from "@/components/admin/AdminConsultantProfileView";
import { fetchAdminConsultantDetail } from "@/services/admin/consultants";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminConsultantProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params.id);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const cached = sessionStorage.getItem(`admin-consultant-profile:${id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (active) setProfile(parsed);
        }

        const response = await fetchAdminConsultantDetail(id);
        const responseData = response.data as any;
        const detail =
          responseData?.data ??
          responseData?.profile ??
          responseData;
        if (active && detail) setProfile(detail);
      } catch (cause) {
        if (active && !profile) setError(cause instanceof Error ? cause.message : "Unable to load consultant profile");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
    // Profile is intentionally loaded once for the route id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Sidebar>
      <div className="min-h-screen rounded-xl bg-background-main p-4 md:p-6">
        <button type="button" onClick={() => router.back()} className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4" /> Back to Consultants
        </button>
        {loading && !profile ? <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500">Loading full profile...</div> : null}
        {error && !profile ? <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">{error}</div> : null}
        {profile ? <AdminConsultantProfileView profile={profile} /> : null}
      </div>
    </Sidebar>
  );
}
