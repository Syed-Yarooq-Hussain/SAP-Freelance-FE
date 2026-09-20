"use client";

import { useAdminStats } from "@/actions/admin/useAdminStats";
import { useConsultantDashboardSummary } from "@/actions/admin/useConsultantDashboardSummary";
import AdminPageShell from "@/components/admin/AdminPageShell";
import ConsultantDashboardOverview from "@/components/admin/ConsultantDashboardOverview";
import Sidebar from "@/components/Sidebar";
import { APP_ROUTES } from "@/utils/app_routes";
import { Alert, Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Users, Building2, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const statsQuery = useAdminStats();
  const summaryQuery = useConsultantDashboardSummary();
  const stats = statsQuery.data?.data;
  const count = (value?: number) => value == null ? "—" : value.toLocaleString();
  const cards = [
    { title: "Consultants", value: stats?.total_consultants, detail: `${count(stats?.active_consultants)} active`, icon: Users, color: "#005C8A", bg: "#EAF4FA", href: APP_ROUTES.ADMIN.CONSULTANTS },
    { title: "Clients", value: stats?.total_clients, detail: `${count(stats?.active_clients)} active`, icon: Building2, color: "#6366A4", bg: "#F0EFFB", href: APP_ROUTES.ADMIN.CLIENT },
    { title: "Active projects", value: stats?.active_projects, detail: `${count(stats?.upcoming_projects)} upcoming`, icon: BriefcaseBusiness, color: "#087F72", bg: "#EAF7F3", href: APP_ROUTES.ADMIN.PROJECTS },
    { title: "Interviews", value: stats?.interview_this_week, detail: "Scheduled this week", icon: CalendarDays, color: "#B7791F", bg: "#FFF7E8", href: APP_ROUTES.ADMIN.INTERVIEWS },
  ];
  const refreshing = statsQuery.isFetching || summaryQuery.isFetching;

  return (
    <Sidebar>
      <AdminPageShell title="Admin Dashboard" description="A clear view of your people, projects and consultant network."
        actions={<Button onClick={() => { void statsQuery.refetch(); void summaryQuery.refetch(); }} disabled={refreshing} startIcon={<RefreshCw size={15} />} sx={{ textTransform: "none", color: "#475569", border: "1px solid #E2E8F0", borderRadius: 2, px: 2 }}>Refresh overview</Button>}>
        {statsQuery.isError && <Alert severity="error">{statsQuery.error.message || "Platform statistics could not be loaded."}</Alert>}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2 }}>
          {cards.map(({ title, value, detail, icon: Icon, color, bg, href }) => (
            <Paper key={title} component={Link} href={href} elevation={0}
              sx={{ p: 2.5, borderRadius: 3, border: "1px solid #E2E8F0", textDecoration: "none", color: "inherit", transition: "border-color 150ms, box-shadow 150ms", "&:hover": { borderColor: color, boxShadow: "0 4px 18px #0F172A08" }, "&:focus-visible": { outline: `2px solid ${color}`, outlineOffset: 3 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box sx={{ p: 1, display: "flex", bgcolor: bg, color, borderRadius: 2 }}><Icon size={18} /></Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>{title}</Typography>
                </Box>
                <ArrowUpRight size={16} color="#94A3B8" />
              </Box>
              {statsQuery.isLoading ? <Skeleton width={90} height={52} /> : <Typography sx={{ mt: 2, fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em", color: "#0F172A", lineHeight: 1.2 }}>{count(value)}</Typography>}
              {statsQuery.isLoading ? <Skeleton width={120} /> : <Typography sx={{ mt: 1, fontSize: 12, color: "#64748B" }}>{detail}</Typography>}
            </Paper>
          ))}
        </Box>
        {summaryQuery.isError && <Alert severity="error">{summaryQuery.error.message || "Consultant insights could not be loaded."}</Alert>}
        <ConsultantDashboardOverview data={summaryQuery.data?.data} loading={summaryQuery.isLoading} pendingApprovals={stats?.pending_consultant_approvals} />
      </AdminPageShell>
    </Sidebar>
  );
}
