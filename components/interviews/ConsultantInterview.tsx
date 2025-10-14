"use client";

import DataTable from "@/components/DataTable";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import DynamicPopup from "../Popup";
import StatusDropdown from "../StatusDropdown";

const interviewStats: StatCardProps[] = [
  {
    title: "Interview Requests",
    subtitle: 5,
    color: "linear-gradient(135deg, #4680FF, #97B7FF)",
    icon: "MarkEmailUnreadIcon",
  },
  {
    title: "Interview Scheduled",
    subtitle: 3,
    color: "linear-gradient(135deg, #00997B, #4BD7BB)",
    icon: "EventAvailableIcon",
  },
  {
    title: "Reschedule Requests",
    subtitle: 4,
    color: "linear-gradient(135deg, #FFB64E, #F6BD6C)",
    icon: "UpdateIcon",
  },
  {
    title: "Rejected Interviews",
    subtitle: 3,
    color: "linear-gradient(135deg, #FF5471, #FF99AB)",
    icon: "HighlightOffIcon",
  },
];

const taskRows = [
  {
    id: 1,
    client: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    requestDate: "10.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 2,
    client: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    requestDate: "10.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Request",
  },
  {
    id: 3,
    client: "LogicCo",
    modules: "SAP SCM, S/4HANA",
    requestDate: "10.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 4,
    client: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    requestDate: "10.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Reschedule",
  },
  {
    id: 5,
    client: "RetailCo",
    modules: "SAP SD, Fiori",
    requestDate: "08.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 6,
    client: "TechFirm",
    modules: "SAP MM, S/4HANA",
    requestDate: "08.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 7,
    client: "TechFirm",
    modules: "SAP MM, S/4HANA",
    requestDate: "08.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Request",
  },
  {
    id: 8,
    client: "RetailCo",
    modules: "SAP SD, Fiori",
    requestDate: "08.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Reschedule",
  },
  {
    id: 9,
    client: "BankCorp",
    modules: "SAP FI, S/4HANA",
    requestDate: "06.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Rejected",
  },
  {
    id: 10,
    client: "BankCorp",
    modules: "SAP FI, S/4HANA",
    requestDate: "05.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Request",
  },
  {
    id: 11,
    client: "LogicCo",
    modules: "SAP SCM, S/4HANA",
    requestDate: "06.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Reschedule",
  },
];

export default function ConsultantInterview() {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const taskColumns: GridColDef[] = [
    { field: "client", headerName: "Client", flex: 1 },
    { field: "modules", headerName: "Modules", flex: 2 },
    { field: "requestDate", headerName: "Request date", flex: 1 },
    { field: "datetime", headerName: "Date – Time", flex: 2 },
    { field: "duration", headerName: "Duration", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <StatusDropdown
          value={params.value}
          onRescheduleClick={() => setRescheduleOpen(true)}
        />
      ),
    },
  ];

  return (
    <Box>
      <DashboardStats
        stats={interviewStats}
        containerProps={{ marginBottom: "30px" }}
      />

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <DataTable
          title="List of Interviews"
          columns={taskColumns}
          rows={taskRows}
          pageSize={10}
        />
      </Box>

      <DynamicPopup
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Reschedule"
        description="Suggest a date and time for interview."
        fields={[
          {
            id: "date",
            label: "Date",
            type: "date",
            value: date,
            onChange: setDate,
          },
          {
            id: "time",
            label: "Time",
            type: "time",
            value: time,
            onChange: setTime,
          },
        ]}
        buttonText="Request"
        buttonColor="BLUE"
        onSubmit={() => {
          setRescheduleOpen(false);
        }}
      />
    </Box>
  );
}
