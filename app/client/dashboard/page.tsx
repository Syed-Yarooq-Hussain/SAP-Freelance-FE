"use client";

import { useClientStats } from "@/actions/clients/useClientStats";
import { useClientPayments } from "@/actions/payments/useClientPayments";
import { useClientProjects } from "@/actions/projects/useClientProjects";
import EngagementCalendarCard from "@/components/EngagementCalendarCard";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import {
  clientAnnouncements,
  clientStats,
  getClientSidebar,
  OngoingProject,
} from "@/data/clientDashboard";
import { clientPaymentColumns } from "@/data/clientPayment";
import { clientProjectColumns } from "@/data/clientProject";
import {
  ClientPaymentRow,
  ClientProjectRow,
  IClientPaymentDTO,
} from "@/types/client";
import { APP_ROUTES } from "@/utils/app_routes";
import { currentMonth, currentYear, formatYMD } from "@/utils/dateTime";
import { useAnimatedCounter } from "@/utils/useAnimatedCounter";
import { useProjectProgress } from "@/utils/useProjectProgress";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ClientDashboardPage() {
  const router = useRouter();
  const { reload } = useProjectProgress();
  const [initiatedProjects, setInitiatedProjects] = useState<OngoingProject[]>(
    []
  );
  const [projectRows, setProjectRows] = useState<ClientProjectRow[]>([]);
  const { mutate: loadProjects } = useClientProjects();
  const [paymentRows, setPaymentRows] = useState<ClientPaymentRow[]>([]);
  const { mutate: loadPayments } = useClientPayments();
  const { data: statsResponse, isLoading: statsLoading } = useClientStats();
  const dashboardStats = statsResponse?.data?.dashboard;

  const animatedStats = [
    useAnimatedCounter(dashboardStats?.number_of_project ?? 0),
    useAnimatedCounter(dashboardStats?.interview_schedule ?? 0),
    useAnimatedCounter(dashboardStats?.total_spend_on_project ?? 0),
    useAnimatedCounter(dashboardStats?.pending_invoices ?? 0),
  ];

  const stats = clientStats.map((config, index) => ({
    ...config,
    subtitle:
      index === 2 || index === 3
        ? `$${animatedStats[index].toLocaleString()}`
        : animatedStats[index],
    loading: statsLoading,
  }));

  const fetchProjects = useCallback(() => {
    loadProjects(undefined, {
      onSuccess: (res) => {
        const apiProjects = res.data ?? [];
        const mappedRows = apiProjects.map((item) => ({
          id: String(item.id),
          name: item.name,
          members: item.members,
          duration: item.projectDetails?.duration
            ? `${item.projectDetails.duration} months`
            : "N/A",
          spend: "N/A",
          startdate: item.projectDetails?.start_date
            ? item.projectDetails.start_date.split("T")[0]
            : "N/A",
          estimated: "N/A",
          status: item.status,
        }));

        setProjectRows(mappedRows);

        const sidebarProjects: OngoingProject[] = apiProjects
          .filter((p) => p.status === "Initiated")
          .map((p) => {
            const stored = JSON.parse(
              localStorage.getItem("tb_projects") || "[]"
            );

            const local = stored.find((s: any) => s.id == p.id);

            return {
              id: String(p.id),
              name: p.name,
              step: local?.step ?? 2,
            };
          });

        setInitiatedProjects(sidebarProjects);
      },
      onError: (err) => console.error(err),
    });
  }, [loadProjects]);

  const fetchPayments = useCallback(() => {
    loadPayments(undefined, {
      onSuccess: (res) => {
        const mapped =
          res.data?.map((item: IClientPaymentDTO) => ({
            id: item.id,
            project: item.project?.name ?? "N/A",
            duedates: formatYMD(item.due_date),
            amount: `$${item.amount}`,
            status: item.payment_module ?? "Pending",
            invoice: "-",
            receiptUrl: item.document?.url ?? "",
            is_paid: item.is_paid ?? false,
            payment_module: item.payment_module ?? "",
          })) ?? [];

        setPaymentRows(mapped);
      },
      onError: (err) => console.error(err),
    });
  }, [loadPayments]);

  useEffect(() => {
    fetchProjects();
    fetchPayments();
  }, [fetchProjects, fetchPayments]);

  useEffect(() => {
    const handler = () => reload();
    window.addEventListener("tb_projects_updated", handler);
    return () => window.removeEventListener("tb_projects_updated", handler);
  }, [reload]);

  return (
    <Sidebar>
      <Dashboard
        announcements={clientAnnouncements}
        stats={stats}
        chart={
          <EngagementCalendarCard
            events={[]}
            year={currentYear}
            month={currentMonth}
          />
        }
        projectTable={{
          title: "Project Highlights",
          columns: clientProjectColumns,
          rows: projectRows.slice(0, 3),
          showViewMore: true,
          hidePagination: true,
          onViewMoreClick: () => router.push(APP_ROUTES.CLIENT.PROJECTS),
        }}
        financeTable={{
          title: "Payments Pending",
          columns: clientPaymentColumns,
          rows: paymentRows.slice(0, 3),
          showViewMore: true,
          hidePagination: true,
          onViewMoreClick: () => router.push(APP_ROUTES.CLIENT.PAYMENTS),
        }}
        sidebarSections={getClientSidebar(router, initiatedProjects)}
      />
    </Sidebar>
  );
}
