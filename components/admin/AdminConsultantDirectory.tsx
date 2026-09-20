"use client";

import { useClientConsultants } from "@/actions/consultants/useClientConsultants";
import DataTable from "@/components/DataTable";
import ConsultantAvailabilityDialog from "@/components/specific/teambuilder/ConsultantAvailabilityDialog";
import { teamBuilderColumns } from "@/data/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import type { ApiPagination } from "@/types/api";
import type {
  ClientConsultantDTO,
  TeamBuilderRow,
} from "@/types/teamBuilder";
import {
  appendUniqueRows,
  CONSULTANT_PAGE_SIZE,
  extractConsultantListAndPagination,
  hasMoreConsultants,
} from "@/utils/consultantPagination";
import colors from "@/utils/styles/colors";
import { formatHourlyRate } from "@/utils/rates";
import FilterListIcon from "@mui/icons-material/FilterList";
import Groups2Icon from "@mui/icons-material/Groups2";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const TeamBuilderFilters = dynamic(
  () => import("@/components/specific/teambuilder/TeamBuilderFilters"),
  { ssr: false }
);

const mapConsultantRow = (
  item: ClientConsultantDTO,
  index: number
): TeamBuilderRow => ({
  id: item.id,
  name: item.name ?? item.username ?? item.user?.username,
  email: item.email ?? item.user?.email,
  phone: item.phone ?? item.user?.phone,
  country: item.country,
  projectName:
    item.project_name && item.project_name !== "N/A"
      ? item.project_name
      : undefined,
  coremodules: item.modules?.core || "N/A",
  othersmodules: item.modules?.others || "N/A",
  experience: item.experience ? `${item.experience} Years` : "N/A",
  experienceYears: item.experience ?? null,
  rate: item.rate !== undefined ? `${formatHourlyRate(item.rate, item.currency)}/hour` : "N/A",
  rateValue: item.rate ?? 0,
  baseRate: item.base_rate ?? null,
  profitMarginPercentage: item.profit_margin_percentage ?? null,
  currency: item.currency ?? "USD",
  showAdminPricing:
    item.base_rate !== undefined ||
    item.profit_margin_percentage !== undefined,
  avail: item.weekly_available_hours ?? 0,
  request: 0,
  error: "",
  avatar: `/img/u${((index % 5) + 1).toString()}.png`,
  working_schedule: item.working_schedule || undefined,
  badges: item.badges ?? [],
  rawProfile: item as unknown as Record<string, any>,
});

const adminContactColumns: GridColDef<TeamBuilderRow>[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1.1,
    minWidth: 160,
    renderCell: (params) => (
      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#1E293B" }}>
        {params.value || "N/A"}
      </Typography>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.4,
    minWidth: 220,
    renderCell: (params) => (
      <Typography sx={{ fontSize: "0.8125rem", color: "#475569" }}>
        {params.value || "N/A"}
      </Typography>
    ),
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 0.9,
    minWidth: 140,
    renderCell: (params) => (
      <Typography sx={{ fontSize: "0.8125rem", color: "#475569" }}>
        {params.value || "N/A"}
      </Typography>
    ),
  },
];

