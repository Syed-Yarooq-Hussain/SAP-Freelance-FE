"use client";

import { useMeetingInvite } from "@/actions/common/useMeetingInvite";
import { useClientProjects } from "@/actions/projects/useClientProjects";
import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import { getInterviewFormFields } from "@/forms/interviewForm";
import type { IClientProjectDTO, MeetingForm } from "@/types/client";
import type { IProjectConsultant } from "@/types/teamBuilder";
import { mapTaskFieldsToPopup } from "@/utils/mapFormToPopup";
import { Box, Typography } from "@mui/material";
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

  useEffect(() => {
    loadProjects(undefined, {
      onSuccess: (res) => setProjects(res.data ?? []),
    });
  }, [loadProjects]);

  const interviewFields = getInterviewFormFields().map((field) => {
    if (field.name === "project") {
      return {
        ...field,
        options: projects.map((p) => ({
          label: p.name,
          value: String(p.id),
        })),
      };
    }

    if (field.name === "user") {
      return {
        ...field,
        options:
          consultants.length > 0
            ? consultants.map((c) => ({
                label: c.name,
                value: String(c.consultant_id),
              }))
            : [{ label: "No consultants available", value: "" }],
        disabled: consultants.length === 0,
        forceDisplayValue:
          consultants.length === 0 ? "No consultants available" : undefined,
      };
    }

    return field;
  });

  const handleProjectSelect = (projectId: string) => {
    setScheduleData((prev) => ({ ...prev, project: projectId, user: "" }));

    const selected = projects.find((p) => String(p.id) === projectId);
    if (!selected) return;

    loadConsultants(
      { projectId: selected.id, statuses: [] },
      { onSuccess: (res) => setConsultants(res.data ?? []) }
    );
  };

  const handleScheduleSubmit = () => {
    setLoading(true);

    const payload = {
      date_time: `${scheduleData.date} ${scheduleData.time}`,
      invitees_id: [Number(scheduleData.user)],
      duration: Number(scheduleData.duration),
      event_type: scheduleData.meeting_type.toLowerCase(),
      project_id: Number(scheduleData.project),
    };

    sendInvite(payload, {
      onSuccess: () => {
        setScheduleOpen(false);

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
          fields={mapTaskFieldsToPopup(
            interviewFields,
            scheduleData,
            (field, value) => {
              if (field === "project") handleProjectSelect(value);
              setScheduleData((prev) => ({ ...prev, [field]: value }));
            }
          )}
        />
      )}
    </Box>
  );
}
