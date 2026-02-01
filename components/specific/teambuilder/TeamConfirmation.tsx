"use client";

import { useUpdateMeetingStatus } from "@/actions/common/useClientMeetings";
import { useMeetingInvite } from "@/actions/common/useMeetingInvite";
import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import { useUpdateConsultantStatus } from "@/actions/projects/useUpdateConsultantStatus";
import { AssignedRolePopup } from "@/components/AssignedRolePopup";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import InterviewDateTimePicker from "@/components/InterviewDateTimePicker";
import DynamicPopup from "@/components/Popup";
import RoleHierarchy from "@/components/RoleHierarchy";
import { CONSULTANT_STATUS } from "@/constants/status";
import { STATUS } from "@/constants/status_dropdown";
import { INTERVIEW_DURATION_OPTIONS } from "@/data/options";
import { getCandidateColumns, getShortlistedColumns } from "@/data/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import type {
  CandidateRow,
  IProjectConsultant,
  ShortlistedRow,
  TeamConfirmationProps,
} from "@/types/teamBuilder";
import dayjs from "@/utils/dayjs";
import { normalizeStatus } from "@/utils/normalizeStatus";
import { normalizeWorkingSchedule } from "@/utils/normalizeWorkingSchedule";
import { useProjectProgress } from "@/utils/useProjectProgress";
import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function TeamConfirmation({
  onNext,
  projectId,
  onDiscard,
}: TeamConfirmationProps) {
  type InterviewMode = "request" | "reschedule";
  const [shortlisted, setShortlisted] = useState<ShortlistedRow[]>([]);
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const getProjectConsultants = useGetProjectConsultants();
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CandidateRow | null>(null);
  const [interviewMode, setInterviewMode] = useState<InterviewMode>("request");
  const meetingInvite = useMeetingInvite();
  const updateConsultantStatus = useUpdateConsultantStatus();
  const { markStepCompleted, isStepCompleted } = useProjectProgress();
  const [step2Completed, setStep2Completed] = useState(false);
  const [selectedConsultantId, setSelectedConsultantId] = useState<
    string | number | null
  >(null);

  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    link: "",
    duration: "",
  });

  const updateMeetingStatus = useUpdateMeetingStatus();
  const { toast } = useToast();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(
    null
  );
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
  });
  const [consultantScheduleMap, setConsultantScheduleMap] = useState<
    Record<string | number, IProjectConsultant["working_schedule"]>
  >({});

  const shortlistedColumns = useMemo(
    () =>
      getShortlistedColumns(
        (consultantId) => {
          setSelectedConsultantId(consultantId);
          refreshEverything();
          setInterviewMode("request");
          setInterviewOpen(true);
        },

        (meetingId, interviewDateTime, consultantId) => {
          setSelectedMeetingId(meetingId);
          setSelectedConsultantId(consultantId);
          setInterviewMode("reschedule");

          if (interviewDateTime) {
            const dt = dayjs(interviewDateTime).local();

            setInterviewData({
              date: dt.format("YYYY-MM-DD"),
              time: dt.format("HH:mm"),
              duration: "",
              link: "",
            });
          }

          setInterviewOpen(true);
        },

        (meetingId) => {
          setSelectedMeetingId(meetingId);
          setCancelConfirmOpen(true);
        }
      ),
    []
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

  const hasHired = useMemo(() => {
    return candidates.some((c) => c.status === CONSULTANT_STATUS.OFFERED);
  }, [candidates]);

  const hiredCount = useMemo(() => {
    return candidates.filter((c) => c.status === CONSULTANT_STATUS.OFFERED)
      .length;
  }, [candidates]);

  useEffect(() => {
    if (!projectId) return;
    setStep2Completed(isStepCompleted(projectId, 2));
  }, [projectId]);

  useEffect(() => {
    if (projectId && hasHired) {
      markStepCompleted(projectId, 2);
      setStep2Completed(true);
    }
  }, [hasHired, projectId]);

  const canProceed = hasHired || step2Completed;

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

          const scheduleMap: Record<
            string | number,
            IProjectConsultant["working_schedule"]
          > = {};

          all.forEach((item) => {
            scheduleMap[item.consultant_id] = item.working_schedule;
          });

          setConsultantScheduleMap(scheduleMap);

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
          meetingId: item.meeting_id ?? null,
          coremodules: core,
          othersmodules: others,
          experience,
          hourlyRate,
          status: normalizeStatus(item.status),
          interview: item.booking_schedule
            ? normalizeStatus(item.booking_schedule.status)
            : STATUS.REQUEST,
          interviewDateTime: item.interview_date ?? null,
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
          avatar: "/public/vercel.svg",
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
      avatar: "/public/vercel.svg",
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
          meetingId: item.meeting_id ?? null,
          coremodules: core,
          othersmodules: others,
          experience,
          hourlyRate,
          status: normalizeStatus(item.status),
          interview: item.booking_schedule
            ? normalizeStatus(item.booking_schedule.status)
            : STATUS.REQUEST,
          interviewDateTime: item.interview_date ?? null,
        });
      }

      if (
        item.status === CONSULTANT_STATUS.INTERVIEWED ||
        item.status === CONSULTANT_STATUS.INTERVIEW_SCHEDULE
      ) {
        candidates.push({
          id: Number(item.consultant_id),
          avatar: "/public/vercel.svg",
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

  const handleInterviewSubmit = () => {
    const dateTime =
      interviewMode === "request"
        ? `${interviewData.date} ${interviewData.time}`
        : `${interviewData.date}T${interviewData.time}:00Z`;

    if (interviewMode === "request") {
      if (!selectedConsultantId) return;

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
            toast("Interview assigned successfully", "success");
            setInterviewOpen(false);
            refreshEverything();
          },
          onError: (err) => toast(err.message, "error"),
        }
      );

      return;
    }

    if (interviewMode === "reschedule") {
      if (!selectedMeetingId) return;

      updateMeetingStatus.mutate(
        {
          meetingId: selectedMeetingId,
          status: "Rescheduled",
          date_time: dateTime,
        },
        {
          onSuccess: () => {
            toast("Interview rescheduled successfully", "success");
            setInterviewOpen(false);
            refreshEverything();
          },
          onError: (err) => toast(err.message, "error"),
        }
      );
    }
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
          const list = res.data ?? [];

          const scheduleMap: Record<
            string | number,
            IProjectConsultant["working_schedule"]
          > = {};

          list.forEach((item) => {
            scheduleMap[item.consultant_id] = item.working_schedule;
          });

          setConsultantScheduleMap(scheduleMap);

          const { shortlisted, candidates } = mapConsultants(list);
          setShortlisted(shortlisted);
          setCandidates(candidates);
        },
      }
    );
  }, [projectId]);

  useEffect(() => {
    if (!interviewOpen) {
      setInterviewMode("request");
      setInterviewData({ date: "", time: "", link: "", duration: "" });
    }
  }, [interviewOpen]);

  return (
    <>
      <Box
        sx={{
          p: 2,
          boxShadow: 2,
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
          boxShadow: 2,
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
          boxShadow: 2,
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
          sx={{
            fontWeight: 600,
            color: hiredCount > 0 ? "success.main" : "text.secondary",
            fontSize: "0.95rem",
          }}
        >
          {hiredCount} hired
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AppButton
            label="Back"
            colorKey="RED"
            width={180}
            onClick={onDiscard}
          />
          <AppButton
            label="Proceed to next step"
            colorKey="BLUE"
            width={180}
            disabled={!canProceed}
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
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Reschedule Interview"
        fields={[
          {
            id: "date",
            label: "Date",
            type: "date",
            value: rescheduleData.date,
            onChange: (v) =>
              setRescheduleData((p) => ({ ...p, date: String(v) })),
          },
          {
            id: "time",
            label: "Time",
            type: "time",
            value: rescheduleData.time,
            onChange: (v) =>
              setRescheduleData((p) => ({ ...p, time: String(v) })),
          },
        ]}
        buttonText="Reschedule"
        buttonColor="BLUE"
        disableSubmit={!rescheduleData.date || !rescheduleData.time}
        onSubmit={() => {
          if (!selectedMeetingId) return;

          const dateTime = `${rescheduleData.date}T${rescheduleData.time}:00Z`;

          updateMeetingStatus.mutate(
            {
              meetingId: selectedMeetingId,
              status: "Rescheduled",
              date_time: dateTime,
            },
            {
              onSuccess: () => {
                toast("Interview rescheduled successfully", "success");
                setRescheduleOpen(false);
                refreshEverything();
              },
              onError: (err) => toast(err.message, "error"),
            }
          );
        }}
      />

      <DynamicPopup
        open={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        title="Cancel Interview"
        description="Are you sure you want to cancel this interview?"
        buttonText="Yes, Cancel"
        buttonColor="RED"
        fields={[]}
        onSubmit={() => {
          if (!selectedMeetingId) return;

          updateMeetingStatus.mutate(
            {
              meetingId: selectedMeetingId,
              status: "Cancelled",
            },
            {
              onSuccess: () => {
                toast("Interview cancelled", "success");
                setCancelConfirmOpen(false);
                refreshEverything();
              },
              onError: (err) => toast(err.message, "error"),
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
        fields={[]}
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
        title={
          interviewMode === "request"
            ? "Request Interview"
            : "Reschedule Interview"
        }
        disableSubmit={
          !interviewData.date || !interviewData.time || !interviewData.duration
        }
        buttonText={
          interviewMode === "request"
            ? "Assign Interview"
            : "Reassign Interview"
        }
        buttonColor="BLUE"
        onSubmit={handleInterviewSubmit}
      >
        <InterviewDateTimePicker
          value={{
            date: interviewData.date,
            time: interviewData.time,
          }}
          onChange={(v) => setInterviewData((p) => ({ ...p, ...v }))}
          workingSchedule={normalizeWorkingSchedule(
            consultantScheduleMap[selectedConsultantId ?? ""]
          )}
        />

        <Box mt={2}>
          <TextField
            select
            fullWidth
            size="small"
            label="Duration"
            value={interviewData.duration}
            slotProps={{
              inputLabel: { shrink: true },
              select: {
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return "Select duration";
                  }

                  return INTERVIEW_DURATION_OPTIONS.find(
                    (opt) => opt.value === selected
                  )?.label;
                },
              },
            }}
            onChange={(e) =>
              setInterviewData((p) => ({
                ...p,
                duration: e.target.value,
              }))
            }
          >
            <MenuItem value="" disabled>
              Select duration
            </MenuItem>

            {INTERVIEW_DURATION_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DynamicPopup>
    </>
  );
}