export default function AdminConsultantDirectory() {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState<TeamBuilderRow[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});
  const [paginationMeta, setPaginationMeta] = useState<ApiPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scheduleConsultant, setScheduleConsultant] = useState<TeamBuilderRow | null>(null);
  const { mutate: loadConsultants, isPending } = useClientConsultants();
  const { toast } = useToast();

  const openProfile = useCallback((row: TeamBuilderRow) => {
    try {
      sessionStorage.setItem(
        `admin-consultant-profile:${row.id}`,
        JSON.stringify(row.rawProfile ?? row),
      );
    } catch {
      // The detail page will refetch if session storage is unavailable.
    }
    router.push(`/admin/consultant/${row.id}`);
  }, [router]);

  const openSchedule = (row: TeamBuilderRow) => {
    setScheduleConsultant(row);
  };

  const rowsWithSchedule = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        openSchedule,
      })),
    [rows]
  );

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rowsWithSchedule;

    return rowsWithSchedule.filter((row) => {
      const idMatch = String(row.id).toLowerCase().includes(query);
      const nameMatch = row.name?.toLowerCase().includes(query);
      const emailMatch = row.email?.toLowerCase().includes(query);
      const phoneMatch = row.phone?.toLowerCase().includes(query);
      const coreMatch = row.coremodules?.toLowerCase().includes(query);
      const othersMatch = row.othersmodules?.toLowerCase().includes(query);
      return (
        idMatch ||
        nameMatch ||
        emailMatch ||
        phoneMatch ||
        coreMatch ||
        othersMatch
      );
    });
  }, [rowsWithSchedule, searchQuery]);

  const fetchConsultants = useCallback(
    (filters?: Record<string, unknown>, page = 1) => {
      const payload = {
        ...(filters ?? {}),
        page,
        limit: CONSULTANT_PAGE_SIZE,
      } as Record<string, unknown>;

      loadConsultants(payload as any, {
        onSuccess: (res) => {
          const { list, pagination } = extractConsultantListAndPagination(
            res.data,
            res.pagination
          );
          const mapped = list.map((item: ClientConsultantDTO, index: number) =>
            mapConsultantRow(item, (page - 1) * CONSULTANT_PAGE_SIZE + index)
          );
          setRows((current) =>
            page === 1 ? mapped : appendUniqueRows(current, mapped)
          );
          setPaginationMeta(pagination);
          setCurrentPage(page);
          setHasMore(hasMoreConsultants(pagination, list.length, page));
          setFilterOpen(false);
        },
        onError: (error) => {
          const msg =
            error instanceof Error
              ? error.message
              : "Failed to load consultants";
          toast(msg, "error");
        },
      });
    },
    [loadConsultants, toast]
  );

  useEffect(() => {
    fetchConsultants();
  }, [fetchConsultants]);

  const loadMore = useCallback(() => {
    if (isPending || !hasMore) return;
    const nextPage = paginationMeta?.next_page ?? currentPage + 1;
    fetchConsultants(activeFilters, nextPage);
  }, [activeFilters, currentPage, fetchConsultants, hasMore, isPending, paginationMeta]);

  const columns = useMemo(
    () => {
      const teamColumns = teamBuilderColumns(
        () => {},
        openProfile
      ).filter(
        (column) => column.field !== "request" && column.field !== "id"
      );

      return [...adminContactColumns, ...teamColumns];
    },
    [openProfile]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          
        </div>
        <Button
          onClick={() => setFilterOpen((prev) => !prev)}
          startIcon={<FilterListIcon />}
          sx={{
            border: `1px solid ${colors.BLUE}`,
            color: colors.BLUE,
            textTransform: "none",
            borderRadius: "999px",
            fontWeight: 600,
            px: 2,
            py: 0.75,
            bgcolor: "white",
            "&:hover": {
              bgcolor: `${colors.BLUE}10`,
              borderColor: colors.BLUE,
            },
          }}
        >
          Filters
        </Button>
      </div>

      {filterOpen && (
        <TeamBuilderFilters
          open={filterOpen}
          onApply={(filters) => {
            setActiveFilters(filters ?? {});
            fetchConsultants(filters ?? {}, 1);
          }}
        />
      )}

      <Box sx={{ bgcolor: colors.LIGHT_YELLOW, borderRadius: 2, py: 2 }}>
        {isPending && rows.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            variant="consultant"
            title="Consultant Selection"
            hidePagination
            scrollHeight={560}
            onScrollEnd={loadMore}
            loadingMore={isPending && rows.length > 0}
            titleIcon={
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: `${colors.ICON_BLUE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Groups2Icon sx={{ color: "white", fontSize: 20 }} />
              </Box>
            }
            showSearch
            searchPlaceholder="Search by ID, name, email, phone, or module..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            columns={columns}
            rows={filteredRows}
            rowClickable
            onRowClick={(params) => openProfile(params.row as TeamBuilderRow)}
          />
        )}

        {paginationMeta && (
          <Box sx={{ mt: 1.5, px: 2, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.875rem", color: "#475569" }}>
              Showing {rows.length} of {paginationMeta.total} consultants
            </Typography>
          </Box>
        )}
      </Box>

      {scheduleConsultant && (
        <ConsultantAvailabilityDialog
          open
          onClose={() => setScheduleConsultant(null)}
          consultantId={scheduleConsultant.id}
          schedule={scheduleConsultant.working_schedule}
        />
      )}
    </div>
  );
}
