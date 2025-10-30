import { IFieldConfig } from "@/components/CreateForm";
import { MilestoneRow } from "@/components/specific/teambuilder/TeamProjects";
import StatusDropdown from "@/components/StatusDropdown";
import { STATUS } from "@/constants/status_dropdown";
import type { CandidateRow } from "@/types/teamBuilder";
import { colors } from "@/utils/styles/colors";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import Groups2Icon from "@mui/icons-material/Groups2";
import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";
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
export const teamBuilderStats = [
  {
    title: "Hours Per Week",
    subtitle: 6,
    color: "linear-gradient(135deg, #5AA9FF, #80C4FF)",
    icon: "QueryStatsIcon" as const,
  },
  {
    title: "Avg. Rate Per Hour",
    subtitle: "$20",
    color: "linear-gradient(135deg, #00997B, #4BD7BB)",
    icon: "CurrencyExchangeIcon" as const,
  },
  {
    title: "Hours Per Month",
    subtitle: 30,
    color: "linear-gradient(135deg, #FFB64E, #FFD27F)",
    icon: "EventAvailableIcon" as const,
  },
  {
    title: "Per Month Cost",
    subtitle: "$12,000",
    color: "linear-gradient(135deg, #FF5471, #FF99AB)",
    icon: "BallotIcon" as const,
  },
];

export const teamBuilderColumns = [
  { field: "id", headerName: "IDs", flex: 1 },
  { field: "modules", headerName: "Modules", flex: 2 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "rate", headerName: "Rate (Hrs)", flex: 1 },
  { field: "avail", headerName: "Avail. (Hrs)", flex: 1 },
  {
    field: "request",
    headerName: "Request Hrs",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <input
        type="number"
        min={0}
        max={10}
        defaultValue={params.value as number}
        style={{
          width: "60px",
          textAlign: "center",
          border: "1px solid #dcdcdc",
          borderRadius: "6px",
          padding: "4px",
        }}
      />
    ),
  },
];

export const teamBuilderRows = [
  {
    id: "z-203",
    modules: "SAP MM, S/4HANA",
    experience: "9 Years",
    rate: "$15/hour",
    avail: 10,
    request: 6,
    avatar: "/img/u1.png",
  },
  {
    id: "z-457",
    modules: "SAP SD, S/4HANA",
    experience: "9 Years",
    rate: "$20/hour",
    avail: 10,
    request: 10,
    avatar: "/img/u2.png",
  },
  {
    id: "z-891",
    modules: "SAP SD, Fiori",
    experience: "9 Years",
    rate: "$18/hour",
    avail: 10,
    request: 0,
    avatar: "/img/u3.png",
  },
  {
    id: "z-324",
    modules: "SAP SD, S/4HANA",
    experience: "9 Years",
    rate: "$22/hour",
    avail: 10,
    request: 6,
    avatar: "/img/u4.png",
  },
  {
    id: "z-678",
    modules: "SAP SD, Fiori",
    experience: "9 Years",
    rate: "$25/hour",
    avail: 10,
    request: 10,
    avatar: "/img/u5.png",
  },
];

export const teamBuilderFormElements = [
  {
    name: "projectName",
    label: "Project Name",
    placeholder: "Enter project name",
    column: { xs: 12, sm: 4 },
    rules: { required: "Project name is required" },
  },
  {
    name: "industry",
    label: "Industry",
    placeholder: "Enter industry",
    column: { xs: 12, sm: 4 },
    rules: { required: "Industry is required" },
  },
  {
    name: "companyName",
    label: "Company Name",
    placeholder: "Enter company name",
    column: { xs: 12, sm: 4 },
    rules: { required: "Company name is required" },
  },
];

export const shortlistedRows = [
  {
    id: "Z - 1234",
    modules: "SAP MM, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$15/hour",
    status: STATUS.PENDING,
    interview: "Request",
  },
  {
    id: "V - 6789",
    modules: "SAP MM, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$15/hour",
    status: STATUS.PENDING,
    interview: "Request",
  },
  {
    id: "U - 3456",
    modules: "SAP MM, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$15/hour",
    status: STATUS.PENDING,
    interview: "Request",
  },
  {
    id: "Y - 5678",
    modules: "SAP ABAP, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$14/hour",
    status: STATUS.WAITING,
    interview: "20/03/2025",
  },
  {
    id: "X - 9101",
    modules: "SAP PI, Fiori",
    experience: "9 Years",
    hourlyRate: "$26/hour",
    status: STATUS.ACCEPTED,
    interview: "20/03/2025",
  },
  {
    id: "W - 2345",
    modules: "SAP MM, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$28/hour",
    status: STATUS.REJECTED,
    interview: "Request",
  },
];

