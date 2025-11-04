"use client";

import DataTable from "@/components/DataTable";
import FilterDrawer from "@/components/FilterDrawer";
import DynamicPopup from "@/components/Popup";
import colors from "@/utils/styles/colors";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Link, Typography } from "@mui/material";
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
  showFilters?: boolean;
}

export default function Consultant<
  T extends GridValidRowModel = GridValidRowModel
>({
  title,
  columns,
  rows,
  showMeetingActions = false,
  showFilters = false,
}: ConsultantProps<T>) {
  const [filterOpen, setFilterOpen] = useState(false);
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
        {showFilters && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>

            <Button
              onClick={() => setFilterOpen(true)}
              startIcon={<FilterListIcon />}
              sx={{
                border: `1px solid ${colors.BLUE}`,
                color: colors.BLUE,
                textTransform: "none",
                borderRadius: "50px",
                fontWeight: 500,
                px: 2,
                py: 0.5,
                fontSize: "0.875rem",
                bgcolor: "white",
                "&:hover": {
                  bgcolor: `${colors.BLUE}10`,
                  borderColor: colors.BLUE,
                },
                boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
              }}
            >
              Filters
            </Button>
          </Box>
        )}

        <DataTable
          title={showFilters ? "" : title}
          columns={finalColumns}
          rows={rows}
          pageSize={10}
          showAvatar
          avatarField="avatar"
        />
      </Box>

      {showFilters && (
        <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
      )}

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
