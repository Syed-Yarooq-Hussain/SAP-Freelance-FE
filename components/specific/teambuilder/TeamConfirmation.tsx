"use client";

import { useMeetingInvite } from "@/actions/common/useMeetingInvite";
import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import { useUpdateConsultantStatus } from "@/actions/projects/useUpdateConsultantStatus";
import { AssignedRolePopup } from "@/components/AssignedRolePopup";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import RoleHierarchy from "@/components/RoleHierarchy";
import { CONSULTANT_STATUS } from "@/constants/status";
import { STATUS } from "@/constants/status_dropdown";
import { INTERVIEW_DURATION_OPTIONS } from "@/data/options";
import { getCandidateColumns, getShortlistedColumns } from "@/data/teamBuilder";
import type {
  CandidateRow,
  IProjectConsultant,
  ShortlistedRow,
  TeamConfirmationProps,
} from "@/types/teamBuilder";
import { normalizeStatus } from "@/utils/normalizeStatus";
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

  const refreshEverything = () => {
    if (!projectId) return;

    getProjectConsultants.mutate(
      {
        projectId,
        statuses: [
          CONSULTANT_STATUS.SHORTLISTED,
          CONSULTANT_STATUS.INTERVIEW_SCHEDULE,
          CONSULTANT_STATUS.INTERVIEWED,
          CONSULTANT_STATUS.OFFERED,
          CONSULTANT_STATUS.HIRED,
          CONSULTANT_STATUS.REJECTED,
        ],
      },
      {
        onSuccess: (res) => {
          const all = res.data ?? [];

          const { shortlisted, candidates } = fullMap(all);

          setShortlisted(shortlisted);
          setCandidates(candidates);
        },
      }
    );
  };

  const fullMap = (list: IProjectConsultant[]) => {
    const shortlisted: ShortlistedRow[] = [];
    const candidates: CandidateRow[] = [];

    list.forEach((item) => {
      const core = item.modules?.core || "N/A";
      const others = item.modules?.others || "N/A";
      const experience = `${item.experience} Years`;
      const hourlyRate = `$${item.rate}/hour`;

      if (
        item.status === CONSULTANT_STATUS.SHORTLISTED ||
        item.status === CONSULTANT_STATUS.INTERVIEW_SCHEDULE
      ) {
        shortlisted.push({
          id: item.consultant_id,
          coremodules: core,
          othersmodules: others,
          experience,
          hourlyRate,
          status: normalizeStatus(item.status),
          interview: item.booking_schedule
            ? normalizeStatus(item.booking_schedule.status)
            : STATUS.REQUEST,
        });
      }

      const candidateStatuses: string[] = [
        CONSULTANT_STATUS.INTERVIEW_SCHEDULE,
        CONSULTANT_STATUS.INTERVIEWED,
        CONSULTANT_STATUS.OFFERED,
        CONSULTANT_STATUS.HIRED,
        CONSULTANT_STATUS.REJECTED,
      ];

      if (candidateStatuses.includes(item.status)) {
        candidates.push({
          id: Number(item.consultant_id),
          avatar: "/img/u1.png",
          name: item.name,
          coremodules: core || "N/A",
          othersmodules: others || "N/A",
          experience,
          hourlyRate,
          signed: item.is_doc_signed ? "Yes" : "No",
          role: item.role ?? undefined,
        });
      }
    });

    return { shortlisted, candidates };
  };

  const refreshAllData = () => {
    if (!projectId) return;

    getProjectConsultants.mutate(
      {
        projectId,
        statuses: [
          CONSULTANT_STATUS.SHORTLISTED,
          CONSULTANT_STATUS.INTERVIEW_SCHEDULE,
        ],
      },
      {
        onSuccess: (res) => {
          const { shortlisted, candidates } = mapConsultants(res.data ?? []);
          setShortlisted(shortlisted);
          setCandidates(candidates);
        },
      }
    );
  };

  const getCandidatesList = useCallback(() => {
    if (!projectId) return;

    getProjectConsultants.mutate(
      {
        projectId,
        statuses: [
          CONSULTANT_STATUS.OFFERED,
          CONSULTANT_STATUS.HIRED,
          CONSULTANT_STATUS.REJECTED,
          CONSULTANT_STATUS.INTERVIEWED,
          CONSULTANT_STATUS.INTERVIEW_SCHEDULE,
        ],
      },
      {
        onSuccess: (res) => {
          const mapped = mapCandidateOnly(res.data ?? []);
          setCandidates(mapped);
        },
      }
    );
  }, [projectId, getProjectConsultants]);

  const mapCandidateOnly = (list: IProjectConsultant[]): CandidateRow[] => {
    return list.map((item) => ({
      id: Number(item.consultant_id),
      avatar: "/img/u1.png",
      name: item.name,
      coremodules: item.modules?.core ?? "N/A",
      othersmodules: item.modules?.others ?? "N/A",
      experience: `${item.experience} Years`,
      hourlyRate: `$${item.rate}/hour`,
      signed: item.is_doc_signed ? "Yes" : "No",
      role: item.role ?? undefined,
      status: item.status,
      working_schedule: item.working_schedule,
    }));
  };

  const mapConsultants = (list: IProjectConsultant[]) => {
    const shortlisted: ShortlistedRow[] = [];
    const candidates: CandidateRow[] = [];

    list.forEach((item) => {
      const core = item.modules?.core || "N/A";
      const others = item.modules?.others || "N/A";
      const experience = `${item.experience} Years`;
      const hourlyRate = `$${item.rate}/hour`;

      if (
        item.status === CONSULTANT_STATUS.SHORTLISTED ||
        item.status === CONSULTANT_STATUS.INTERVIEW_SCHEDULE
      ) {
        shortlisted.push({
          id: item.consultant_id,
          coremodules: core,
          othersmodules: others,
          experience,
          hourlyRate,
          status: normalizeStatus(item.status),
          interview: item.booking_schedule
            ? normalizeStatus(item.booking_schedule.status)
            : STATUS.REQUEST,
        });
      }

      if (
        item.status === CONSULTANT_STATUS.INTERVIEWED ||
        item.status === CONSULTANT_STATUS.INTERVIEW_SCHEDULE
      ) {
        candidates.push({
          id: Number(item.consultant_id),
          avatar: "/img/u1.png",
          name: item.name,
          coremodules: core || "N/A",
          othersmodules: others || "N/A",
          experience,
          hourlyRate,
          signed: item.is_doc_signed ? "Yes" : "No",
          role: item.role ?? undefined,
        });
      }
    });

    return { shortlisted, candidates };
  };

  useEffect(() => {
    if (!projectId) return;
    getCandidatesList();
    getProjectConsultants.mutate(
      {
        projectId,
        statuses: [
          CONSULTANT_STATUS.SHORTLISTED,
          CONSULTANT_STATUS.INTERVIEW_SCHEDULE,
        ],
      },
      {
        onSuccess: (res) => {
          const { shortlisted, candidates } = mapConsultants(res.data ?? []);
          setShortlisted(shortlisted);
          setCandidates(candidates);
        },
      }
    );

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
          refreshAllData();
        }}
        onAssign={(role) => {
          if (!selectedRow) return;

          updateConsultantStatus.mutate(
            {
              consultant_id: selectedRow.id,
              project_id: String(projectId),
              status: CONSULTANT_STATUS.OFFERED,
              role: role,
              booking_schedule: selectedRow.working_schedule
                ? {
                    weekdays: selectedRow.working_schedule.weekdays.map(
                      (day) => ({
                        day: day.day,
                        start: day.start,
                        end: day.end,
                        active: day.active,
                      })
                    ),
                  }
                : undefined,
            },
            {
              onSuccess: () => {
                setAssignRoleOpen(false);
                getCandidatesList();
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
          if (!selectedRow) return;

          updateConsultantStatus.mutate(
            {
              consultant_id: selectedRow.id,
              project_id: String(projectId),
              status: CONSULTANT_STATUS.REJECTED,
              role: selectedRow.role ?? "",
              booking_schedule: selectedRow.working_schedule
                ? {
                    weekdays: selectedRow.working_schedule.weekdays.map(
                      (d) => ({
                        day: d.day,
                        start: d.start,
                        end: d.end,
                        active: d.active,
                      })
                    ),
                  }
                : undefined,
            },
            {
              onSuccess: () => {
                setRejectConfirmOpen(false);
                getCandidatesList();
              },
            }
          );
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
            options: INTERVIEW_DURATION_OPTIONS,
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
              project_id: Number(projectId),
            },
            {
              onSuccess: () => {
                setInterviewOpen(false);

                refreshEverything();
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
