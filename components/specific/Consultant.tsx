"use client";

import { useMeetingInvite } from "@/actions/common/useMeetingInvite";
import DataTable from "@/components/DataTable";
import FilterDrawer from "@/components/FilterDrawer";
import DynamicPopup from "@/components/Popup";
import { getTeamInterviewFormFields } from "@/forms/teamInterviewForm";
import { mapTaskFieldsToPopup } from "@/utils/mapFormToPopup";
import colors from "@/utils/styles/colors";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Divider, Link, Typography } from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useState } from "react";
import AppButton from "../Button";

type ConsultantTabKey = "active" | "pending" | "locked";

interface ConsultantProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  columns: GridColDef<T>[];
  rows: T[];
  showMeetingActions?: boolean;
  showFilters?: boolean;
  projectId?: string | number | null;
  showTabs?: boolean;
  activeTab?: ConsultantTabKey;
  onTabChange?: (tab: ConsultantTabKey) => void;
  autoRowHeight?: boolean;
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
  showTabs = false,
  onTabChange,
  activeTab,
  autoRowHeight = false,
}: ConsultantProps<T>) {
  const norm = (v: unknown) => String(v ?? "").toLowerCase();
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

  const handleFilter = (filters:any) => {
    console.log(filters,'filters');
  };

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

        {showTabs && (
          <>
            <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
              <AppButton
                label="Active"
                colorKey="BLUE"
                variant={activeTab === "active" ? "contained" : "outlined"}
                onClick={() => onTabChange?.("active")}
                width={150}
              />
              <AppButton
                label="Pending"
                colorKey="BLUE"
                variant={activeTab === "pending" ? "contained" : "outlined"}
                onClick={() => onTabChange?.("pending")}
                width={150}
              />
              <AppButton
                label="Locked"
                colorKey="BLUE"
                variant={activeTab === "locked" ? "contained" : "outlined"}
                onClick={() => onTabChange?.("locked")}
                width={150}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />
          </>
        )}
        <DataTable
          title={showFilters ? "" : title}
          columns={finalColumns}
          rows={rows}
          pageSize={10}
          showAvatar
          avatarField="avatar"
          autoRowHeight={autoRowHeight}
        />
      </Box>

      {showFilters && (
        <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} onApply={(filters:any) => handleFilter(filters)} />
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
