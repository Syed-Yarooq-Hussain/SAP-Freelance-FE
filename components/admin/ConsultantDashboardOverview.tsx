"use client";

import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { BadgeCheck, Clock3, Globe2, Layers3, GraduationCap, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import type { ConsultantDashboardSummaryData } from "@/types/adminDashboard";

interface Props {
  data?: ConsultantDashboardSummaryData | null;
  loading?: boolean;
  pendingApprovals?: number;
}

type Breakdown = { label: string; value: number };
const palette = ["#005C8A", "#268AA8", "#64B3B1", "#879DC6", "#A9BED3"];
const numberLabel = (value?: number) => value == null || !Number.isFinite(value) ? "—" : value.toLocaleString(undefined, { maximumFractionDigits: 1 });

function InsightCard({ title, description, icon, children }: { title: string; description: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid #E2E8F0", borderRadius: 3, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75, color: "#005C8A" }}>{icon}<Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{title}</Typography></Box>
      <Typography sx={{ fontSize: 12, color: "#64748B", mb: 3 }}>{description}</Typography>
      {children}
    </Paper>
  );
}

function BreakdownBars({ items, loading, empty, color = "#005C8A" }: { items: Breakdown[]; loading?: boolean; empty: string; color?: string }) {
  const valid = items.filter((item) => Number.isFinite(item.value) && item.value >= 0);
  const maximum = Math.max(1, ...valid.map((item) => item.value));
  if (loading) return <Box>{[0, 1, 2].map((key) => <Skeleton key={key} height={48} />)}</Box>;
  if (!valid.length) return <Typography sx={{ color: "#94A3B8", py: 4, textAlign: "center", fontSize: 13 }}>{empty}</Typography>;
  return <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, maxHeight: 280, overflowY: "auto", pr: 0.5 }}>
    {valid.map((item, index) => <Box component="li" key={`${item.label}-${index}`} sx={{ mb: 2.25, "&:last-child": { mb: 0 } }}>
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2, mb: 0.75 }}>
        <Typography sx={{ fontSize: 12, color: "#475569", overflowWrap: "anywhere" }}>{item.label}</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#334155", fontVariantNumeric: "tabular-nums" }}>{numberLabel(item.value)}</Typography>
      </Box>
      <Box aria-hidden="true" sx={{ height: 6, borderRadius: 4, bgcolor: "#F1F5F9", overflow: "hidden" }}><Box sx={{ height: "100%", width: `${item.value / maximum * 100}%`, bgcolor: color, borderRadius: 4 }} /></Box>
    </Box>)}
  </Box>;
}

