import { consultantLabel } from "@/utils/consultantIdentity";
import { StatCardProps } from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import AppButton from "@/components/Button";
import ConsultantRateDisplay from "@/components/specific/teambuilder/ConsultantRateDisplay";
import type { CandidateRow, TaskRow, PaymentTableRow, TeamBuilderRow } from "@/types/teamBuilder";
import { formatDateTimeAmPm } from "@/utils/dateTime";
import { formatCurrency } from "@/utils/payments";
import { formatHourlyRate } from "@/utils/rates";
import { colors, statusColors } from "@/utils/styles/colors";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import Groups2Icon from "@mui/icons-material/Groups2";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Avatar, Box, Button, Checkbox, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridValidRowModel,
} from "@mui/x-data-grid";

export const teamBuilderSteps = [
  {
    number: 1,
    title: "Create Team",
    description: "Shortlist Candidate",
    icon: <Groups2Icon fontSize="small" />,
  },
  {
    number: 2,
    title: "Confirmation",
    description: "Set interview & assign role",
    icon: <EventSeatIcon fontSize="small" />,
  },
  {
    number: 3,
    title: "Project",
    description: "Upload scope, define timeline",
    icon: <AssignmentIcon fontSize="small" />,
  },
  {
    number: 4,
    title: "Payments",
    description: "Milestones & invoices",
    icon: <CreditCardIcon fontSize="small" />,
  },
];

export const teamBuilderStats: StatCardProps[] = [
  {
    title: "Hours per week",
    color: colors.BLUE,
    icon: "AccessTimeIcon" as const,
    variant: "outlined",
  },
  {
    title: "Avg. Rate Per Hour",
    color: colors.BLUE,
    icon: "CurrencyExchangeIcon" as const,
    variant: "outlined",
  },
  {
    title: "Hours / Month",
    color: colors.BLUE,
    icon: "EventAvailableIcon" as const,
    variant: "outlined",
  },
  {
    title: "Per Month Cost",
    color: colors.BLUE,
    icon: "CreditCardIcon" as const,
    variant: "accent",
  },
];

const MAX_WEEKLY_HOURS = 40;

