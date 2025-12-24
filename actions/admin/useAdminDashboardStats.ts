"use client";

import { useAdminStats } from "@/actions/admin/useAdminStats";
import type { StatCardProps } from "@/components/StatCard";
import { adminStatsConfig } from "@/data/adminDashboard";
import { useAnimatedCounter } from "@/utils/useAnimatedCounter";

export function useAdminDashboardStats(): StatCardProps[] {
  const { data } = useAdminStats();
  const stats = data?.data;

  const animatedValues = [
    useAnimatedCounter(stats?.total_consultants ?? 0),
    useAnimatedCounter(stats?.total_clients ?? 0),
    useAnimatedCounter(stats?.pending_consultant_approvals ?? 0),
    useAnimatedCounter(stats?.active_projects ?? 0),
    useAnimatedCounter(stats?.active_consultants ?? 0),
    useAnimatedCounter(stats?.active_clients ?? 0),
    useAnimatedCounter(stats?.interview_this_week ?? 0),
    useAnimatedCounter(stats?.upcoming_projects ?? 0),
  ];

  return adminStatsConfig.map((config, index) => ({
    ...config,
    subtitle: animatedValues[index],
  }));
}
