"use client";

import { useClientConsultants } from "@/actions/consultants/useClientConsultants";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import { teamBuilderColumns } from "@/data/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import type { ApiPagination } from "@/types/api";
import type {
  ClientConsultantDTO,
  TeamBuilderRow,
  Weekday,
} from "@/types/teamBuilder";
import colors from "@/utils/styles/colors";
import FilterListIcon from "@mui/icons-material/FilterList";
import Groups2Icon from "@mui/icons-material/Groups2";
import { Box, Button, CircularProgress, Pagination, Stack, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

const ConsultantProfileModal = dynamic(
  () => import("@/components/specific/teambuilder/ConsultantProfileModal"),
  { ssr: false }
);

const TeamBuilderFilters = dynamic(
  () => import("@/components/specific/teambuilder/TeamBuilderFilters"),
  { ssr: false }
);

const extractConsultantListAndPagination = (
  payload: unknown,
  fallbackPagination?: ApiPagination | null
) => {
  if (Array.isArray(payload)) {
    return { list: payload as ClientConsultantDTO[], pagination: fallbackPagination ?? null };
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const listCandidates = [record.data, record.results, record.items, record.consultants];

    for (const candidate of listCandidates) {
      if (Array.isArray(candidate)) {
        return {
          list: candidate as ClientConsultantDTO[],
          pagination: (record.pagination as ApiPagination | undefined) ?? fallbackPagination ?? null,
        };
      }
    }

    const nestedRecord = record.data;
    if (nestedRecord && typeof nestedRecord === "object") {
      const nested = nestedRecord as Record<string, unknown>;
      const nestedCandidates = [nested.data, nested.results, nested.items, nested.consultants];

      for (const candidate of nestedCandidates) {
        if (Array.isArray(candidate)) {
          return {
            list: candidate as ClientConsultantDTO[],
            pagination:
              (record.pagination as ApiPagination | undefined) ??
              (nested.pagination as ApiPagination | undefined) ??
              fallbackPagination ??
              null,
          };
        }
      }
    }
  }

  return { list: [] as ClientConsultantDTO[], pagination: fallbackPagination ?? null };
};

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
  rate: item.rate ? `$${item.rate}/hour` : "N/A",
  rateValue: item.rate ?? 0,
  avail: item.weekly_available_hours ?? 0,
  request: 0,
  error: "",
  avatar: `/img/u${((index % 5) + 1).toString()}.png`,
  working_schedule: item.working_schedule || undefined,
  badges: item.badges ?? [],
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState<TeamBuilderRow[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<ApiPagination | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileConsultant, setProfileConsultant] =
    useState<TeamBuilderRow | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState<
    TeamBuilderRow["working_schedule"] | null
  >(null);
  const { mutate: loadConsultants, isPending } = useClientConsultants();
  const { toast } = useToast();

  const openSchedule = (row: TeamBuilderRow) => {
    setScheduleData(row.working_schedule);
    setScheduleModalOpen(true);
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
      setCurrentPage(page);
      const payload = {
        ...(filters ?? {}),
        page,
        limit: 10,
      } as Record<string, unknown>;

      loadConsultants(payload as any, {
        onSuccess: (res) => {
          const { list, pagination } = extractConsultantListAndPagination(
            res.data,
            res.pagination
          );
          const mapped = list.map((item: ClientConsultantDTO, index: number) =>
            mapConsultantRow(item, index)
          );
          setRows(mapped);
          setPaginationMeta(pagination);
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

  const columns = useMemo(
    () => {
      const teamColumns = teamBuilderColumns(
        () => {},
        (row) => {
          setProfileConsultant(row);
          setProfileModalOpen(true);
        }
      ).filter(
        (column) => column.field !== "request" && column.field !== "id"
      );

      return [...adminContactColumns, ...teamColumns];
    },
    []
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
        {isPending ? (
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
            pageSize={10}
            rowClickable={false}
          />
        )}

        {paginationMeta && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={1.5}
            mt={2}
            px={2}
          >
            <Typography sx={{ fontSize: "0.875rem", color: "#475569" }}>
              Showing {rows.length} of {paginationMeta.total} consultants
            </Typography>
            <Pagination
              count={Math.max(1, paginationMeta.total_pages ?? 1)}
              page={Math.max(0, currentPage)}
              onChange={(_, page) => fetchConsultants(activeFilters, page)}
              siblingCount={1}
              boundaryCount={1}
              color="primary"
              shape="rounded"
              size="small"
            />
          </Stack>
        )}
      </Box>

      {profileModalOpen && profileConsultant && (
        <ConsultantProfileModal
          open={profileModalOpen}
          consultant={profileConsultant}
          isSelected={false}
          showAddButton={false}
          onClose={() => {
            setProfileModalOpen(false);
            setProfileConsultant(null);
          }}
          onAddToSelection={() => {}}
        />
      )}

      {scheduleModalOpen && (
        <DynamicPopup
          open={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          title="Working Schedule"
          description=""
        >
          <Box sx={{ mt: 2 }}>
            {scheduleData?.weekly?.length ? (
              scheduleData.weekly.map((day: Weekday, index: number) => (
                <Box
                  key={`${day.day}-${index}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Typography>{day.day}</Typography>
                  {day.active ? (
                    <Typography>
                      {day.slot?.[0]?.start || "-"} -{" "}
                      {day.slot?.[0]?.end || "-"}
                    </Typography>
                  ) : (
                    <Typography color="red">Not Active</Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">
                No working schedule available
              </Typography>
            )}
          </Box>
        </DynamicPopup>
      )}
    </div>
  );
}