export default function ConsultantDashboardOverview({ data, loading, pendingApprovals }: Props) {
  const overview = data?.overview;
  const rate = data?.avg_hourly_rate ?? overview?.avg_hourly_rate;
  const availability = data?.avg_weekly_availability_hours ?? overview?.avg_weekly_availability_hours;
  const modules = data?.modules?.length ? data.modules.map((item) => ({ label: item.name, value: item.count })) : data?.modules_breakdown ?? [];
  const countries = data?.countries?.length ? data.countries.map((item) => ({ label: item.name, value: item.count })) : data?.countries_breakdown ?? [];
  const experience = data?.experience_levels?.length ? data.experience_levels : data?.experience_level_breakdown ?? [];
  const statuses = data?.profile_status?.length ? data.profile_status : data?.profile_status_breakdown ?? [];
  const statusValue = (name: string) => statuses.find((item) => item.label.toLowerCase() === name)?.value;
  const profileMetrics = [
    { label: "Verified", value: data?.verified_profiles ?? overview?.verified_profiles ?? overview?.total_verified ?? statusValue("verified"), color: "#087F72", bg: "#EAF7F3" },
    { label: "Certified", value: data?.certified_profiles ?? overview?.certified_profiles ?? overview?.total_certified ?? statusValue("certified"), color: "#005C8A", bg: "#EAF4FA" },
    { label: "Pending review", value: pendingApprovals ?? data?.pending_profiles ?? overview?.pending_profiles ?? statusValue("pending"), color: "#B7791F", bg: "#FFF7E8" },
  ];
  const otherStatuses = statuses.filter((item) => !["verified", "certified", "pending", "pending review"].includes(item.label.toLowerCase()));
  const experienceTotal = experience.reduce((sum, item) => sum + Math.max(0, item.value), 0);

  return <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Paper elevation={0} sx={{ px: { xs: 2, sm: 2.5 }, py: 2.5, border: "1px solid #E2E8F0", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 3, flexWrap: "wrap" }}>
      <Box><Typography sx={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Consultant insights</Typography><Typography sx={{ fontSize: 12, mt: 0.5, color: "#64748B" }}>Skills, capacity and profile quality across your network.</Typography></Box>
      <Box sx={{ display: "flex", gap: { xs: 3, sm: 5 }, flexWrap: "wrap" }}>
        {[{ label: "Average hourly rate", value: rate == null ? "—" : `$${numberLabel(rate)}`, icon: <Wallet size={15} /> }, { label: "Weekly availability", value: availability == null ? "—" : `${numberLabel(availability)} hrs`, icon: <Clock3 size={15} /> }].map((metric) => <Box key={metric.label}>
          <Box sx={{ display: "flex", gap: 0.75, alignItems: "center", color: "#64748B" }}>{metric.icon}<Typography sx={{ fontSize: 11 }}>{metric.label}</Typography></Box>
          {loading ? <Skeleton width={80} /> : <Typography sx={{ mt: 0.75, fontSize: 20, fontWeight: 700, color: "#0F172A" }}>{metric.value}</Typography>}
        </Box>)}
      </Box>
    </Paper>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
      <InsightCard title="Module expertise" description="Consultants by SAP module. A consultant may cover multiple modules." icon={<Layers3 size={17} />}>
        <BreakdownBars items={[...modules].sort((a, b) => b.value - a.value)} loading={loading} empty="No module data available." />
      </InsightCard>
      <InsightCard title="Experience mix" description="The experience levels represented in your consultant network." icon={<GraduationCap size={17} />}>
        {!loading && experienceTotal > 0 && <Box aria-hidden="true" sx={{ display: "flex", gap: 0.5, height: 12, borderRadius: 3, overflow: "hidden", mb: 3 }}>{experience.map((item, index) => <Box key={`${item.label}-${index}`} sx={{ width: `${Math.max(0, item.value) / experienceTotal * 100}%`, bgcolor: palette[index % palette.length] }} />)}</Box>}
        <BreakdownBars items={experience} loading={loading} color="#268AA8" empty="No experience data available." />
      </InsightCard>
      <InsightCard title="Locations" description="Where your consultant network is based." icon={<Globe2 size={17} />}>
        <BreakdownBars items={[...countries].sort((a, b) => b.value - a.value)} loading={loading} color="#6386B1" empty="No location data available." />
      </InsightCard>
      <InsightCard title="Profile quality" description="Verification and certification are independent profile attributes." icon={<BadgeCheck size={17} />}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {profileMetrics.map((metric) => <Box key={metric.label} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5, bgcolor: metric.bg, borderRadius: 2 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: metric.color }}>{metric.label}</Typography>
            {loading ? <Skeleton width={35} /> : <Typography sx={{ fontSize: 18, fontWeight: 700, color: metric.color }}>{numberLabel(metric.value)}</Typography>}
          </Box>)}
          {otherStatuses.map((item, index) => <Box key={`${item.label}-${index}`} sx={{ display: "flex", justifyContent: "space-between", px: 1.5, color: "#64748B" }}><Typography sx={{ fontSize: 12 }}>{item.label}</Typography><Typography sx={{ fontSize: 12 }}>{numberLabel(item.value)}</Typography></Box>)}
        </Box>
      </InsightCard>
    </Box>
  </Box>;
}