const parseModuleList = (value?: string): string[] => {
  if (!value || value === "N/A") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const ConsultantModules = ({ value, tone, search = "", selected = [] }: {
  value?: string;
  tone: "core" | "other";
  search?: string;
  selected?: string[];
}) => {
  const query = search.trim().toLowerCase();
  const selectedNames = new Set(selected.map((name) => name.trim().toLowerCase()));
  const modules = parseModuleList(value).map((name) => ({
    name,
    matched: Boolean(query && name.toLowerCase().includes(query)) ||
      selectedNames.has(name.toLowerCase()),
  })).sort((a, b) => Number(b.matched) - Number(a.matched));

  if (!modules.length) {
    return <Typography sx={{ color: "#94A3B8", fontSize: "12px" }}>N/A</Typography>;
  }

  return (
    <Stack direction="row" spacing={0.5} sx={{ width: "100%", minWidth: 0, alignItems: "center" }}>
      {modules.slice(0, 1).map(({ name, matched }, index) => (
        <Tooltip key={`${name}-${index}`} title={name} arrow>
        <Box
          sx={{
            px: 1, py: 0.25, borderRadius: 5, minWidth: 0,
            bgcolor: tone === "core" ? "#E8F5E9" : "#E3F2FD",
            color: tone === "core" ? "#2E7D32" : colors.BLUE,
            border: "1px solid", borderColor: matched ? "currentColor" : "transparent",
            fontSize: "11px", fontWeight: matched ? 700 : 500,
            lineHeight: 1.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {matched ? <Box component="mark" sx={{ bgcolor: "transparent", color: "inherit" }}>{name}</Box> : name}
        </Box>
        </Tooltip>
      ))}
      {modules.length > 1 && (
        <Tooltip arrow title={<Box>{modules.slice(1).map(({ name, matched }, index) => (
          <Box key={`${name}-${index}`} sx={{ fontWeight: matched ? 700 : 400, py: 0.25 }}>{name}{matched ? " (matched)" : ""}</Box>
        ))}</Box>}>
          <Box component="button" type="button" aria-label={`Show ${modules.length - 1} more modules`}
            sx={{ border: 0, bgcolor: "#F1F5F9", color: "#64748B", borderRadius: 5, px: 0.75, py: 0.25, fontSize: 10, cursor: "help", flexShrink: 0 }}>
            +{modules.length - 1}
          </Box>
        </Tooltip>
      )}
    </Stack>
  );
};

const ConsultantStatusBadge = ({
  label,
  tone,
}: {
  label: string;
  tone: "certified" | "verified";
}) => (
  <Box
    sx={{
      px: 1,
      py: 0.25,
      borderRadius: 1,
      fontSize: "0.6875rem",
      fontWeight: 600,
      lineHeight: 1.4,
      bgcolor: tone === "verified" ? "#E8F5E9" : "#E3F2FD",
      color: tone === "verified" ? "#2E7D32" : colors.BLUE,
    }}
  >
    {label}
  </Box>
);

const ConsultantBadges = ({ badges = [] }: { badges?: string[] }) => {
  if (!badges.length) return null;

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
      {badges.map((badge) => {
        const normalized = badge.toUpperCase();
        if (normalized === "VERIFIED") {
          return (
            <ConsultantStatusBadge key={badge} label="Verified" tone="verified" />
          );
        }
        if (normalized === "CERTIFIED") {
          return (
            <ConsultantStatusBadge key={badge} label="Certified" tone="certified" />
          );
        }
        return null;
      })}
    </Stack>
  );
};

export const teamBuilderColumns = (
  onRequestChange: (id: string | number, value: number, avail: number) => void,
  onViewProfile?: (row: TeamBuilderRow) => void,
  moduleSearch: { searchQuery?: string; coreModules?: string[]; otherModules?: string[]; publicIdentity?: boolean } = {},
): GridColDef[] => [
  {
    field: "id",
    headerName: "Consultant ID",
    flex: 0.9,
    minWidth: moduleSearch.publicIdentity ? 180 : 120,
    valueFormatter: (value) => moduleSearch.publicIdentity ? consultantLabel(value) : value,
    renderCell: (params) => (
      <Box>
        <Typography sx={{ fontWeight: 600, fontSize: "0.75rem", color: "#1E293B" }}>
          {moduleSearch.publicIdentity ? consultantLabel(params.row.id) : `#${params.value}`}
        </Typography>
        <ConsultantBadges badges={params.row.badges} />
      </Box>
    ),
  },
  {
    field: "coremodules",
    headerName: "Modules (Core)",
    flex: 1.4,
    minWidth: 160,
    renderCell: (params) => (
      <ConsultantModules value={params.value} tone="core" search={moduleSearch.searchQuery}
        selected={moduleSearch.coreModules} />
    ),
  },
  {
    field: "othersmodules",
    headerName: "Modules (Other)",
    flex: 1.5,
    minWidth: 180,
    renderCell: (params) => (
      <ConsultantModules value={params.value} tone="other" search={moduleSearch.searchQuery}
        selected={moduleSearch.otherModules} />
    ),
  },
  {
    field: "experience",
    headerName: "Experience",
    flex: 0.8,
    minWidth: 100,
    renderCell: (params) => {
      const years = params.row.experienceYears;
      const label =
        years != null && years > 0
          ? `${years} yrs`
          : params.value === "N/A"
          ? "N/A"
          : String(params.value).replace(/years?/i, "yrs");

      return (
        <Typography sx={{ color: "#64748B", fontSize: "12px" }}>
          {label}
        </Typography>
      );
    },
  },
  {
    field: "rate",
    headerName: "Client Rate",
    flex: 1,
    minWidth: 145,
    renderCell: (params) => {
      const rateValue =
        params.row.rateValue ??
        Number(String(params.value).replace(/[^0-9.]/g, "")) ??
        0;
      return (
        <ConsultantRateDisplay
          rateValue={rateValue}
          baseRate={params.row.baseRate}
          profitMarginPercentage={params.row.profitMarginPercentage}
          currency={params.row.currency}
          showAdminPricing={params.row.showAdminPricing}
        />
      );
    },
  },
  {
    field: "avail",
    headerName: "Availability",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      const avail = Number(params.value) || 0;
      const progress = Math.min(100, (avail / MAX_WEEKLY_HOURS) * 100);

      return (
        <Box sx={{ width: "100%", maxWidth: 110 }}>
          <Typography sx={{ fontSize: "12px", color: "#475569", mb: 0.75 }}>
            {avail} hrs/wk
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 4,
              borderRadius: 1,
              bgcolor: "#E8EAED",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: "100%",
                bgcolor: colors.BLUE,
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>
      );
    },
  },
  {
    field: "viewprofile",
    headerName: "View Profile",
    flex: 1,
    minWidth: 130,
    sortable: false,
    renderCell: (params) => (
      <Button
        variant="outlined"
        size="small"
        startIcon={<VisibilityOutlinedIcon sx={{ fontSize: "18px !important" }} />}
        onClick={(e) => {
          e.stopPropagation();
          onViewProfile?.(params.row as TeamBuilderRow);
        }}
        sx={{
          textTransform: "none",
          borderColor: "#E2E8F0",
          color: "#334155",
          borderRadius: 2,
          fontWeight: 500,
          fontSize: "0.8125rem",
          px: 1,
          py: 0.75,
          bgcolor: "#fff",
          whiteSpace: "nowrap",
          "& .MuiButton-startIcon": { color: colors.BLUE },
          "&:hover": {
            borderColor: colors.BLUE,
            bgcolor: "#F8FBFF",
          },
        }}
      >
        View Details
      </Button>
    ),
  },
  {
    field: "calendar",
    headerName: "Calendar",
    flex: 0.6,
    minWidth: 90,
    sortable: false,
    renderCell: (params) => (
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1.5,
          bgcolor: colors.BLUE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          "&:hover": { opacity: 0.9 },
        }}
        onClick={(e) => {
          e.stopPropagation();
          params.row.openSchedule(params.row);
        }}
      >
        <EventAvailableIcon sx={{ color: "#fff", fontSize: 20 }} />
      </Box>
    ),
  },
  {
    field: "request",
    headerName: "Request Hrs / Week",
    flex: 1,
    minWidth: 140,
    sortable: false,
    renderCell: (params) => {
      const avail = params.row.avail;
      const error = params.row.error;
      const value = Number(params.row.request) || 0;
      const isInvalid = value > avail;

      const updateValue = (next: number) => {
        onRequestChange(params.row.id, Math.max(0, next), avail);
      };

      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "stretch",
              border: `1px solid ${isInvalid ? colors.RED : "#E2E8F0"}`,
              borderRadius: 1.5,
              overflow: "hidden",
              bgcolor: "#fff",
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                updateValue(value - 1);
              }}
              sx={{
                borderRadius: 0,
                px: 1,
                color: "#64748B",
                "&:hover": { bgcolor: "#F8FAFC" },
              }}
            >
              <RemoveIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Box
              sx={{
                minWidth: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderLeft: "1px solid #E2E8F0",
                borderRight: "1px solid #E2E8F0",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#1E293B",
              }}
            >
              {value}
            </Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                updateValue(value + 1);
              }}
              sx={{
                borderRadius: 0,
                px: 1,
                color: "#64748B",
                "&:hover": { bgcolor: "#F8FAFC" },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {error && (
            <Typography
              sx={{
                color: colors.RED,
                fontSize: "0.625rem",
                mt: 0.5,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      );
    },
  },
];

export const getShortlistedColumns = (
  onRequest: (consultantId: string | number) => void,
  onReschedule: (
    meetingId: number,
    interviewDateTime: string | null,
    consultantId: string | number
  ) => void,
  onCancel: (meetingId: number) => void
): GridColDef[] => [
  { field: "id", headerName: "Consultant", minWidth: 180, valueFormatter: (value) => consultantLabel(value) },
  { field: "coremodules", headerName: "Modules (Core)", flex: 1.5 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 1.5 },
  { field: "experience", headerName: "Experience", flex: 1 },
  {
    field: "hourlyRate",
    headerName: "Client Rate",
    flex: 1.4,
    minWidth: 165,
    renderCell: (params) => (
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{params.value}</Typography>
        {params.row.showAdminPricing ? (
          <Typography sx={{ fontSize: 10, color: "#64748B", whiteSpace: "nowrap" }}>
            Base {formatHourlyRate(params.row.baseRate, params.row.currency)} · Margin {params.row.profitMarginPercentage ?? 0}%
          </Typography>
        ) : null}
      </Box>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      const colorName =
        statusColors[params.value as keyof typeof statusColors] || "GREY";
      return <StatusChip label={params.value} color={colorName} />;
    },
  },
  {
    field: "interviewDateTime",
    headerName: "Interview Date",
    flex: 1.5,
    renderCell: (params) => {
      if (!params.value) return "N/A";
      return formatDateTimeAmPm(params.value);
    },
  },
  {
    field: "interview",
    headerName: "Interview Action",
    flex: 1.5,
    sortable: false,
    renderCell: (params) => {
      const hasInterview = Boolean(params.row.interviewDateTime);

      return (
        <Box sx={{ display: "flex", gap: 1 }}>
          {!hasInterview ? (
            <Box
              sx={{
                color: colors.BLUE,
                cursor: "pointer",
                fontWeight: 600,
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => onRequest(params.row.id)}
            >
              Request
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  color: colors.BLUE,
                  cursor: "pointer",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() =>
  onReschedule(
    params.row.meetingId,
    params.row.interviewDateTime,
    params.row.id
  )
}
              >
                Reschedule
              </Box>

              <Box
                sx={{
                  color: colors.RED,
                  cursor: "pointer",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => onCancel(params.row.meetingId)}
              >
                Cancel
              </Box>
            </>
          )}
        </Box>
      );
    },
  },
];

export const getCandidateColumns = (
  addToShortlist: (row: CandidateRow) => void,
  rejectCandidate: (row: CandidateRow) => void
): GridColDef[] => [
  {
    field: "name", headerName: "Consultant", flex: 1, minWidth: 210,
    valueGetter: (_value, row) => consultantLabel(row.id),
    renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar sx={{ width: 32, height: 32 }} />
        <span>{consultantLabel(params.row.id)}</span>
      </Stack>
    ),
  },
  { field: "coremodules", headerName: "Modules (Core)", flex: 2 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 2 },
  { field: "experience", headerName: "Experience", flex: 1 },
  {
    field: "hourlyRate",
    headerName: "Client Rate",
    flex: 1.4,
    minWidth: 165,
    renderCell: (params) => (
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{params.value}</Typography>
        {params.row.showAdminPricing ? (
          <Typography sx={{ fontSize: 10, color: "#64748B", whiteSpace: "nowrap" }}>
            Base {formatHourlyRate(params.row.baseRate, params.row.currency)} · Margin {params.row.profitMarginPercentage ?? 0}%
          </Typography>
        ) : null}
      </Box>
    ),
  },
  { field: "signed", headerName: "Signed Contact", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => (
      <StatusChip
        label={String(params.value || "interviewed")}
        color={statusColors[params.value as keyof typeof statusColors] || "GREY"}
      />
    ),
  },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    sortable: false,
    renderCell: (
      params: GridRenderCellParams<GridValidRowModel, unknown, CandidateRow>
    ) => {
      const row = params.row as CandidateRow;

      if (row.status === "rejected") {
        return (
          <Typography
            sx={{
              fontWeight: 700,
              color: colors.RED,
              textTransform: "capitalize",
            }}
          >
            Rejected
          </Typography>
        );
      }

      if (row.status === "hired") {
        return (
          <Typography
            sx={{
              fontWeight: 700,
              color: colors.BLUE,
              textTransform: "capitalize",
            }}
          >
            Hired
          </Typography>
        );
      }

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            width: "100%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.BLUE,
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
              whiteSpace: "nowrap",
            }}
            onClick={() => addToShortlist(row)}
          >
            {row.status === "offered" ? "Hire" : "Make offer"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.RED,
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
              whiteSpace: "nowrap",
            }}
            onClick={() => rejectCandidate(row)}
          >
            Reject
          </Typography>
        </Box>
      );
    },
  },
];

