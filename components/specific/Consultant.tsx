"use client";

import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import colors from "@/utils/styles/colors";
import { Box, Link } from "@mui/material";
import {
    GridColDef,
    GridRenderCellParams,
    GridValidRowModel,
} from "@mui/x-data-grid";
import { useState } from "react";

interface MeetingData {
  date: string;
  time: string;
  link: string;
}

interface ConsultantProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  columns: GridColDef<T>[];
  rows: T[];
  showMeetingActions?: boolean;
}

export default function Consultant<
  T extends GridValidRowModel = GridValidRowModel
>({ title, columns, rows, showMeetingActions = false }: ConsultantProps<T>) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const [scheduleData, setScheduleData] = useState<MeetingData>({
    date: "",
    time: "",
    link: "",
  });
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
    console.log("Schedule meeting data:", scheduleData);
    handleCloseSchedule();
  };
  const handleRescheduleSubmit = () => {
    console.log("Reschedule data:", rescheduleData);
    handleCloseReschedule();
  };

  const finalColumns = showMeetingActions
    ? [
        ...columns,
        {
          field: "meeting",
          headerName: "Meeting",
          flex: 1,
          renderCell: (params: GridRenderCellParams) => (
            <Link
              href="#"
              underline="hover"
              sx={{
                color:
                  params.value === "Reschedule" ? colors.BLUE : colors.GREEN,
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
      ]
    : columns;

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
          title={title}
          columns={finalColumns}
          rows={rows}
          pageSize={10}
          showAvatar
          avatarField="avatar"
        />
      </Box>

      <DynamicPopup
        open={scheduleOpen}
        onClose={handleCloseSchedule}
        title="Schedule Meeting"
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
        title="Reschedule Meeting"
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
