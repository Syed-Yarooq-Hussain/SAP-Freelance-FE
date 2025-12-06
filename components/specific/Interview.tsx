"use client";

import { useMeetingInvite } from "@/actions/common/useMeetingInvite";
import { useClientProjects } from "@/actions/projects/useClientProjects";
import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import { INTERVIEW_DURATION_OPTIONS } from "@/data/options";
import type { IClientProjectDTO, MeetingForm } from "@/types/client";
import type { IProjectConsultant } from "@/types/teamBuilder";
import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import AppButton from "../Button";

interface InterviewProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  stats: StatCardProps[];
  rows: T[];
  columns?: GridColDef<T>[];
  getColumns?: (onRescheduleClick: () => void) => GridColDef<T>[];
  rescheduleEnabled?: boolean;
  onRefresh?: () => void;
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
  onRefresh,
}: InterviewProps<T>) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<IClientProjectDTO[]>([]);
  const [consultants, setConsultants] = useState<IProjectConsultant[]>([]);
  const [scheduleData, setScheduleData] = useState<MeetingForm>({
    project: "",
    user: "",
    date: "",
    time: "",
    duration: "",
    meeting_type: "",
  });

  const { mutate: loadProjects } = useClientProjects();
  const { mutate: loadConsultants } = useGetProjectConsultants();
  const { mutate: sendInvite } = useMeetingInvite();
  const meetingTypes = ["Interview", "Meeting"];

  useEffect(() => {
    loadProjects(undefined, {
      onSuccess: (res) => setProjects(res.data ?? []),
      onError: () => {},
    });
  }, [loadProjects]);

  const handleProjectSelect = (projectId: string) => {
    setScheduleData((p) => ({ ...p, project: projectId, user: "" }));

    const selectedProject = projects.find((p) => String(p.id) === projectId);
    if (!selectedProject) return;

    loadConsultants(
      { projectId: selectedProject.id, statuses: [] },
      {
        onSuccess: (res) => setConsultants(res.data ?? []),
        onError: () => {},
      }
    );
  };

  const buildPayload = () => {
    const date_time = `${scheduleData.date} ${scheduleData.time}`;
    const durationNumber = parseInt(scheduleData.duration);

    return {
      date_time,
      invitees_id: [Number(scheduleData.user)],
      duration: durationNumber,
      event_type: scheduleData.meeting_type.toLowerCase(),
      project_id: Number(scheduleData.project),
    };
  };

  const handleScheduleSubmit = () => {
    setLoading(true);
    const payload = buildPayload();

    sendInvite(payload, {
      onSuccess: () => {
        setTimeout(() => {
          setScheduleOpen(false);
        }, 200);

        setScheduleData({
          project: "",
          user: "",
          date: "",
          time: "",
          duration: "",
          meeting_type: "",
        });

        onRefresh?.();
      },
      onError: () => {},
      onSettled: () => setLoading(false),
    });
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>

          {rescheduleEnabled && (
            <AppButton
              label="Schedule Meeting"
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
          onClose={() => setScheduleOpen(false)}
          title="Schedule Meeting"
          buttonText={loading ? "Sending..." : "Send invite"}
          buttonColor="BLUE"
          onSubmit={handleScheduleSubmit}
          disableSubmit={
            loading ||
            !scheduleData.project ||
            !scheduleData.user ||
            !scheduleData.date ||
            !scheduleData.time ||
            !scheduleData.duration ||
            !scheduleData.meeting_type
          }
        >
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Project"
                  value={scheduleData.project}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                    select: {
                      displayEmpty: true,
                      renderValue: (selected: unknown) =>
                        selected ? (
                          projects.find(
                            (p) => String(p.id) === String(selected)
                          )?.name
                        ) : (
                          <span style={{ color: "#9CA3AF" }}>
                            Select project
                          </span>
                        ),
                    },
                  }}
                >
                  <MenuItem value="">
                    <span style={{ color: "#9CA3AF" }}>Select project</span>
                  </MenuItem>

                  {projects.map((proj) => (
                    <MenuItem key={proj.id} value={proj.id}>
                      {proj.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="User Name"
                  disabled={consultants.length === 0}
                  value={scheduleData.user}
                  onChange={(e) =>
                    setScheduleData((p) => ({ ...p, user: e.target.value }))
                  }
                  slotProps={{
                    inputLabel: { shrink: true },
                    select: {
                      displayEmpty: true,
                      renderValue: (selected: unknown) =>
                        selected ? (
                          consultants.find(
                            (c) => String(c.consultant_id) === String(selected)
                          )?.name
                        ) : (
                          <span style={{ color: "#9CA3AF" }}>
                            {consultants.length === 0
                              ? "No consultants"
                              : "Select user"}
                          </span>
                        ),
                    },
                  }}
                >
                  <MenuItem value="">
                    <span style={{ color: "#9CA3AF" }}>
                      {consultants.length === 0
                        ? "No consultants"
                        : "Select user"}
                    </span>
                  </MenuItem>

                  {consultants.map((c) => (
                    <MenuItem key={c.consultant_id} value={c.consultant_id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
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
                  size="small"
                  label="Time"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={scheduleData.time}
                  onChange={(e) =>
                    setScheduleData((p) => ({ ...p, time: e.target.value }))
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Duration"
                  value={scheduleData.duration}
                  onChange={(e) =>
                    setScheduleData((p) => ({ ...p, duration: e.target.value }))
                  }
                  slotProps={{
                    inputLabel: { shrink: true },
                    select: {
                      displayEmpty: true,
                      renderValue: (selected: unknown) =>
                        selected ? (
                          (selected as string)
                        ) : (
                          <span style={{ color: "#9CA3AF" }}>
                            Select duration
                          </span>
                        ),
                    },
                  }}
                >
                  <MenuItem value="">
                    <span style={{ color: "#9CA3AF" }}>Select duration</span>
                  </MenuItem>

                  {INTERVIEW_DURATION_OPTIONS.map((d) => (
                    <MenuItem key={d.value} value={d.value}>
                      {d.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Meeting"
                  value={scheduleData.meeting_type}
                  onChange={(e) =>
                    setScheduleData((p) => ({
                      ...p,
                      meeting_type: e.target.value,
                    }))
                  }
                  slotProps={{
                    inputLabel: { shrink: true },
                    select: {
                      displayEmpty: true,
                      renderValue: (selected: unknown) =>
                        selected ? (
                          (selected as string)
                        ) : (
                          <span style={{ color: "#9CA3AF" }}>
                            Select meeting type
                          </span>
                        ),
                    },
                  }}
                >
                  <MenuItem value="">
                    <span style={{ color: "#9CA3AF" }}>
                      Select meeting type
                    </span>
                  </MenuItem>

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