export const taskColumns = (
  onEditTask?: (row: TaskRow) => void
): GridColDef[] => [
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "date",
    headerName: "Date",
    flex: 0.6,
    renderCell: (p: GridRenderCellParams) => {
      const iso = String(p.row.date ?? "");
      if (!iso) return <>-</>;
      const [y, m, d] = iso.split("-");
      return <>{`${d}.${m}.${y}`}</>;
    },
  },
  { field: "description", headerName: "Description", flex: 1.6 },
  { field: "assignees", headerName: "Assignees", flex: 1, valueFormatter: (value) => consultantLabel(value) },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.6,
    sortable: false,
    renderCell: (p) => (
      <Stack direction="row" spacing={1}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => onEditTask?.(p.row)}
            sx={{
              color: colors.BLUE,
              "&:hover": { bgcolor: `${colors.BLUE}15` },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => console.log("Delete")}
            sx={{
              color: colors.RED,
              "&:hover": { bgcolor: `${colors.RED}15` },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  },
];

export const teamBuilderPaymentStats = [
  {
    title: "Total Project Cost",
    subtitle: "$12,000",
    color: colors.BLUE,
    icon: "QueryStatsIcon" as const,
  },
  {
    title: "System Charges",
    subtitle: "$1,500",
    color: colors.BLUE,
    icon: "CurrencyExchangeIcon" as const,
  },
  {
    title: "Consultant Cost",
    subtitle: "$10,500",
    color: colors.BLUE,
    icon: "EventAvailableIcon" as const,
  },
  {
    title: "Taxes Applied",
    subtitle: "$0",
    color: colors.BLUE,
    icon: "BallotIcon" as const,
  },
];

export const createTeamBuilderPaymentMilestoneColumns = (
  onCheckboxChange: (id: string, checked: boolean) => void,
  onPaidClick: (id: string) => void
): GridColDef<PaymentTableRow>[] => [
  {
    field: "selected",
    headerName: "",
    width: 50,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <Checkbox
        checked={params.row.selected || false}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          onCheckboxChange(String(params.row.id), e.target.checked)
        }
        size="small"
      />
    ),
  },
  {
    field: "milestone",
    headerName: "Milestone",
    minWidth: 180,
    flex: 2,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <strong style={{ fontWeight: 600, fontSize: 12 }}>
        {params.row.milestone?.name || (params.row.project_milestone_id ? `Milestone #${params.row.project_milestone_id}` : `Custom payment #${params.row.id}`)}
      </strong>
    ),
  },
  {
    field: "payment_module",
    headerName: "Type",
    minWidth: 100,
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <span style={{ textTransform: "capitalize" }}>
        {params.row.payment_module?.toLowerCase() || "N/A"}
      </span>
    ),
  },
  {
    field: "amount",
    headerName: "Payment amount",
    minWidth: 140,
    flex: 1.4,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) =>
      formatCurrency(Number(params.row.amount), params.row.currency || "USD"),
  },
  { field: "currency", headerName: "Currency", width: 100 },
  {
    field: "is_paid",
    headerName: "Status",
    minWidth: 90,
    flex: 1,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <Chip size="small" label={params.row.is_paid ? "Paid" : "Unpaid"}
        sx={{ height: 24, fontSize: 11, fontWeight: 600, bgcolor: params.row.is_paid ? "#ECFDF5" : "#FFFBEB", color: params.row.is_paid ? "#047857" : "#92400E" }}
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 140,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          sx={{ textTransform: "none", fontSize: 11, borderRadius: 1.5, whiteSpace: "nowrap" }}
          disabled={params.row.is_paid || Number(params.row.amount) <= 0}
          onClick={() => onPaidClick(String(params.row.id))}
        >{params.row.is_paid ? "Paid" : "Record payment"}</Button>
      </Stack>
    ),
  },
];

