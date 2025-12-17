"use client";

import { useMeetingInvite } from "@/actions/common/useMeetingInvite";
import DataTable from "@/components/DataTable";
import FilterDrawer from "@/components/FilterDrawer";
import DynamicPopup from "@/components/Popup";
import { getTeamInterviewFormFields } from "@/forms/teamInterviewForm";
import { mapTaskFieldsToPopup } from "@/utils/mapFormToPopup";
import colors from "@/utils/styles/colors";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Link, Typography } from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useState } from "react";

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
  const [meetingData, setMeetingData] = useState<Record<string, string>>({
    date: "",
    time: "",
    duration: "",
  });

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
        onClose={() => {
          setScheduleOpen(false);
          setMeetingData({ date: "", time: "", duration: "" });
        }}
        title="Schedule Meeting"
        fields={mapTaskFieldsToPopup(
          getTeamInterviewFormFields(),
          meetingData,
          (field, value) =>
            setMeetingData((prev) => ({ ...prev, [field]: value }))
        )}
        buttonText="Send Invite"
        buttonColor="BLUE"
        disableSubmit={
          !meetingData.date || !meetingData.time || !meetingData.duration
        }
        onSubmit={() => {
          if (!selectedConsultantId || !projectId) return;

          const dateTime = `${meetingData.date} ${meetingData.time}`;

          meetingInvite.mutate(
            {
              date_time: dateTime,
              invitees_id: [Number(selectedConsultantId)],
              duration: Number(meetingData.duration),
              event_type: "meeting",
              project_id: Number(projectId),
            },
            {
              onSuccess: () => {
                setScheduleOpen(false);
                setMeetingData({ date: "", time: "", duration: "" });
              },
            }
          );
        }}
      />

      <DynamicPopup
        open={rescheduleOpen}
        onClose={() => {
          setRescheduleOpen(false);
          setMeetingData({ date: "", time: "", duration: "" });
        }}
        title="Reschedule Meeting"
        fields={mapTaskFieldsToPopup(
          getTeamInterviewFormFields(),
          meetingData,
          (field, value) =>
            setMeetingData((prev) => ({ ...prev, [field]: value }))
        )}
        buttonText="Suggest"
        buttonColor="BLUE"
        disableSubmit={
          !meetingData.date || !meetingData.time || !meetingData.duration
        }
        onSubmit={() => {
          if (!selectedConsultantId || !projectId) return;

          const dateTime = `${meetingData.date} ${meetingData.time}`;

          meetingInvite.mutate(
            {
              date_time: dateTime,
              invitees_id: [Number(selectedConsultantId)],
              duration: Number(meetingData.duration),
              event_type: "meeting",
              project_id: Number(projectId),
            },
            {
              onSuccess: () => {
                setRescheduleOpen(false);
                setMeetingData({ date: "", time: "", duration: "" });
              },
            }
          );
        }}
      />
    </>
  );
}