export const candidateRows = [
  {
    id: 1,
    avatar: "/images/a1.png",
    name: "Savannah Nguyen",
    modules: "SAP SD, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$20/hour",
    signed: "4 / 5 remaining",
    role: "SD Lead",
  },
  {
    id: 2,
    avatar: "/images/a2.png",
    name: "Noah Brown",
    modules: "SAP CRM, HANA",
    experience: "9 Years",
    hourlyRate: "$23/hour",
    signed: "4 / 5 remaining",
    role: "Consultant",
  },
  {
    id: 3,
    avatar: "/images/a3.png",
    name: "Albert Flores",
    modules: "SAP SD, Fiori",
    experience: "9 Years",
    hourlyRate: "$18/hour",
    signed: "4 / 5 remaining",
    role: "SD Lead",
  },
  {
    id: 4,
    avatar: "/images/a4.png",
    name: "Lily Wilson",
    modules: "SAP CO, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$24/hour",
    signed: "4 / 5 remaining",
    role: "Consultant",
  },
];

export const ROLES = [
  "Consultant",
  "SD Lead",
  "MM Lead",
  "ABAP Dev",
  "Integration",
  "QA",
];

export const isActionRow = (id: number) => id === 1 || id === 2;

export const getShortlistedColumns = (
  setSelectedCandidateId: (id: string) => void,
  setInterviewOpen: (v: boolean) => void
) => [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "modules", headerName: "Modules", flex: 1 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    sortable: false,
    renderCell: (params: GridRenderCellParams<GridValidRowModel, STATUS>) => (
      <StatusDropdown value={params.value as STATUS} />
    ),
  },
  {
    field: "interview",
    headerName: "Interview",
    flex: 1,
    sortable: false,
    renderCell: (params: GridRenderCellParams<GridValidRowModel, string>) => (
      <Box
        sx={{
          color: params.value === "Request" ? colors.BLUE : "text.primary",
          fontWeight: params.value === "Request" ? 600 : 400,
          cursor: params.value === "Request" ? "pointer" : "default",
          "&:hover": {
            textDecoration: params.value === "Request" ? "underline" : "none",
          },
        }}
        onClick={() => {
          if (params.value === "Request") {
            setSelectedCandidateId(params.row.id as string);
            setInterviewOpen(true);
          }
        }}
      >
        {params.value}
      </Box>
    ),
  },
];

export const getMilestoneCols = (
  expandedMilestoneId: number | null,
  setExpandedMilestoneId: React.Dispatch<React.SetStateAction<number | null>>
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
  { field: "approval", headerName: "Approval", flex: 0.8 },
  {
    field: "tasks",
    headerName: "Tasks",
    flex: 0.6,
    sortable: false,
    renderCell: (p: GridRenderCellParams) => {
      const row = p.row;
      const isOpen = expandedMilestoneId === row.id;
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{
              color: colors.BLUE,
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() =>
              setExpandedMilestoneId((prev) =>
                prev === row.id ? null : row.id
              )
            }
          >
            {row.tasks}
          </Typography>
          {isOpen ? (
            <ArrowDropUpIcon fontSize="small" sx={{ color: "#8f9bb3" }} />
          ) : (
            <ArrowDropDownIcon fontSize="small" sx={{ color: "#8f9bb3" }} />
          )}
        </Box>
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.7,
    sortable: false,
    renderCell: () => (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <IconButton size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <ContentCopyIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
];

export const getCandidateColumns = (
  addToShortlist: (row: CandidateRow) => void,
  rejectCandidate: (row: CandidateRow) => void,
  setCandidates: React.Dispatch<React.SetStateAction<CandidateRow[]>>
) => [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "modules", headerName: "Modules", flex: 1 },
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
      const showActions = isActionRow(row.id);

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            width: "100%",
          }}
        >
          {showActions ? (
            <>
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
            </>
          ) : (
            <Select
              size="small"
              value={row.role}
              onChange={(e) =>
                setCandidates((rows) =>
                  rows.map((r) =>
                    r.id === row.id ? { ...r, role: String(e.target.value) } : r
                  )
                )
              }
              sx={{
                flex: 1,
                bgcolor: "#fff",
                "& .MuiSelect-select": { py: 0.5 },
              }}
            >
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
      );
    },
  },
];