export const teamBuilderPaymentMilestoneColumns = [
  {
    field: "milestone",
    headerName: "Milestone",
    renderCell: (params: GridRenderCellParams) => (
      <strong style={{ fontWeight: 600, fontSize: 12 }}>{params.value}</strong>
    ),
    flex: 3,
  },
  { field: "duedate", headerName: "Due Date", flex: 3 },
  { field: "amount", headerName: "Amount", flex: 1 },
];

export const teamBuilderPaymentMilestoneRows = [
  {
    id: 1,
    milestone: "Milestone 1",
    duedate: "10.09.2025",
    amount: "$2,500",
  },
  {
    id: 2,
    milestone: "Milestone 2",
    duedate: "10.10.2025",
    amount: "$3,500",
  },
  {
    id: 3,
    milestone: "Milestone 3",
    duedate: "10.11.2025",
    amount: "$3,500",
  },
];

export const createTeamBuilderPaymentCustomRangeColumns = (
  onCheckboxChange: (id: string, checked: boolean) => void,
  onPaidClick: (id: string) => void
): GridColDef<PaymentTableRow>[] => [
  {
    field: "selected",
    headerName: "",
    width: 50,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <Checkbox
        checked={params.row.selected || false}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          onCheckboxChange(String(params.row.id), e.target.checked)
        }
        size="small"
      />
    ),
  },
  {
    field: "milestone",
    headerName: "Milestone",
    minWidth: 180,
    flex: 2,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <strong style={{ fontWeight: 600, fontSize: 12 }}>
        {params.row.milestone?.name || (params.row.project_milestone_id ? `Milestone #${params.row.project_milestone_id}` : `Custom payment #${params.row.id}`)}
      </strong>
    ),
  },
  {
    field: "payment_module",
    headerName: "Type",
    minWidth: 100,
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <span style={{ textTransform: "capitalize" }}>
        {params.row.payment_module?.toLowerCase() || "N/A"}
      </span>
    ),
  },
  {
    field: "amount",
    headerName: "Payment amount",
    minWidth: 140,
    flex: 1.4,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) =>
      formatCurrency(Number(params.row.amount), params.row.currency || "USD"),
  },
  { field: "currency", headerName: "Currency", width: 100 },
  {
    field: "is_paid",
    headerName: "Status",
    minWidth: 90,
    flex: 1,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <Chip size="small" label={params.row.is_paid ? "Paid" : "Unpaid"}
        sx={{ height: 24, fontSize: 11, fontWeight: 600, bgcolor: params.row.is_paid ? "#ECFDF5" : "#FFFBEB", color: params.row.is_paid ? "#047857" : "#92400E" }}
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 140,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          sx={{ textTransform: "none", fontSize: 11, borderRadius: 1.5, whiteSpace: "nowrap" }}
          disabled={params.row.is_paid || Number(params.row.amount) <= 0}
          onClick={() => onPaidClick(String(params.row.id))}
        >{params.row.is_paid ? "Paid" : "Record payment"}</Button>
      </Stack>
    ),
  },
];

export const teamBuilderPaymentCustomRangeColumns = [
  {
    field: "milestone",
    headerName: "Milestone",
    renderCell: (params: GridRenderCellParams) => (
      <strong style={{ fontWeight: 600, fontSize: 12 }}>{params.value}</strong>
    ),
    flex: 3,
  },
  { field: "paymentdate", headerName: "Payment Date", flex: 2 },
  { field: "duedate", headerName: "Due Date", flex: 2 },
  { field: "amount", headerName: "Amount", flex: 1 },
];

export const teamBuilderPaymentCustomRangeRows = [
  {
    id: 1,
    milestone: "Milestone 1",
    paymentdate: "10.09.2025",
    duedate: "10.09.2025",
    amount: "$2,500",
  },
  {
    id: 2,
    milestone: "Milestone 2",
    paymentdate: "10.10.2025",
    duedate: "10.10.2025",
    amount: "$3,500",
  },
  {
    id: 3,
    milestone: "Milestone 3",
    paymentdate: "10.11.2025",
    duedate: "10.11.2025",
    amount: "$3,500",
  },
];
