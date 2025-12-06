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
import type {
  ClientPaymentRow,
  ClientProjectRow,
  IClientPaymentDTO,
  IClientProjectDTO,
} from "@/types/client";
import { APP_ROUTES } from "@/utils/app_routes";
import { formatYMD } from "@/utils/dateCalendar";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ClientDashboardPage() {
  const router = useRouter();
  const [projectRows, setProjectRows] = useState<ClientProjectRow[]>([]);
  const { mutate: loadProjects } = useClientProjects();
  const [paymentRows, setPaymentRows] = useState<ClientPaymentRow[]>([]);
  const { mutate: loadPayments } = useClientPayments();
  const fetchProjects = useCallback(() => {
    loadProjects(undefined, {
      onSuccess: (res) => {
        const mapped: ClientProjectRow[] =
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

  const fetchPayments = useCallback(() => {
    loadPayments(undefined, {
      onSuccess: (res) => {
        const mapped: ClientPaymentRow[] =
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

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  return (
    <Sidebar>
      <Dashboard
        announcements={clientAnnouncements}
        stats={clientStats}
        chart={<EngagementCalendarCard events={[]} year={year} month={month} />}
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
        sidebarSections={getClientSidebar(router)}
      />
    </Sidebar>
  );
}