export const assigneeOptions = [
  "Savannah Nguyen",
  "Courtney Henry",
  "Dianne Russell",
  "Guy Hawkins",
];

export const taskColumns: GridColDef[] = [
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
    renderCell: () => (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <IconButton size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <ContentCopyIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
];

export const milestoneCols: GridColDef[] = [
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
  { field: "approval", headerName: "Approval", flex: 0.8 },
  {
    field: "tasks",
    headerName: "Tasks",
    flex: 0.6,
    sortable: false,
    renderCell: (p: GridRenderCellParams) => {
      const row = p.row;
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{
              color: colors.BLUE,
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {row.tasks}
          </Typography>
          <ArrowDropDownIcon fontSize="small" sx={{ color: "#8f9bb3" }} />
        </Box>
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.7,
    sortable: false,
    renderCell: () => (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <IconButton size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <ContentCopyIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
];

export const projectFormElements: IFieldConfig[] = [
  {
    name: "projectName",
    label: "Project name",
    placeholder: "Enter name",
    rules: { required: "Project name is required" },
    column: { xs: 12, md: 4 },
  },
  {
    name: "client",
    label: "Client",
    placeholder: "Enter client",
    column: { xs: 12, md: 4 },
  },
  {
    name: "industry",
    label: "Industry",
    placeholder: "Enter industry",
    column: { xs: 12, md: 4 },
  },
  {
    name: "startDate",
    label: "Start date",
    type: "date",
    rules: { required: "Start date is required" },
    column: { xs: 12, md: 4 },
  },
  {
    name: "endDate",
    label: "End date",
    type: "date",
    rules: { required: "End date is required" },
    column: { xs: 12, md: 4 },
  },
  {
    name: "duration",
    label: "Duration",
    type: "number",
    placeholder: "in hours",
    column: { xs: 12, md: 4 },
    inputProps: { min: 0 },
  },
];

export const milestoneFormElements: IFieldConfig[] = [
  {
    name: "milestoneName",
    label: "Milestone name",
    placeholder: "Enter name",
    column: { xs: 12, md: 4 },
    rules: { required: "Milestone name is required" },
  },
  {
    name: "milestoneEnd",
    label: "End date",
    type: "date",
    column: { xs: 12, md: 4 },
    rules: { required: "End date is required" },
  },
  {
    name: "milestoneDeps",
    label: "Dependencies",
    placeholder: "Select document",
    column: { xs: 12, md: 4 },
  },
  {
    name: "milestoneDescDoc",
    label: "Description",
    placeholder: "Select document",
    column: { xs: 12 },
  },
];

export const taskFormElements: IFieldConfig[] = [
  {
    name: "taskName",
    label: "Task name",
    placeholder: "Select name",
    column: { xs: 12, md: 4 },
    rules: { required: "Task name is required" },
  },
  {
    name: "taskEnd",
    label: "End date",
    type: "date",
    column: { xs: 12, md: 4 },
    rules: { required: "End date is required" },
  },
  {
    name: "taskAssignee",
    label: "Assignee",
    select: true,
    options: assigneeOptions.map((a) => ({ label: a, value: a })),
    column: { xs: 12, md: 4 },
    rules: { required: "Assignee is required" },
  },
  {
    name: "taskDoc",
    label: "Description",
    placeholder: "Select document",
    column: { xs: 12, md: 6 },
  },
  {
    name: "taskMilestone",
    label: "Milestone",
    select: true,
    options: [],
    column: { xs: 12, md: 6 },
  },
];

export const initialMilestones: MilestoneRow[] = [
  {
    id: 1,
    name: "milestone 1",
    date: "2025-09-15",
    description: "Functional setup completed",
    approval: "Required",
    tasks: 13,
  },
  {
    id: 2,
    name: "milestone 2",
    date: "2025-09-15",
    description: "Integration stage",
    approval: "Not required",
    tasks: 4,
  },
];

export const initialTasksByMilestone = {
  1: [
    {
      id: "t1",
      name: "task 1",
      date: "2025-09-15",
      description: "Initial configuration",
      assignees: "Savannah Nguyen",
    },
  ],
  2: [],
  3: [],
  4: [],
};
