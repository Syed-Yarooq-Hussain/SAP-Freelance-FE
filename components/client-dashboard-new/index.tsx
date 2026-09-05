"use client";

import Announcement from "@/components/Announcement";
import DataTable from "@/components/DataTable";
import SidebarInfo, { type SidebarSectionInfo } from "@/components/DashboardSidebarInfo";
import type { ClientPaymentRow, ClientProjectRow } from "@/types/client";
import type { GridColDef } from "@mui/x-data-grid";
import {
  ArrowUpRight,
  CalendarCheck2,
  FolderKanban,
  ReceiptText,
  Sparkles,
  WalletCards,
} from "lucide-react";

interface ClientDashboardViewProps {
  name?: string;
  announcements: string[];
  stats: {
    projects: number;
    interviews: number;
    spend: number;
    invoices: number;
    loading?: boolean;
  };
  chart: React.ReactNode;
  projects: ClientProjectRow[];
  projectColumns: GridColDef<ClientProjectRow>[];
  payments: ClientPaymentRow[];
  paymentColumns: GridColDef<ClientPaymentRow>[];
  sidebarSections: SidebarSectionInfo[];
  onViewProjects: () => void;
  onViewPayments: () => void;
}

export default function ClientDashboardView({
  name,
  announcements,
  stats,
  chart,
  projects,
  projectColumns,
  payments,
  paymentColumns,
  sidebarSections,
  onViewProjects,
  onViewPayments,
}: ClientDashboardViewProps) {
  const cards = [
    { label: "Active Projects", value: stats.projects, icon: FolderKanban, tone: "bg-blue-50 text-brand-blue" },
    { label: "Scheduled Meetings", value: stats.interviews, icon: CalendarCheck2, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Total Project Spend", value: `$${stats.spend.toLocaleString()}`, icon: WalletCards, tone: "bg-violet-50 text-violet-700" },
    { label: "Pending Invoices", value: `$${stats.invoices.toLocaleString()}`, icon: ReceiptText, tone: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="min-h-screen rounded-2xl bg-[#F4F5F8] font-manrope">
      <section className="mb-4 overflow-hidden rounded-2xl bg-brand-blue px-5 py-5 text-white shadow-sm md:px-7 md:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              <Sparkles className="h-4 w-4" /> Client workspace
            </div>
            <h1 className="text-2xl font-bold md:text-3xl">Welcome back{name ? `, ${name}` : ""}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">Track projects, interviews, payments, and your SAP delivery team from one place.</p>
          </div>
          <button type="button" onClick={onViewProjects} className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-brand-blue shadow-sm transition hover:-translate-y-0.5">
            View all projects <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {announcements.length ? <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white"><Announcement items={announcements} /></div> : null}

      <section className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div>
            <p className="text-[11px] font-semibold text-slate-500 md:text-xs">{label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">{stats.loading ? "--" : value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <main className="space-y-4 xl:col-span-9">
          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:p-5">{chart}</section>
          <DashboardTable title="Project Highlights" rows={projects} columns={projectColumns} onViewMore={onViewProjects} />
          <DashboardTable title="Payments Pending" rows={payments} columns={paymentColumns} onViewMore={onViewPayments} />
        </main>
        <aside className="xl:col-span-3"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><SidebarInfo sections={sidebarSections} /></div></aside>
      </div>
    </div>
  );
}

function DashboardTable<T extends { id: string | number }>({ title, rows, columns, onViewMore }: { title: string; rows: T[]; columns: GridColDef<T>[]; onViewMore: () => void }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:p-5">
      <DataTable title={title} rows={rows} columns={columns} pageSize={3} hidePagination showViewMore onViewMoreClick={onViewMore} />
    </section>
  );
}
