import { StatCardProps } from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import AppButton from "@/components/Button";
import type { CandidateRow, TaskRow, PaymentTableRow, TeamBuilderRow } from "@/types/teamBuilder";
import { formatDateTimeAmPm } from "@/utils/dateTime";
import { formatCurrencyValue } from "@/utils/payments";
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
import { Box, Button, Checkbox, IconButton, Stack, Tooltip, Typography } from "@mui/material";
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
  onViewProfile?: (row: TeamBuilderRow) => void
): GridColDef[] => [
  {
    field: "id",
    headerName: "Consultant ID",
    flex: 0.9,
    minWidth: 120,
    renderCell: (params) => (
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1E293B" }}>
          #{params.value}
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
    renderCell: (params) => {
      const label = params.value as string;
      if (!label || label === "N/A") {
        return (
          <Typography sx={{ color: "#94A3B8", fontSize: "12px" }}>N/A</Typography>
        );
      }

      return (
        <Box
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 5,
            bgcolor: "#E8F5E9",
            color: "#2E7D32",
            fontSize: "12px",
            fontWeight: 600,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
          title={label}
        >
          {label}
        </Box>
      );
    },
  },
  {
    field: "othersmodules",
    headerName: "Modules (Other)",
    flex: 1.5,
    minWidth: 180,
    renderCell: (params) => {
      const modules = parseModuleList(params.value as string);

      if (!modules.length) {
        return (
          <Typography sx={{ color: "#94A3B8", fontSize: "12px" }}>N/A</Typography>
        );
      }

      return (
        <Stack spacing={0.75} sx={{ width: "100%", minWidth: 0 }}>
          {modules.map((module) => (
            <Box
              key={module}
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: 5,
                bgcolor: "#E3F2FD",
                color: colors.BLUE,
                fontSize: "12px",
                fontWeight: 600,
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
              }}
              title={module}
            >
              {module}
            </Box>
          ))}
        </Stack>
      );
    },
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
    headerName: "Rate",
    flex: 0.7,
    minWidth: 80,
    renderCell: (params) => {
      const rateValue =
        params.row.rateValue ??
        Number(String(params.value).replace(/[^0-9.]/g, "")) ??
        0;

      return (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#1E293B" }}>
            ${rateValue}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>/hr</Typography>
        </Box>
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
  { field: "id", headerName: "ID" },
  { field: "coremodules", headerName: "Modules (Core)", flex: 1.5 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 1.5 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
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
  { field: "name", headerName: "Name", flex: 1 },
  { field: "coremodules", headerName: "Modules (Core)", flex: 2 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 2 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
  { field: "signed", headerName: "Signed Contact", flex: 1 },
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

      if (row.role) {
        return (
          <Typography
            sx={{
              fontWeight: 700,
              color: colors.BLUE,
              textTransform: "capitalize",
            }}
          >
            {row.role}
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
            Hired
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
  { field: "assignees", headerName: "Assignees", flex: 1 },
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
    flex: 2,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <strong style={{ textDecoration: "underline" }}>
        {params.row.milestone?.name || params.row.project_milestone_id}
      </strong>
    ),
  },
  {
    field: "payment_module",
    headerName: "Type",
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <span style={{ textTransform: "capitalize" }}>
        {params.row.payment_module?.toLowerCase() || "N/A"}
      </span>
    ),
  },
  {
    field: "baseAmount",
    headerName: "Base Amount",
    flex: 1.2,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) =>
      formatCurrencyValue(params.row.baseAmount),
  },
  {
    field: "vat",
    headerName: "VAT (10%)",
    flex: 1,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) =>
      formatCurrencyValue(params.row.vat),
  },
  {
    field: "serviceCharge",
    headerName: "Service Charge (10%)",
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) =>
      formatCurrencyValue(params.row.serviceCharge),
  },
  {
    field: "totalAmount",
    headerName: "Total",
    flex: 1,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <strong>{formatCurrencyValue(params.row.totalAmount)}</strong>
    ),
  },
  {
    field: "is_paid",
    headerName: "Status",
    flex: 1,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <StatusChip
        label={params.row.is_paid ? "Paid" : "Unpaid"}
        color="BLUE"
        status={params.row.is_paid ? "success" : "warning"}
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 220,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <Stack direction="row" spacing={1}>
        <AppButton
          label="Mark Paid"
          colorKey="BLUE"
          width={100}
          disabled={params.row.is_paid}
          onClick={() => onPaidClick(String(params.row.id))}
        />
      </Stack>
    ),
  },
];

export const teamBuilderPaymentMilestoneColumns = [
  {
    field: "milestone",
    headerName: "Milestone",
    renderCell: (params: GridRenderCellParams) => (
      <strong style={{ textDecoration: "underline" }}>{params.value}</strong>
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
    flex: 2,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <strong style={{ textDecoration: "underline" }}>
        {params.row.milestone?.name || params.row.project_milestone_id}
      </strong>
    ),
  },
  {
    field: "payment_module",
    headerName: "Type",
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <span style={{ textTransform: "capitalize" }}>
        {params.row.payment_module?.toLowerCase() || "N/A"}
      </span>
    ),
  },
  {
    field: "baseAmount",
    headerName: "Base Amount",
    flex: 1.2,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) =>
      formatCurrencyValue(params.row.baseAmount),
  },
  {
    field: "vat",
    headerName: "VAT (10%)",
    flex: 1,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) =>
      formatCurrencyValue(params.row.vat),
  },
  {
    field: "serviceCharge",
    headerName: "Service Charge (10%)",
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) =>
      formatCurrencyValue(params.row.serviceCharge),
  },
  {
    field: "totalAmount",
    headerName: "Total",
    flex: 1,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <strong>{formatCurrencyValue(params.row.totalAmount)}</strong>
    ),
  },
  {
    field: "is_paid",
    headerName: "Status",
    flex: 1,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <StatusChip
        label={params.row.is_paid ? "Paid" : "Unpaid"}
        color="BLUE"
        status={params.row.is_paid ? "success" : "warning"}
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 220,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<PaymentTableRow>) => (
      <Stack direction="row" spacing={1}>
        <AppButton
          label="Mark Paid"
          colorKey="BLUE"
          width={100}
          disabled={params.row.is_paid}
          onClick={() => onPaidClick(String(params.row.id))}
        />
      </Stack>
    ),
  },
];

export const teamBuilderPaymentCustomRangeColumns = [
  {
    field: "milestone",
    headerName: "Milestone",
    renderCell: (params: GridRenderCellParams) => (
      <strong style={{ textDecoration: "underline" }}>{params.value}</strong>
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

export const invoiceData = {
  invoiceName: "Milestone 1",
  accountTitle: "John Doe",
  accountNumber: "1234563322566311556315",
  iban: "BAC1235US5600033225566315",
  invoiceNumber: "3,500",
  amount: "3,500",
  serviceCharges: "35",
  vat: "10%",
  vatAmount: "$35",
  totalAmount: "3,570",
};
