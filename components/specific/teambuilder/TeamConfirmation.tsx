"use client";

import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import RoleHierarchy from "@/components/RoleHierarchy";
import { STATUS } from "@/constants/status_dropdown";
import {
  getCandidateColumns,
  getShortlistedColumns,
  candidateRows as initialCandidates,
  shortlistedRows as initialShortlisted,
} from "@/data/teamBuilder";
import type { CandidateRow, ShortlistedRow } from "@/types/teamBuilder";
import { Box, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

type TeamConfirmationProps = {
  onNext?: () => void;
};
export default function TeamConfirmation({ onNext }: TeamConfirmationProps) {
  const [shortlisted, setShortlisted] =
    useState<ShortlistedRow[]>(initialShortlisted);
  const [candidates, setCandidates] =
    useState<CandidateRow[]>(initialCandidates);

  const [interviewOpen, setInterviewOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    link: "",
  });

  const genShortlistId = (row: CandidateRow): string =>
    `C - ${String(row.id).padStart(4, "0")}`;

  const addToShortlist = useCallback(
    (row: CandidateRow): void => {
      const newRow: ShortlistedRow = {
        id: genShortlistId(row),
        modules: row.modules,
        experience: row.experience,
        hourlyRate: row.hourlyRate,
        status: STATUS.PENDING,
        interview: "Request",
      };
      setShortlisted((prev) => [newRow, ...prev]);
      setCandidates((prev) => prev.filter((r) => r.id !== row.id));
    },
    [setShortlisted, setCandidates]
  );

  const rejectCandidate = useCallback(
    (row: CandidateRow): void => {
      setCandidates((prev) => prev.filter((r) => r.id !== row.id));
    },
    [setCandidates]
  );

  const shortlistedColumns = useMemo(
    () =>
      getShortlistedColumns(
        (id: string) => console.log("Selected candidate:", id),
        setInterviewOpen
      ),
    [setInterviewOpen]
  );

  const candidateColumns = useMemo(
    () => getCandidateColumns(addToShortlist, rejectCandidate, setCandidates),
    [addToShortlist, rejectCandidate, setCandidates]
  );

  return (
    <>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
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
          borderRadius: 2,
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
      borderRadius: 2,
      boxShadow: 2,
      bgcolor: "background.paper",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.95rem" }}>
      2 hired
    </Typography>

    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <AppButton
        label="Proceed to next step"
        colorKey="BLUE"
        width={180}
        onClick={onNext}
      />
      <AppButton label="Discard" colorKey="RED" width={180} />
    </Box>
  </Box>;

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
            id: "time",
            label: "Time",
            type: "time",
            value: interviewData.time,
            onChange: (val: string | File) => {
              if (typeof val === "string")
                setInterviewData((p) => ({ ...p, time: val }));
            },
          },
          // {
          //   id: "link",
          //   label: "",
          //   type: "text",
          //   value: interviewData.link,
          //   onChange: (val: string | File) => {
          //     if (typeof val === "string")
          //       setInterviewData((p) => ({ ...p, link: val }));
          //   },
          //   placeholder: "Meeting link",
          // },
        ]}
        buttonText="Assign Interview"
        buttonColor="BLUE"
        onSubmit={() => setInterviewOpen(false)}
        disableSubmit={!interviewData.date || !interviewData.time}
      />
    </>
  );
}
