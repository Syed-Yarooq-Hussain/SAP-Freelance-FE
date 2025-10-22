import { GridRenderCellParams } from "@mui/x-data-grid";

export const teamBuilderSteps = [
  {
    number: 1,
    title: "Create Project Team",
    description: "Shortlist Candidate",
  },
  {
    number: 2,
    title: "Team Confirmation",
    description: "Set Interview & Assign role",
  },
  {
    number: 3,
    title: "Project Scope",
    description: "Upload scope, define timeline",
  },
  { number: 4, title: "Payments", description: "Milestones & invoices" },
  { number: 5, title: "Document", description: "Signing contracts" },
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
