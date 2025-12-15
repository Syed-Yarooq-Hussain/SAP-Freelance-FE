"use client";

import { useMeetingInvite } from "@/actions/common/useMeetingInvite";
import DataTable from "@/components/DataTable";
import FilterDrawer from "@/components/FilterDrawer";
import DynamicPopup from "@/components/Popup";
import { IMeetingInviteBody } from "@/types/teamBuilder";
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
  duration: string;
}

interface ConsultantProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  columns: GridColDef<T>[];
  rows: T[];
  showMeetingActions?: boolean;
  showFilters?: boolean;
  projectId?: string | number | null;
}

export default function Consultant<
  T extends GridValidRowModel = GridValidRowModel
>({
  title,
  columns,
  rows,
  showMeetingActions = false,
  showFilters = false,
  projectId,
}: ConsultantProps<T>) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const meetingInvite = useMeetingInvite();
  const [selectedConsultantId, setSelectedConsultantId] = useState<
    number | null
  >(null);
  const [scheduleData, setScheduleData] = useState<MeetingData>({
    date: "",
    time: "",
    duration: "",
  });
  const [rescheduleData, setRescheduleData] = useState<MeetingData>({
    date: "",
    time: "",
    duration: "",
  });

  const handleCloseSchedule = () => {
    setScheduleOpen(false);
    setScheduleData({ date: "", time: "", duration: "" });
  };
  const handleCloseReschedule = () => {
    setRescheduleOpen(false);
    setRescheduleData({ date: "", time: "", duration: "" });
  };

  const handleScheduleSubmit = () => {
    if (!selectedConsultantId || !projectId) return;

    const dateTime = `${scheduleData.date} ${scheduleData.time}`;

    const body: IMeetingInviteBody = {
      date_time: dateTime,
      invitees_id: [Number(selectedConsultantId)],
      duration: Number(scheduleData.duration ?? 30),
      event_type: "meeting",
      project_id: Number(projectId),
    };

    meetingInvite.mutate(body, {
      onSuccess: () => {
        console.log("Meeting scheduled!");
        handleCloseSchedule();
      },
    });
  };

  const handleRescheduleSubmit = () => {
    if (!selectedConsultantId || !projectId) return;

    const dateTime = `${rescheduleData.date} ${rescheduleData.time}`;

    const body: IMeetingInviteBody = {
      date_time: dateTime,
      invitees_id: [Number(selectedConsultantId)],
      duration: Number(rescheduleData.duration ?? 30),
      event_type: "meeting",
      project_id: Number(projectId),
    };

    meetingInvite.mutate(body, {
      onSuccess: () => {
        console.log("Meeting rescheduled!");
        handleCloseReschedule();
      },
    });
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
                setSelectedConsultantId(Number(params.row.id));

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
            id: "duration",
            label: "Select Duration",
            placeholder: "Select duration",
            //options: INTERVIEW_DURATION_OPTIONS.map((d) => d.label),
            value: scheduleData.duration,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setScheduleData((p) => ({ ...p, duration: val }));
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
        ]}
        buttonText="Send Invite"
        buttonColor="BLUE"
        onSubmit={handleScheduleSubmit}
        disableSubmit={
          !scheduleData.date || !scheduleData.duration || !scheduleData.time
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
            id: "duration",
            label: "Select Duration",
            placeholder: "Select duration",
            //options: INTERVIEW_DURATION_OPTIONS.map((d) => d.label),
            value: rescheduleData.duration,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setRescheduleData((p) => ({ ...p, duration: val }));
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
        ]}
        buttonText="Suggest"
        buttonColor="BLUE"
        onSubmit={handleRescheduleSubmit}
        disableSubmit={
          !rescheduleData.date ||
          !rescheduleData.time ||
          !rescheduleData.duration
        }
      />
    </>
  );
}
