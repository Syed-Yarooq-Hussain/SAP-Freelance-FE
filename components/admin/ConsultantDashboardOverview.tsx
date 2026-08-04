"use client";

import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import type { ConsultantDashboardSummaryData } from "@/types/adminDashboard";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ConsultantDashboardOverviewProps {
  data?: ConsultantDashboardSummaryData | null;
}

const defaultData: ConsultantDashboardSummaryData = {
  overview: {
    total_resources: 128,
    avg_hourly_rate: 72.5,
    avg_weekly_availability_hours: 38.2,
    verified_profiles: 95,
    certified_profiles: 64,
    pending_profiles: 12,
    total_verified: 95,
    total_certified: 64,
  },
  modules: [
    { name: "SAP S/4HANA", count: 41 },
    { name: "SAP FICO", count: 32 },
    { name: "SAP MM", count: 24 },
    { name: "SAP SD", count: 31 },
  ],
  experience_levels: [
    { label: "Junior", value: 18 },
    { label: "Mid", value: 54 },
    { label: "Senior", value: 56 },
  ],
  countries: [
    { name: "Pakistan", count: 42 },
    { name: "UAE", count: 28 },
    { name: "Saudi Arabia", count: 19 },
    { name: "UK", count: 15 },
  ],
  profile_status: [
    { label: "Verified", value: 95 },
    { label: "Unverified", value: 33 },
    { label: "Certified", value: 64 },
  ],
};

function normalizeDashboardData(data?: ConsultantDashboardSummaryData | null) {
  const source = data ?? defaultData;

  const overview = {
    total_resources:
      source.total_resources ?? source.overview?.total_resources ?? defaultData.overview?.total_resources ?? 0,
    avg_hourly_rate:
      source.avg_hourly_rate ?? source.overview?.avg_hourly_rate ?? defaultData.overview?.avg_hourly_rate ?? 0,
    avg_weekly_availability_hours:
      source.avg_weekly_availability_hours ?? source.overview?.avg_weekly_availability_hours ?? defaultData.overview?.avg_weekly_availability_hours ?? 0,
    verified_profiles:
      source.verified_profiles ?? source.overview?.verified_profiles ?? defaultData.overview?.verified_profiles ?? 0,
    certified_profiles:
      source.certified_profiles ?? source.overview?.certified_profiles ?? defaultData.overview?.certified_profiles ?? 0,
    pending_profiles:
      source.pending_profiles ?? source.overview?.pending_profiles ?? defaultData.overview?.pending_profiles ?? 0,
  };

  const modules =
    Array.isArray(source.modules) && source.modules.length
      ? source.modules
      : (source.modules_breakdown ?? []).map((item) => ({
          name: item.label,
          count: item.value,
        }));

  const experienceLevels =
    Array.isArray(source.experience_levels) && source.experience_levels.length
      ? source.experience_levels
      : (source.experience_level_breakdown ?? []).map((item) => ({
          label: item.label,
          value: item.value,
        }));

  const countries =
    Array.isArray(source.countries) && source.countries.length
      ? source.countries
      : (source.countries_breakdown ?? []).map((item) => ({
          name: item.label,
          count: item.value,
        }));

  const profileStatus =
    Array.isArray(source.profile_status) && source.profile_status.length
      ? source.profile_status
      : (source.profile_status_breakdown ?? []).map((item) => ({
          label: item.label,
          value: item.value,
        }));

  return {
    overview,
    modules,
    experience_levels: experienceLevels,
    countries,
    profile_status: profileStatus,
  };
}

const cardStyles = {
  p: 2.5,
  borderRadius: 3,
  border: "1px solid #E2E8F0",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
  bgcolor: "#FFFFFF",
};

function formatValue(value: number | undefined | null) {
  const safeValue = Number(value ?? 0);
  return Number.isInteger(safeValue) ? safeValue.toString() : safeValue.toFixed(1);
}

export default function ConsultantDashboardOverview({
  data,
}: ConsultantDashboardOverviewProps) {
  const dashboardData = normalizeDashboardData(data);
  const overview = dashboardData.overview;
  const modules = dashboardData.modules;
  const experienceLevels = dashboardData.experience_levels;
  const countries = dashboardData.countries;
  const profileStatus = dashboardData.profile_status;

  const modulesOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, height: 280 },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
    colors: ["#134481"],
    xaxis: {
      categories: modules.map((item) => item.name),
      labels: { style: { colors: "#64748B", fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: "#64748B", fontSize: "12px" } } },
    grid: { borderColor: "#E2E8F0", strokeDashArray: 3 },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  const experienceOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, height: 280 },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
    colors: ["#0F766E"],
    xaxis: {
      categories: experienceLevels.map((item) => item.label),
      labels: { style: { colors: "#64748B", fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: "#64748B", fontSize: "12px" } } },
    grid: { borderColor: "#E2E8F0", strokeDashArray: 3 },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  const countriesOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, height: 280 },
    plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: "55%" } },
    colors: ["#2563EB"],
    xaxis: {
      categories: countries.map((item) => item.name),
      labels: { style: { colors: "#64748B", fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: "#64748B", fontSize: "12px" } } },
    grid: { borderColor: "#E2E8F0", strokeDashArray: 3 },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  const profileStatusOptions: ApexOptions = {
    chart: { type: "donut", toolbar: { show: false }, height: 280 },
    labels: profileStatus.map((item) => item.label),
    colors: ["#134481", "#64748B", "#0F766E"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    tooltip: { theme: "light" },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography variant="h6" fontWeight={700} sx={{ color: "#1E293B" }}>
        Consultant Overview
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={cardStyles}>
            <Typography variant="caption" color="text.secondary">
              Resource Count
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: "#0F172A" }}>
              {formatValue(overview.total_resources)}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={cardStyles}>
            <Typography variant="caption" color="text.secondary">
              Avg Per Hour Rate
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: "#0F172A" }}>
              ${formatValue(overview.avg_hourly_rate)}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={cardStyles}>
            <Typography variant="caption" color="text.secondary">
              Avg Weekly Availability Hours
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: "#0F172A" }}>
              {formatValue(overview.avg_weekly_availability_hours)}h
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={cardStyles}>
            <Typography variant="caption" color="text.secondary">
              Verified Profiles
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: "#0F172A" }}>
              {formatValue(overview.verified_profiles)}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={cardStyles}>
            <Typography variant="caption" color="text.secondary">
              Pending Profiles
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: "#0F172A" }}>
              {formatValue(overview.pending_profiles)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ ...cardStyles, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Resource by Modules
            </Typography>
            <ApexChart options={modulesOptions} series={[{ name: "Resources", data: modules.map((item) => item.count) }]} type="bar" height={280} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ ...cardStyles, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Experience Level
            </Typography>
            <ApexChart options={experienceOptions} series={[{ name: "Resources", data: experienceLevels.map((item) => item.value) }]} type="bar" height={280} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ ...cardStyles, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Resources by Countries
            </Typography>
            <ApexChart options={countriesOptions} series={[{ name: "Resources", data: countries.map((item) => item.count) }]} type="bar" height={280} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ ...cardStyles, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Total vs Verified vs Certified Profiles
            </Typography>
            <ApexChart options={profileStatusOptions} series={profileStatus.map((item) => item.value)} type="donut" height={280} />
          </Paper>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Typography variant="caption" color="text.secondary">
          Backend contract: overview + modules + experience_levels + countries + profile_status
        </Typography>
      </Stack>
    </Box>
  );
}
