"use client";

import { useMeetingInvite } from "@/actions/common/useMeetingInvite";
import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import { useUpdateConsultantStatus } from "@/actions/projects/useUpdateConsultantStatus";
import { AssignedRolePopup } from "@/components/AssignedRolePopup";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import RoleHierarchy from "@/components/RoleHierarchy";
import { STATUS } from "@/constants/status_dropdown";
import { INTERVIEW_DURATION_OPTIONS } from "@/data/options";
import { getCandidateColumns, getShortlistedColumns } from "@/data/teamBuilder";
import type {
  CandidateRow,
  IProjectConsultant,
  ShortlistedRow,
  TeamConfirmationProps,
} from "@/types/teamBuilder";
import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function TeamConfirmation({
  onNext,
  projectId,
}: TeamConfirmationProps) {
  const [shortlisted, setShortlisted] = useState<ShortlistedRow[]>([]);
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const getProjectConsultants = useGetProjectConsultants();
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CandidateRow | null>(null);
  const meetingInvite = useMeetingInvite();
  const updateConsultantStatus = useUpdateConsultantStatus();
  const [selectedConsultantId, setSelectedConsultantId] = useState<
    string | number | null
  >(null);

  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    link: "",
    duration: "",
  });

  const rejectCandidate = useCallback((row: CandidateRow): void => {
    setCandidates((prev) => prev.filter((r) => r.id !== row.id));
  }, []);

  const shortlistedColumns = useMemo(
    () =>
      getShortlistedColumns(
        (id: string | number) => setSelectedConsultantId(id),
        setInterviewOpen
      ),
    [setInterviewOpen]
  );

  const candidateColumns = useMemo(
    () =>
      getCandidateColumns(
        (row: CandidateRow) => {
          setSelectedRow(row);
          setAssignRoleOpen(true);
        },
        (row: CandidateRow) => {
          setSelectedRow(row);
          setRejectConfirmOpen(true);
        }
      ),
    []
  );

  const mapConsultants = (list: IProjectConsultant[]) => {
    const shortlisted: ShortlistedRow[] = list.map((item) => ({
      id: item.consultant_id,
      modules: "N/A",
      experience: item.user.consultants?.experience
        ? `${item.user.consultants.experience} Years`
        : "N/A",
      hourlyRate: item.user.consultants?.rate
        ? `$${item.user.consultants.rate}/hour`
        : "N/A",
      status: STATUS.SHORTLISTED,
      interview: "Request",
    }));

    const candidates: CandidateRow[] = list.map((item) => ({
      id: Number(item.consultant_id),
      avatar: "/img/u1.png",
      name: item.user.username,
      modules: "N/A",
      experience: item.user.consultants?.experience
        ? `${item.user.consultants.experience} Years`
        : "N/A",
      hourlyRate: item.user.consultants?.rate
        ? `$${item.user.consultants.rate}/hour`
        : "N/A",
      signed: item.is_joic_signed ? "Yes" : "No",
      role: item.role ?? undefined,
    }));

    return { shortlisted, candidates };
  };

  useEffect(() => {
    if (!projectId) return;

    getProjectConsultants.mutate(projectId, {
      onSuccess: (res) => {
        const list = (res.data ?? []) as IProjectConsultant[];
        const { shortlisted, candidates } = mapConsultants(list);
        setShortlisted(shortlisted);
        setCandidates(candidates);
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <>
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
          bgcolor: "background.paper",
          mt: 3,
        }}
      >
        <DataTable<ShortlistedRow>
          title="Short-listed Candidate"
          columns={shortlistedColumns}
          rows={shortlisted}
          pageSize={6}
        />
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
          bgcolor: "background.paper",
          mt: 3,
        }}
      >
        <DataTable<CandidateRow>
          title="Candidates"
          columns={candidateColumns}
          rows={candidates}
          pageSize={6}
          showAvatar
          avatarField="avatar"
        />
      </Box>

      <RoleHierarchy />

      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.95rem" }}
        >
          2 hired
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AppButton label="Discard" colorKey="RED" width={180} />
          <AppButton
            label="Proceed to next step"
            colorKey="BLUE"
            width={180}
            onClick={() => onNext?.(projectId!)}
          />
        </Box>
      </Box>

      <AssignedRolePopup
        open={assignRoleOpen}
        onClose={() => setAssignRoleOpen(false)}
        row={selectedRow}
        projectId={projectId!}
        onUpdated={() => {
          getProjectConsultants.mutate(projectId!, {
            onSuccess: (res) => {
              const list = res.data ?? [];
              const { shortlisted, candidates } = mapConsultants(list);

              setShortlisted(shortlisted);
              setCandidates(candidates);
            },
          });
        }}
        onAssign={(role) => {
          if (!selectedRow) return;

          updateConsultantStatus.mutate(
            {
              consultant_id: selectedRow.id,
              project_id: String(projectId),
              status: "active",
              role,
            },
            {
              onSuccess: () => {
                setAssignRoleOpen(false);

                getProjectConsultants.mutate(projectId!, {
                  onSuccess: (res) => {
                    const list = res.data ?? [];
                    const { shortlisted, candidates } = mapConsultants(list);

                    setShortlisted(shortlisted);
                    setCandidates(candidates);
                  },
                });
              },
            }
          );
        }}
      />

      <DynamicPopup
        open={rejectConfirmOpen}
        onClose={() => setRejectConfirmOpen(false)}
        title="Confirm Rejection"
        description="Are you sure you want to reject this candidate?"
        buttonText="Yes, Reject"
        buttonColor="RED"
        onSubmit={() => {
          if (selectedRow) rejectCandidate(selectedRow);
          setRejectConfirmOpen(false);
        }}
      />

      <DynamicPopup
        open={interviewOpen}
        onClose={() => setInterviewOpen(false)}
        title="Request Interview"
        fields={[
          {
            id: "date",
            label: "Date",
            type: "date",
            value: interviewData.date,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setInterviewData((p) => ({ ...p, date: val }));
            },
          },
          {
            id: "duration",
            label: "Select Duration",
            placeholder: "Select duration",
            options: INTERVIEW_DURATION_OPTIONS.map((d) => d.label),
            value: interviewData.duration,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setInterviewData((p) => ({ ...p, duration: val }));
            },
          },
          {
            id: "time",
            label: "Time",
            type: "time",
            value: interviewData.time,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setInterviewData((p) => ({ ...p, time: val }));
            },
          },
        ]}
        buttonText="Assign Interview"
        buttonColor="BLUE"
        onSubmit={() => {
          if (!selectedConsultantId) return;

          const dateTime = `${interviewData.date} ${interviewData.time}`;

          meetingInvite.mutate(
            {
              date_time: dateTime,
              invitees_id: [Number(selectedConsultantId)],
              duration: Number(interviewData.duration),
              event_type: "interview",
            },
            {
              onSuccess: () => {
                setInterviewOpen(false);
              },
            }
          );
        }}
        disableSubmit={
          !interviewData.date || !interviewData.time || !interviewData.duration
        }
      />
    </>
  );
}
