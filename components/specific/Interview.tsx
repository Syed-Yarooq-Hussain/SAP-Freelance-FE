"use client";

import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import AppButton from "../Button";

interface MeetingForm {
  project: string;
  user: string;
  date: string;
  time: string;
  meeting_type: string;
}

interface InterviewProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  stats: StatCardProps[];
  rows: T[];
  columns?: GridColDef<T>[];
  getColumns?: (onRescheduleClick: () => void) => GridColDef<T>[];
  rescheduleEnabled?: boolean;
}

export default function Interview<
  T extends GridValidRowModel = GridValidRowModel
>({
  title,
  stats,
  rows,
  columns,
  getColumns,
  rescheduleEnabled = false,
}: InterviewProps<T>) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState<MeetingForm>({
    project: "",
    user: "",
    date: "",
    time: "",
    meeting_type: "",
  });
  const projects = ["Project A", "Project B", "Project C"];
  const users = ["Ameed Ghauri", "Ahmed Khan", "John Doe"];
  const meetingTypes = ["Google Meet", "Microsoft Teams", "Zoom", "Webex"];

  const handleScheduleSubmit = () => {
    console.log("SENDING MEETING INVITE", scheduleData);
    setScheduleOpen(false);

    setScheduleData({
      project: "",
      user: "",
      date: "",
      time: "",
      meeting_type: "",
    });
  };

  const handleCloseSchedule = () => {
    setScheduleOpen(false);
  };

  const resolvedColumns = useMemo(() => {
    if (getColumns) return getColumns(() => setScheduleOpen(true));
    return columns || [];
  }, [getColumns, columns]);

  return (
    <Box>
      <DashboardStats stats={stats} containerProps={{ marginBottom: "30px" }} />

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>

          {rescheduleEnabled && (
            <AppButton
              label="Schedule meeting"
              colorKey="BLUE"
              width={180}
              onClick={() => setScheduleOpen(true)}
            />
          )}
        </Box>

        <DataTable
          title=""
          columns={resolvedColumns}
          rows={rows}
          pageSize={10}
        />
      </Box>

      {rescheduleEnabled && (
        <DynamicPopup
          open={scheduleOpen}
          onClose={handleCloseSchedule}
          title="Schedule meeting"
          buttonText="Send invite"
          buttonColor="BLUE"
          onSubmit={handleScheduleSubmit}
          disableSubmit={
            !scheduleData.project ||
            !scheduleData.user ||
            !scheduleData.date ||
            !scheduleData.time ||
            !scheduleData.meeting_type
          }
        >
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Project"
                  value={scheduleData.project}
                  onChange={(e) =>
                    setScheduleData((p) => ({ ...p, project: e.target.value }))
                  }
                >
                  {projects.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="User Name"
                  value={scheduleData.user}
                  onChange={(e) =>
                    setScheduleData((p) => ({ ...p, user: e.target.value }))
                  }
                >
                  {users.map((u) => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={scheduleData.date}
                  onChange={(e) =>
                    setScheduleData((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={scheduleData.time}
                  onChange={(e) =>
                    setScheduleData((p) => ({ ...p, time: e.target.value }))
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  select
                  label="Meeting"
                  value={scheduleData.meeting_type}
                  onChange={(e) =>
                    setScheduleData((p) => ({
                      ...p,
                      meeting_type: e.target.value,
                    }))
                  }
                >
                  {meetingTypes.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DynamicPopup>
      )}
    </Box>
  );
}
