"use client";

import { useConsultantPayments } from "@/actions/payments/useConsultantPayments";
import { useConsultantProjects } from "@/actions/projects/useConsultantProjects";
import EngagementCalendarCard from "@/components/EngagementCalendarCard";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import {
  consultantAnnouncements,
  consultantSidebar,
  consultantStats,
  events,
} from "@/data/consultantDashboard";
import { consultantPaymentColumns } from "@/data/consultantPayment";
import { consultantProjectColumns } from "@/data/consultantProject";
import {
  ConsultantPaymentRow,
  IConsultantPaymentDTO,
  IConsultantProject,
  IConsultantProjectRow,
} from "@/types/consultant";
import { APP_ROUTES } from "@/utils/app_routes";
import { currentMonth, currentYear, formatYMD } from "@/utils/dateTime";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ConsultantDashboardPage() {
  const router = useRouter();
  const [projectRows, setProjectRows] = useState<IConsultantProjectRow[]>([]);
  const { mutate: loadProjects } = useConsultantProjects();
  const [paymentRows, setPaymentRows] = useState<ConsultantPaymentRow[]>([]);
  const { mutate: loadPayments } = useConsultantPayments();
  const fetchProjects = useCallback(() => {
    loadProjects(undefined, {
      onSuccess: (res) => {
        const mapped: IConsultantProjectRow[] =
          res.data?.map((item: IConsultantProject) => ({
            id: Number(item.project_id),
            project_name: item.project_name,
            client_name: item.client_name,
            modules: item.modules?.length ? item.modules.join(", ") : "N/A",
            duration: item.duration !== null ? String(item.duration) : "N/A",
            start_date: formatYMD(item.start_date) ?? "N/A",
            status: item.project_status,
          })) ?? [];

        setProjectRows(mapped);
      },
      onError: (err) => console.error(err),
    });
  }, [loadProjects]);

  const fetchPayments = useCallback(() => {
    loadPayments(undefined, {
      onSuccess: (res) => {
        const mapped: ConsultantPaymentRow[] =
          res.data?.map((item: IConsultantPaymentDTO) => ({
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

  return (
    <Sidebar>
      <Dashboard
        announcements={consultantAnnouncements}
        stats={consultantStats}
        chart={
          <EngagementCalendarCard
            events={events}
            year={currentYear}
            month={currentMonth}
          />
        }
        projectTable={{
          title: "Project Pipeline",
          columns: consultantProjectColumns,
          rows: projectRows.slice(0, 3),
          showViewMore: true,
          hidePagination: true,
          onViewMoreClick: () => router.push(APP_ROUTES.CONSULTANT.PROJECTS),
        }}
        financeTable={{
          title: "Financial List",
          columns: consultantPaymentColumns,
          rows: paymentRows.slice(0, 3),
          showViewMore: true,
          hidePagination: true,
          onViewMoreClick: () => router.push(APP_ROUTES.CONSULTANT.PAYMENTS),
        }}
        sidebarSections={consultantSidebar}
      />
    </Sidebar>
  );
}
