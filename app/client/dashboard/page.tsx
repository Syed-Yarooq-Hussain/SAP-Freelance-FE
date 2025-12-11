"use client";

import { useClientPayments } from "@/actions/payments/useClientPayments";
import { useClientProjects } from "@/actions/projects/useClientProjects";
import EngagementCalendarCard from "@/components/EngagementCalendarCard";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import {
  clientAnnouncements,
  clientStats,
  getClientSidebar,
} from "@/data/clientDashboard";
import { clientPaymentColumns } from "@/data/clientPayment";
import { clientProjectColumns } from "@/data/clientProject";
import {
  ClientPaymentRow,
  ClientProjectRow,
  IClientPaymentDTO,
  IClientProjectDTO,
} from "@/types/client";
import { APP_ROUTES } from "@/utils/app_routes";
import { currentMonth, currentYear, formatYMD } from "@/utils/dateTime";
import { useProjectProgress } from "@/utils/useProjectProgress";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ClientDashboardPage() {
  const router = useRouter();
  const { projects: ongoingProjects, reload } = useProjectProgress();

  const [projectRows, setProjectRows] = useState<ClientProjectRow[]>([]);
  const { mutate: loadProjects } = useClientProjects();
  const [paymentRows, setPaymentRows] = useState<ClientPaymentRow[]>([]);
  const { mutate: loadPayments } = useClientPayments();

  // Load projects from API
  const fetchProjects = useCallback(() => {
    loadProjects(undefined, {
      onSuccess: (res) => {
        const mapped =
          res.data?.map((item: IClientProjectDTO) => ({
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
          })) ?? [];

        setProjectRows(mapped);
      },
      onError: (err) => console.error(err),
    });
  }, [loadProjects]);

  // Load payments
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

  // Re-sync when "tb_projects_updated" fires
  useEffect(() => {
    const handler = () => reload();
    window.addEventListener("tb_projects_updated", handler);
    return () => window.removeEventListener("tb_projects_updated", handler);
  }, [reload]);

  return (
    <Sidebar>
      <Dashboard
        announcements={clientAnnouncements}
        stats={clientStats}
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
        sidebarSections={getClientSidebar(router, ongoingProjects)}
      />
    </Sidebar>
  );
}
