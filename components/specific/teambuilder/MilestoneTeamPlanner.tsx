"use client";

import { consultantLabel } from "@/utils/consultantIdentity";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChevronDown, ChevronUp, Users, Search } from "lucide-react";
import { getProjectConsultantsService } from "@/services/getProjectConsultants";
import { getMilestoneTeam, saveMilestoneTeam } from "@/services/milestoneTeam";
import type { IProjectConsultant, MilestoneRow } from "@/types/teamBuilder";
import type { MilestoneAllocation, MilestoneTeam } from "@/types/milestoneTeam";
import { milestoneEstimate, milestoneRate } from "@/utils/milestoneTeam";
import { CustomError } from "@/exceptions/custom-exception";
import { formatCurrency } from "@/utils/payments";

export default function MilestoneTeamPlanner({
  projectId,
  milestones,
  onPendingChange,
}: {
  projectId: string;
  milestones: MilestoneRow[];
  onPendingChange: (pending: boolean) => void;
}) {
  const { data: session } = useSession();
  const [candidates, setCandidates] = useState<IProjectConsultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [pending, setPending] = useState<Record<number, boolean>>({});
  const reportPending = useCallback((id: number, value: boolean) => {
    setPending((previous) =>
      previous[id] === value ? previous : { ...previous, [id]: value },
    );
  }, []);
  useEffect(() => {
    onPendingChange(milestones.some((milestone) => pending[milestone.id]));
  }, [pending, milestones, onPendingChange]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const load = async () => {
      const all: IProjectConsultant[] = [];
      let page = 1;
      while (active) {
        const response = await getProjectConsultantsService(
          projectId,
          [
            "shortlisted",
            "interview-schedule",
            "interviewed",
            "offered",
            "hired",
          ],
          page,
          "USD",
        );
        all.push(...(response.data ?? []));
        if (!response.pagination?.has_next_page) break;
        page += 1;
      }
      return [
        ...new Map(
          all.map((item) => [String(item.consultant_id), item]),
        ).values(),
      ];
    };
    load()
      .then((result) => {
        if (active) setCandidates(result);
      })
      .catch((reason) => {
        if (active)
          setError(reason.message || "Could not load the project team.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [projectId, attempt]);

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Users size={20} color="#005C8A" />
        <Typography fontWeight={700}>Plan each milestone’s team</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose who will work on each milestone and enter their total hours for
        that milestone. Shortlisted people help you estimate; only hired people
        contribute to payments. Rates and estimates are converted to USD; saved
        totals use the server exchange-rate snapshot.
      </Typography>
      {!milestones.length ? (
        <Alert severity="info">
          Add a milestone below, then choose its team here.
        </Alert>
      ) : null}
      {loading ? (
        <CircularProgress size={24} />
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Button onClick={() => setAttempt((value) => value + 1)}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : session?.user?.id ? (
        <Stack spacing={1.5}>
          {milestones.map((milestone) => (
            <MilestoneTeamCard
              key={`${projectId}-${milestone.id}`}
              projectId={projectId}
              owner={String(session.user.id)}
              milestone={milestone}
              candidates={candidates}
              onPendingChange={reportPending}
            />
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}

function MilestoneTeamCard({
  projectId,
  owner,
  milestone,
  candidates,
  onPendingChange,
}: {
  projectId: string;
  owner: string;
  milestone: MilestoneRow;
  candidates: IProjectConsultant[];
  onPendingChange: (id: number, pending: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "hired" | "selected">("all");
  const [allocations, setAllocations] = useState<MilestoneAllocation[]>([]);
  const [saved, setSaved] = useState<MilestoneTeam | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [staleDraft, setStaleDraft] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const storageKey = `milestone-team:v1:${owner}:${projectId}:${milestone.id}`;
  const totals = useMemo(
    () => milestoneEstimate(allocations, candidates),
    [allocations, candidates],
  );

  useEffect(() => {
    let active = true;
    setReady(false);
    setStaleDraft(false);
    setError("");
    let loadedRevision: number | null = null;
    getMilestoneTeam(projectId, milestone.id)
      .then((team) => {
        if (!active) return;
        setSaved(team);
        loadedRevision = team.revision;
        setAllocations(
          team.allocations.map((item) => ({
            ...item,
            consultant_id: String(item.consultant_id),
          })),
        );
        setDirty(false);
      })
      .catch((reason) => {
        if (active) {
          setSaved(null);
          setError(
            reason.message || "Could not load the saved milestone team.",
          );
        }
      })
      .finally(() => {
        if (!active) return;
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            const stored = JSON.parse(raw);
            const draft: unknown = stored?.allocations;
            if (
              Array.isArray(draft) &&
              draft.every(
                (item) =>
                  typeof item?.consultant_id === "string" &&
                  typeof item?.hours === "number" &&
                  Number.isFinite(item.hours),
              )
            ) {
              setAllocations(draft);
              setDirty(true);
              setStaleDraft(
                loadedRevision !== null && stored.revision !== loadedRevision,
              );
            }
          }
        } catch {
          setStorageError("Your browser could not restore the local draft.");
        }
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, [projectId, milestone.id, storageKey, attempt]);

  useEffect(() => {
    onPendingChange(milestone.id, saving || dirty);
    return () => onPendingChange(milestone.id, false);
  }, [milestone.id, saving, dirty, onPendingChange]);

  const change = (next: MilestoneAllocation[]) => {
    setAllocations(next);
    setDirty(true);
    setStorageError("");
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          revision: saved?.revision ?? null,
          allocations: next,
        }),
      );
    } catch {
      setStorageError(
        "Draft could not be stored on this device. Keep this page open until saved.",
      );
    }
  };
  const save = async () => {
    if (!saved || saving || totals.invalid || staleDraft) return;
    setSaving(true);
    setError("");
    try {
      const result = await saveMilestoneTeam(
        projectId,
        milestone.id,
        saved.revision,
        allocations,
      );
      setSaved(result);
      setAllocations(
        result.allocations.map((item) => ({
          ...item,
          consultant_id: String(item.consultant_id),
        })),
      );
      setDirty(false);
      try {
        localStorage.removeItem(storageKey);
      } catch {
        setStorageError(
          "Saved to the project, but this browser could not clear its draft.",
        );
      }
    } catch (reason) {
      if (reason instanceof CustomError && reason.statusCode === 409) {
        // Preserve the draft and refresh its server baseline without retrying a write.
        setStaleDraft(true);
        setSaved(null);
        try {
          const latest = await getMilestoneTeam(projectId, milestone.id);
          setSaved(latest);
          setError(
            latest.locked
              ? "This milestone is now paid. Your draft is preserved, but cannot be saved."
              : "Latest saved team loaded. Your draft is preserved; review it, then choose Use this draft or Discard.",
          );
        } catch {
          setError("Could not reload the latest team. Your draft is preserved. Retry to reload before saving.");
        }
      } else {
        setError(
          reason instanceof Error ? reason.message : "Could not save the team.",
        );
      }
    } finally {
      setSaving(false);
    }
  };
  const discard = () => {
    setAllocations(
      saved?.allocations.map((item) => ({
        ...item,
        consultant_id: String(item.consultant_id),
      })) ?? [],
    );
    setDirty(false);
    setStaleDraft(false);
    try {
      localStorage.removeItem(storageKey);
      setStorageError("");
    } catch {
      setStorageError("Could not clear this device’s draft.");
    }
  };
  const selectedIds = new Set(allocations.map((item) => item.consultant_id));
  const visible = candidates.filter((candidate) => {
    if (filter === "hired" && candidate.status !== "hired") return false;
    if (
      filter === "selected" &&
      !selectedIds.has(String(candidate.consultant_id))
    )
      return false;
    return `${consultantLabel(candidate.consultant_id)} ${candidate.role || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });
  const missing = allocations.filter(
    (item) =>
      !candidates.some(
        (candidate) => String(candidate.consultant_id) === item.consultant_id,
      ),
  );
  const disabled = !ready || saving || staleDraft || Boolean(saved?.locked);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        borderColor: open ? "#9CC6DF" : "#E2E8F0",
      }}
    >
      <Button
        fullWidth
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        sx={{
          p: 2,
          color: "#0F172A",
          textTransform: "none",
          justifyContent: "space-between",
          textAlign: "left",
          gap: 2,
        }}
      >
        <Box>
          <Typography fontWeight={700}>{milestone.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {milestone.start_date} – {milestone.due_date} · {allocations.length}{" "}
            selected
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            size="small"
            label={
              saved?.locked
                ? "Paid · read only"
                : dirty
                  ? "Unsaved draft"
                  : saved
                    ? "Saved"
                    : "Plan team"
            }
            color={dirty ? "warning" : "default"}
          />
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Stack>
      </Button>
      <Collapse in={open}>
        <Box sx={{ p: { xs: 1.5, md: 2.5 }, borderTop: "1px solid #E2E8F0" }}>
          {!ready ? (
            <CircularProgress size={22} />
          ) : (
            <>
              {error ? (
                <Alert
                  severity="warning"
                  sx={{ mb: 2 }}
                  action={
                    <Button
                      disabled={saving}
                      onClick={() => setAttempt((value) => value + 1)}
                    >
                      Retry
                    </Button>
                  }
                >
                  {error}
                </Alert>
              ) : null}
              {storageError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {storageError}
                </Alert>
              ) : null}
              {staleDraft ? (
                <Alert
                  severity="warning"
                  sx={{ mb: 2 }}
                  action={
                    <Button
                      disabled={!saved || saved.locked || saving}
                      onClick={() => {
                        change(allocations);
                        setStaleDraft(false);
                        setError("");
                      }}
                    >
                      Use this draft
                    </Button>
                  }
                >
                  The saved team changed since this draft was started. Review
                  your selections, then use this draft or discard it to load the
                  saved team.
                </Alert>
              ) : null}
              {saved?.locked ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  This milestone has a paid payment. Create a new milestone for
                  additional work.
                </Alert>
              ) : null}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                {[
                  ["Planned hours", `${totals.hours} h`],
                  [
                    "Estimated team cost",
                    totals.invalid
                      ? "Check allocations"
                      : formatCurrency(totals.estimate, totals.currency),
                  ],
                  [
                    "Hired team subtotal",
                    totals.invalid
                      ? "Check allocations"
                      : formatCurrency(totals.hired, totals.currency),
                  ],
                ].map(([label, value]) => (
                  <Box
                    key={label}
                    sx={{ p: 1.75, bgcolor: "#F5F9FC", borderRadius: 2 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography fontSize={21} fontWeight={700}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 2 }}
              >
                Preview before taxes and service charges. Rates include client
                pricing. Hours are specific to this milestone, not monthly
                availability.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ mb: 2 }}
              >
                <TextField
                  size="small"
                  placeholder="Find a consultant or role"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={16} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ flex: 1 }}
                />
                <Stack direction="row" spacing={0.5}>
                  {(["all", "hired", "selected"] as const).map((value) => (
                    <Button
                      key={value}
                      variant={filter === value ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setFilter(value)}
                    >
                      {value === "all" ? "All candidates" : value}
                    </Button>
                  ))}
                </Stack>
              </Stack>
              {visible.map((candidate) => {
                const id = String(candidate.consultant_id);
                const allocation = allocations.find(
                  (item) => item.consultant_id === id,
                );
                const rate = milestoneRate(candidate);
                return (
                  <Box
                    key={id}
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1.5,
                      py: 1.5,
                      borderTop: "1px solid #EDF1F5",
                    }}
                  >
                    <Checkbox
                      checked={Boolean(allocation)}
                      disabled={disabled}
                      inputProps={{
                        "aria-label": `Assign ${consultantLabel(candidate.consultant_id)} to ${milestone.name}`,
                      }}
                      onChange={(_, checked) =>
                        change(
                          checked
                            ? [...allocations, { consultant_id: id, hours: 0 }]
                            : allocations.filter(
                                (item) => item.consultant_id !== id,
                              ),
                        )
                      }
                    />
                    <Avatar
                      sx={{
                        bgcolor: "#EAF3F9",
                        color: "#005C8A",
                        width: 36,
                        height: 36,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 130 }}>
                      <Typography variant="body2" fontWeight={650}>
                        {consultantLabel(candidate.consultant_id)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {candidate.role || "Role not assigned"} ·{" "}
                        {rate === null
                          ? "Rate needed"
                          : `${formatCurrency(rate, candidate.currency || "USD")}/h`}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      variant="outlined"
                      color={
                        candidate.status === "hired" ? "success" : "default"
                      }
                      label={
                        candidate.status === "hired"
                          ? "Hired"
                          : `${candidate.status.replaceAll("-", " ")} · estimate`
                      }
                    />
                    {allocation ? (
                      <TextField
                        label="Milestone hours"
                        type="number"
                        size="small"
                        value={allocation.hours || ""}
                        disabled={disabled}
                        error={
                          allocation.hours <= 0 || allocation.hours > 100000
                        }
                        onChange={(event) =>
                          change(
                            allocations.map((item) =>
                              item.consultant_id === id
                                ? { ...item, hours: Number(event.target.value) }
                                : item,
                            ),
                          )
                        }
                        slotProps={{
                          htmlInput: {
                            min: 0.25,
                            max: 100000,
                            step: 0.25,
                            "aria-label": `Hours for ${consultantLabel(candidate.consultant_id)}`,
                          },
                        }}
                        sx={{ width: 145 }}
                      />
                    ) : null}
                  </Box>
                );
              })}
              {!visible.length ? (
                <Typography color="text.secondary" sx={{ py: 3 }}>
                  No candidates match. Add people to the project shortlist to
                  plan their work here.
                </Typography>
              ) : null}
              {missing.map((item) => (
                <Alert
                  key={item.consultant_id}
                  severity="warning"
                  sx={{ mt: 1 }}
                  action={
                    <Button
                      disabled={disabled}
                      onClick={() =>
                        change(
                          allocations.filter(
                            (value) =>
                              value.consultant_id !== item.consultant_id,
                          ),
                        )
                      }
                    >
                      Remove
                    </Button>
                  }
                >
                  {consultantLabel(item.consultant_id)} is no longer available on
                  this project.
                </Alert>
              ))}
              {totals.invalid ? (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {totals.mixedCurrency
                    ? "Selected rates use different currencies. Resolve pricing before saving."
                    : "Each selected consultant needs a valid rate and positive milestone hours."}
                </Alert>
              ) : null}
              {!dirty && saved ? (
                <Typography variant="body2" sx={{ mt: 2 }} color="success.main">
                  Saved payment subtotal:{" "}
                  {formatCurrency(saved.payable_amount, saved.currency)} · Saved
                  estimate:{" "}
                  {formatCurrency(saved.estimated_amount, saved.currency)}
                </Typography>
              ) : null}
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={1}
                sx={{ mt: 2 }}
              >
                {dirty ? (
                  <Button disabled={saving} onClick={discard}>
                    Discard draft
                  </Button>
                ) : null}
                <Button
                  variant="contained"
                  disabled={
                    disabled || !saved || !dirty || totals.invalid || staleDraft
                  }
                  onClick={save}
                >
                  {saving ? "Saving…" : "Save team & update cost"}
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
