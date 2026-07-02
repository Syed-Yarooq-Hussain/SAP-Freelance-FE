"use client";

import { useConsultantCalendar } from "@/actions/consultants/useConsultantCalendar";
import { useConsultantRightSidebar } from "@/actions/consultants/useConsultantRightSidebar";
import { useConsultantStats } from "@/actions/consultants/useConsultantStats";
import { useConsultantPayments } from "@/actions/payments/useConsultantPayments";
import { useConsultantProjects } from "@/actions/projects/useConsultantProjects";
import { SidebarSectionInfo } from "@/components/DashboardSidebarInfo";
import EngagementCalendarCard from "@/components/EngagementCalendarCard";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import {
  consultantAnnouncements,
  consultantSidebar,
  consultantStats,
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
import { mapApiDaysToCalendarEvents } from "@/utils/mapConsultantCalendar";
import { useAnimatedCounter } from "@/utils/useAnimatedCounter";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ConsultantDashboardPage() {
  const router = useRouter();
  const [projectRows, setProjectRows] = useState<IConsultantProjectRow[]>([]);
  const { mutate: loadProjects } = useConsultantProjects();
  const [paymentRows, setPaymentRows] = useState<ConsultantPaymentRow[]>([]);
  const { mutate: loadPayments } = useConsultantPayments();
  const { data: calendarData } = useConsultantCalendar(
    currentMonth,
    currentYear
  );

  const { data: statsResponse, isLoading: statsLoading } = useConsultantStats();
  const dashboardStats = statsResponse?.data?.dashboard;
  const animatedStats = [
    useAnimatedCounter(dashboardStats?.appeared_in_search ?? 0),
    useAnimatedCounter(dashboardStats?.interview_schedule ?? 0),
    useAnimatedCounter(dashboardStats?.projected_monthly_revenue ?? 0),
    useAnimatedCounter(dashboardStats?.total_earnings ?? 0),
  ];

  const stats = consultantStats.map((config, index) => ({
    ...config,
    subtitle:
      index === 2 || index === 3
        ? `$${animatedStats[index].toLocaleString()}`
        : animatedStats[index],
    loading: statsLoading,
  }));

  const { data: sidebarRes } = useConsultantRightSidebar();

  const sidebarData = sidebarRes?.data;
  const primarySkill = sidebarData?.skills?.find((s) => s.primary_modules);
  const otherSkill = sidebarData?.skills?.find((s) => s.other_modules);

  const sidebarSections: SidebarSectionInfo[] = consultantSidebar.map(
    (section) => {
      if (section.title === "Skills & Certifications") {
        return {
          ...section,
          items: section.items.map((item) => {
            if (item.label === "Primary Modules") {
              return {
                ...item,
                value: primarySkill?.primary_modules ?? "-",
                subValue: `${primarySkill?.exp ?? 0} year experience`,
              };
            }

            if (item.label === "Other Modules") {
              return {
                ...item,
                value: otherSkill?.other_modules ?? "-",
                subValue: `${otherSkill?.rate ?? 0}/hour`,
              };
            }

            return item;
          }),
        };
      }

      if (section.title === "Engagement") {
        return {
          ...section,
          items: section.items.map((item) => {
            if (item.label === "Current Employer") {
              return {
                ...item,
                value: sidebarData?.engagements?.current?.employeer ?? "-",
                subValue:
                  sidebarData?.engagements?.current?.project_info ?? "-",
              };
            }

            if (item.label === "Upcoming Employer") {
              return {
                ...item,
                value: sidebarData?.engagements?.upcoming?.employeer ?? "-",
                subValue:
                  sidebarData?.engagements?.upcoming?.project_info ?? "-",
              };
            }

            return item;
          }),
        };
      }

      return section;
    }
  );

  const calendarEvents = useMemo(() => {
    if (!calendarData?.days) return [];
    return mapApiDaysToCalendarEvents(calendarData.days);
  }, [calendarData]);

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
            id: item.id || `${item.project?.id ?? "project"}-${item.month}`,
            project: item.project?.name ?? "N/A",
            duedates: item.due_date ? formatYMD(item.due_date) : "N/A",
            totalHours: String(item.total_hours ?? 0),
            amount: `$${item.amount}`,
            status: item.payment_module ?? "Pending",
            pdfUrl: item.pdf_url ?? item.pdfUrl ?? "",
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
        stats={stats}
        chart={
          <EngagementCalendarCard
            events={calendarEvents}
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
        sidebarSections={sidebarSections}
      />
    </Sidebar>
  );
}
