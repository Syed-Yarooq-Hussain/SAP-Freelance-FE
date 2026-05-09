import { StatCardProps } from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import AppButton from "@/components/Button";
import type { CandidateRow, TaskRow, PaymentTableRow } from "@/types/teamBuilder";
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
import { Box, Checkbox, IconButton, Stack, Tooltip, Typography } from "@mui/material";
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
    title: "Hours Per Week",
    color: colors.BLUE,
    icon: "QueryStatsIcon" as const,
  },
  {
    title: "Avg. Rate Per Hour",
    color: colors.BLUE,
    icon: "CurrencyExchangeIcon" as const,
  },
  {
    title: "Hours Per Month",
    color: colors.BLUE,
    icon: "EventAvailableIcon" as const,
  },
  {
    title: "Per Month Cost",
    color: colors.BLUE,
    icon: "BallotIcon" as const,
  },
];

export const teamBuilderColumns = (
  onRequestChange: (id: string | number, value: number, avail: number) => void
): GridColDef[] => [
  { field: "id", headerName: "IDs" },
  { field: "coremodules", headerName: "Modules (Core)", flex: 1.5 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 1.5 },
  { field: "experience", headerName: "Experience" },
  { field: "rate", headerName: "Rate (Hrs)", flex: 1 },
  { field: "avail", headerName: "Avail. (Hrs)" },
  {
    field: "calendar",
    headerName: "Cal.",
    flex: 0.5,
    sortable: false,
    renderCell: (params) => {
      return (
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => params.row.openSchedule(params.row)}
        >
          <EventAvailableIcon sx={{ color: colors.BLUE, fontSize: 24 }} />
        </Box>
      );
    },
  },
  {
    field: "request",
    headerName: "Request (Hrs)/Week",
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      const avail = params.row.avail;
      const error = params.row.error;
      const isInvalid = params.row.request > avail;

      return (
        <Box
          sx={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingY: "4px",
            overflow: "visible !important",
          }}
        >
          <input
            type="number"
            min={0}
            value={params.row.request}
            onChange={(e) => {
              const val = Number(e.target.value);
              onRequestChange(params.row.id, val, avail);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            style={{
              width: "60px",
              textAlign: "center",
              border: `1px solid ${isInvalid ? "red" : "#dcdcdc"}`,
              borderRadius: "6px",
              padding: "4px",
            }}
          />

          {error && (
            <Typography
              sx={{
                color: "red",
                fontSize: "10px",
                marginTop: "2px",
                lineHeight: 1,
                overflow: "visible !important",
                textAlign: "center",
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
