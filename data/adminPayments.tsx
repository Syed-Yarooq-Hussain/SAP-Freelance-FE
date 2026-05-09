import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import AppButton from "@/components/Button";
import StatusChip from "@/components/StatusChip";
import type { IClientPaymentDTO } from "@/types/client";
import type { IAdminConsultantMonthlyBill } from "@/types/adminPayments";
import { formatCurrencyValue } from "@/utils/payments";

export const createClientPaymentColumns = (
  onMarkPaidClick: (payment: IClientPaymentDTO) => void
): GridColDef<IClientPaymentDTO>[] => [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "projectName",
    headerName: "Project",
    flex: 2,
    renderCell: (params: GridRenderCellParams<IClientPaymentDTO>) => (
      <div>
        <div style={{ fontWeight: 600 }}>
          {params.row.project?.name || "N/A"}
        </div>
        <div style={{ fontSize: "0.85em", color: "#666" }}>
          {params.row.project?.company_name || ""}
        </div>
      </div>
    ),
  },
  {
    field: "milestoneName",
    headerName: "Milestone",
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<IClientPaymentDTO>) => (
      <span>{params.row.milestone?.name || "Custom"}</span>
    ),
  },
  {
    field: "payment_module",
    headerName: "Type",
    width: 120,
    renderCell: (params: GridRenderCellParams<IClientPaymentDTO>) => (
      <Chip
        label={params.row.payment_module?.toUpperCase() || "N/A"}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 120,
    align: "right",
    renderCell: (params: GridRenderCellParams<IClientPaymentDTO>) =>
      formatCurrencyValue(params.row.amount),
  },
  {
    field: "is_paid",
    headerName: "Status",
    width: 120,
    renderCell: (params: GridRenderCellParams<IClientPaymentDTO>) => (
      <StatusChip
        label={params.row.is_paid ? "Paid" : "Unpaid"}
        status={params.row.is_paid ? "success" : "warning"}
      />
    ),
  },
  {
    field: "document",
    headerName: "Receipt",
    width: 150,
    renderCell: (params: GridRenderCellParams<IClientPaymentDTO>) => {
      if (params.row.document?.url) {
        return (
          <AppButton
            label="View Receipt"
            colorKey="BLUE"
            width={120}
            onClick={() => window.open(params.row.document?.url, "_blank")}
          />
        );
      }
      return <span style={{ color: "#999" }}>No receipt</span>;
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 180,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<IClientPaymentDTO>) => (
      <Stack direction="row" spacing={1}>
        {!params.row.is_paid && (
          <AppButton
            label="Mark Paid"
            colorKey="GREEN"
            width={120}
            onClick={() => onMarkPaidClick(params.row)}
          />
        )}
      </Stack>
    ),
  },
];

export const createConsultantPaymentColumns = (
  onMarkPaidClick: (payment: IAdminConsultantMonthlyBill) => void
): GridColDef<IAdminConsultantMonthlyBill>[] => [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "consultant",
    headerName: "Consultant",
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<IAdminConsultantMonthlyBill>) => (
      <div>
        <div style={{ fontWeight: 600 }}>{params.row.user?.username || "N/A"}</div>
        <div style={{ fontSize: "0.85em", color: "#666" }}>
          {params.row.user?.email || ""}
        </div>
      </div>
    ),
  },
  {
    field: "projectName",
    headerName: "Project",
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<IAdminConsultantMonthlyBill>) => (
      <span>{params.row.project?.name || "N/A"}</span>
    ),
  },
  {
    field: "milestoneName",
    headerName: "Milestone",
    flex: 1.2,
    renderCell: (params: GridRenderCellParams<IAdminConsultantMonthlyBill>) => (
      <span>{params.row.milestone?.name || "N/A"}</span>
    ),
  },
  {
    field: "month",
    headerName: "Month",
    width: 100,
    renderCell: (params: GridRenderCellParams<IAdminConsultantMonthlyBill>) => (
      <span>{params.row.month || "N/A"}</span>
    ),
  },
  {
    field: "hours",
    headerName: "Hours",
    width: 80,
    align: "right",
    renderCell: (params: GridRenderCellParams<IAdminConsultantMonthlyBill>) => (
      <span>{params.row.hours} hrs</span>
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 120,
    align: "right",
    renderCell: (params: GridRenderCellParams<IAdminConsultantMonthlyBill>) =>
      formatCurrencyValue(params.row.amount),
  },
  {
    field: "is_paid",
    headerName: "Status",
    width: 120,
    renderCell: (params: GridRenderCellParams<IAdminConsultantMonthlyBill>) => (
      <StatusChip
        label={params.row.is_paid ? "Paid" : "Unpaid"}
        status={params.row.is_paid ? "success" : "warning"}
      />
    ),
  },
  {
    field: "pdf",
    headerName: "Invoice",
    width: 150,
    renderCell: (params: GridRenderCellParams<IAdminConsultantMonthlyBill>) => {
      if (params.row.pdf_url) {
        return (
          <AppButton
            label="View Invoice"
            colorKey="BLUE"
            width={120}
            onClick={() => window.open(params.row.pdf_url, "_blank")}
          />
        );
      }
      return <span style={{ color: "#999" }}>No invoice</span>;
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 180,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<IAdminConsultantMonthlyBill>) => (
      <Stack direction="row" spacing={1}>
        {!params.row.is_paid && (
          <AppButton
            label="Mark Paid"
            colorKey="GREEN"
            width={120}
            onClick={() => onMarkPaidClick(params.row)}
          />
        )}
      </Stack>
    ),
  },
];
