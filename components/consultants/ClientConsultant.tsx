"use client";

import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import colors from "@/utils/styles/colors";
import { Box, Link } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

type MeetingData = {
  date: string;
  time: string;
  link: string;
};

export default function ClientConsultant() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState<MeetingData>({
    date: "",
    time: "",
    link: "",
  });

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState<MeetingData>({
    date: "",
    time: "",
    link: "",
  });

  const handleCloseSchedule = () => {
    setScheduleOpen(false);
    setScheduleData({ date: "", time: "", link: "" });
  };

  const handleCloseReschedule = () => {
    setRescheduleOpen(false);
    setRescheduleData({ date: "", time: "", link: "" });
  };

  const handleScheduleSubmit = () => {
    console.log("Schedule Meeting Data:", scheduleData);
    handleCloseSchedule();
  };

  const handleRescheduleSubmit = () => {
    console.log("Reschedule Data:", rescheduleData);
    handleCloseReschedule();
  };

  const consultantColumns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 2 },
    { field: "modules", headerName: "Modules", flex: 2 },
    { field: "experience", headerName: "Experience", flex: 1 },
    { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
    { field: "projectName", headerName: "Project Name", flex: 2 },
    {
      field: "meeting",
      headerName: "Meeting",
      flex: 1,
      renderCell: (params) => (
        <Link
          href="#"
          underline="hover"
          sx={{
            color: params.value === "Reschedule" ? colors.BLUE : colors.GREEN,
            fontWeight: 500,
          }}
          onClick={(e) => {
            e.preventDefault();
            if (params.value === "Reschedule") {
              setRescheduleOpen(true);
            } else {
              setScheduleOpen(true);
            }
          }}
        >
          {params.value}
        </Link>
      ),
    },
  ];

  const consultantRows = [
    {
      id: 1,
      avatar: "/images/team1.jpg",
      name: "Marvin McKinney",
      modules: "SAP MM, S/4HANA",
      experience: "9 Years",
      hourlyRate: "$15/hour",
      projectName: "ERP Upgrade",
      meeting: "Send Invite",
    },
    {
      id: 2,
      avatar: "/images/team2.jpg",
      name: "Savannah Nguyen",
      modules: "SAP SD, S/4HANA",
      experience: "9 Years",
      hourlyRate: "$20/hour",
      projectName: "ERP Upgrade",
      meeting: "Send Invite",
    },
    {
      id: 3,
      avatar: "/images/team3.jpg",
      name: "Albert Flores",
      modules: "SAP SD, Fiori",
      experience: "9 Years",
      hourlyRate: "$18/hour",
      projectName: "ERP Upgrade",
      meeting: "Reschedule",
    },
    {
      id: 4,
      avatar: "/images/team1.jpg",
      name: "Marvin McKinney",
      modules: "SAP MM, S/4HANA",
      experience: "9 Years",
      hourlyRate: "$15/hour",
      projectName: "ERP Upgrade",
      meeting: "Send Invite",
    },
    {
      id: 5,
      avatar: "/images/team2.jpg",
      name: "Savannah Nguyen",
      modules: "SAP SD, S/4HANA",
      experience: "9 Years",
      hourlyRate: "$20/hour",
      projectName: "ERP Upgrade",
      meeting: "Send Invite",
    },
    {
      id: 6,
      avatar: "/images/team3.jpg",
      name: "Albert Flores",
      modules: "SAP SD, Fiori",
      experience: "9 Years",
      hourlyRate: "$18/hour",
      projectName: "ERP Upgrade",
      meeting: "Reschedule",
    },
    {
      id: 7,
      avatar: "/images/team1.jpg",
      name: "Marvin McKinney",
      modules: "SAP MM, S/4HANA",
      experience: "9 Years",
      hourlyRate: "$15/hour",
      projectName: "ERP Upgrade",
      meeting: "Send Invite",
    },
    {
      id: 8,
      avatar: "/images/team2.jpg",
      name: "Savannah Nguyen",
      modules: "SAP SD, S/4HANA",
      experience: "9 Years",
      hourlyRate: "$20/hour",
      projectName: "ERP Upgrade",
      meeting: "Send Invite",
    },
    {
      id: 9,
      avatar: "/images/team3.jpg",
      name: "Albert Flores",
      modules: "SAP SD, Fiori",
      experience: "9 Years",
      hourlyRate: "$18/hour",
      projectName: "ERP Upgrade",
      meeting: "Reschedule",
    },
    {
      id: 10,
      avatar: "/images/team1.jpg",
      name: "Marvin McKinney",
      modules: "SAP MM, S/4HANA",
      experience: "9 Years",
      hourlyRate: "$15/hour",
      projectName: "ERP Upgrade",
      meeting: "Send Invite",
    },
    {
      id: 11,
      avatar: "/images/team2.jpg",
      name: "Savannah Nguyen",
      modules: "SAP SD, S/4HANA",
      experience: "9 Years",
      hourlyRate: "$20/hour",
      projectName: "ERP Upgrade",
      meeting: "Send Invite",
    },
    {
      id: 12,
      avatar: "/images/team3.jpg",
      name: "Albert Flores",
      modules: "SAP SD, Fiori",
      experience: "9 Years",
      hourlyRate: "$18/hour",
      projectName: "ERP Upgrade",
      meeting: "Reschedule",
    },
    {
      id: 13,
      avatar: "/images/team3.jpg",
      name: "Albert Flores",
      modules: "SAP SD, Fiori",
      experience: "9 Years",
      hourlyRate: "$18/hour",
      projectName: "ERP Upgrade",
      meeting: "Reschedule",
    },
  ];

  return (
    <>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <DataTable
          title="Hired"
          columns={consultantColumns}
          rows={consultantRows}
          pageSize={10}
          showAvatar
          avatarField="avatar"
        />
      </Box>

      <DynamicPopup
        open={scheduleOpen}
        onClose={handleCloseSchedule}
        title="Schedule meeting"
        fields={[
          {
            id: "date",
            label: "Date",
            type: "date",
            value: scheduleData.date,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setScheduleData((p) => ({ ...p, date: val }));
            },
          },
          {
            id: "time",
            label: "Time",
            type: "time",
            value: scheduleData.time,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setScheduleData((p) => ({ ...p, time: val }));
            },
          },
          {
            id: "link",
            label: "",
            type: "text",
            value: scheduleData.link,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setScheduleData((p) => ({ ...p, link: val }));
            },
            placeholder: "Meeting link",
          },
        ]}
        buttonText="Send Invite"
        buttonColor="BLUE"
        onSubmit={handleScheduleSubmit}
        disableSubmit={
          !scheduleData.date || !scheduleData.time || !scheduleData.link
        }
      />

      <DynamicPopup
        open={rescheduleOpen}
        onClose={handleCloseReschedule}
        title="Reschedule"
        fields={[
          {
            id: "date",
            label: "Date",
            type: "date",
            value: rescheduleData.date,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setRescheduleData((p) => ({ ...p, date: val }));
            },
          },
          {
            id: "time",
            label: "Time",
            type: "time",
            value: rescheduleData.time,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setRescheduleData((p) => ({ ...p, time: val }));
            },
          },
          {
            id: "link",
            label: "",
            type: "text",
            value: rescheduleData.link,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setRescheduleData((p) => ({ ...p, link: val }));
            },
            placeholder: "Meeting link",
          },
        ]}
        buttonText="Suggest"
        buttonColor="BLUE"
        onSubmit={handleRescheduleSubmit}
        disableSubmit={
          !rescheduleData.date || !rescheduleData.time || !rescheduleData.link
        }
      />
    </>
  );
}
