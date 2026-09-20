"use client";

import { consultantLabel } from "@/utils/consultantIdentity";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { GripVertical } from "lucide-react";
import { useConsultantLevels } from "@/actions/common/useConsultantLevels";
import { getProjectConsultantsService } from "@/services/getProjectConsultants";
import {
  getProjectTeamBuilder,
  isTeamBuilderApiEnabled,
  saveProjectTeamBuilder,
} from "@/services/projectTeamBuilder";
import {
  canParent,
  crewDraftKey,
  readCrewDraft,
  removeRole,
  type CrewRole,
} from "@/utils/crewBuilder";
import type { ProjectTeamBuilderState } from "@/types/projectTeamBuilder";
import type { IProjectConsultant, TeamBuilderRow } from "@/types/teamBuilder";
import CrewHierarchy from "@/components/specific/teambuilder/CrewHierarchy";

export default function RoleHierarchy({
  projectId,
  onPendingChange,
  refreshKey = "",
}: {
  projectId?: string | null;
  onPendingChange?: (pending: boolean) => void;
  refreshKey?: string;
}) {
  const { data: session } = useSession();
  const owner = String(session?.user?.id ?? "");
  const server = isTeamBuilderApiEnabled();
  const [people, setPeople] = useState<TeamBuilderRow[]>([]);
  const [roles, setRoles] = useState<CrewRole[]>([]);
  const [snapshot, setSnapshot] = useState<ProjectTeamBuilderState | null>(
    null,
  );
  const [savedRoles, setSavedRoles] = useState<CrewRole[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(0);
  const {
    mutate: loadLevels,
    data: levels,
    isError: levelsError,
  } = useConsultantLevels();
  useEffect(() => {
    loadLevels();
  }, [loadLevels]);
  useEffect(() => {
    onPendingChange?.(dirty || saving);
    return () => onPendingChange?.(false);
  }, [dirty, saving, onPendingChange]);

  useEffect(() => {
    if (!projectId || !owner || dirty) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    const load = async () => {
      const members: IProjectConsultant[] = [];
      let page = 1;
      while (!cancelled) {
        const result = await getProjectConsultantsService(
          projectId,
          [
            "shortlisted",
            "interview-schedule",
            "interviewed",
            "offered",
            "hired",
          ],
          page,
        );
        members.push(...(result.data ?? []));
        if (!result.pagination?.has_next_page) break;
        page += 1;
      }
      const state = server ? await getProjectTeamBuilder(projectId) : null;
      if (cancelled) return;
      const unique = [
        ...new Map(
          members.map((member) => [String(member.consultant_id), member]),
        ).values(),
      ];
      const rows: TeamBuilderRow[] = unique.map((member) => ({
        id: String(member.consultant_id),
        name: member.name,
        coremodules: member.modules?.core || "",
        othersmodules: member.modules?.others || "",
        experience: String(member.experience),
        rate: String(member.decided_rate || member.rate || 0),
        avail: member.requested_hours,
        request: member.requested_hours,
      }));
      const saved =
        state?.roles ??
        readCrewDraft(crewDraftKey(owner, projectId))?.roles ??
        [];
      // One node per selected candidate; retain their previous reporting relationship.
      const next: CrewRole[] = unique.flatMap((member) => {
        const id = String(member.consultant_id);
        const existing = saved.find((role) => role.personIds.includes(id));
        const title = existing?.title || member.role;
        if (!title) return [];
        const parentPerson = saved
          .find((role) => role.id === existing?.parentId)
          ?.personIds.find(
            (personId) =>
              personId !== id &&
              rows.some((row) => String(row.id) === personId),
          );
        return [
          {
            id: `person-${id}`,
            title,
            personIds: [id],
            placed: true,
            parentId: parentPerson ? `person-${parentPerson}` : null,
          },
        ];
      });
      const normalized = next.map((role) => ({
        ...role,
        parentId: canParent(next, role.id, role.parentId)
          ? role.parentId
          : null,
      }));
      setPeople(rows);
      setRoles(normalized);
      setSavedRoles(normalized);
      setSnapshot(state);
      setDirty(false);
      setActiveId(current => normalized.some(role => role.id === current) ? current : null);
    };
    load()
      .catch((reason) => {
        if (!cancelled)
          setError(reason.message || "Could not load selected candidates.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, owner, server, retry, refreshKey, dirty]);

  const change = (next: CrewRole[]) => {
    setRoles(next);
    setDirty(true);
    setMessage("");
  };
  const move = (id: string, parentId: string | null) => {
    if (!roles.some((role) => role.id === id)) {
      setMessage(
        "Choose this candidate’s role first, then drag them into the hierarchy.",
      );
      return;
    }
    if (!canParent(roles, id, parentId)) {
      setMessage(
        "A candidate cannot report to themselves or someone reporting to them.",
      );
      return;
    }
    change(
      roles.map((role) =>
        role.id === id ? { ...role, parentId, placed: true } : role,
      ),
    );
    setActiveId(id);
  };
  const setRole = (personId: string, title: string) => {
    const id = `person-${personId}`;
    if (!title) {
      change(removeRole(roles, id));
      return;
    }
    change(
      roles.some((role) => role.id === id)
        ? roles.map((role) => (role.id === id ? { ...role, title } : role))
        : [
            ...roles,
            { id, title, personIds: [personId], parentId: null, placed: true },
          ],
    );
    setActiveId(id);
  };
  const save = async () => {
    if (!projectId || saving || (server && !snapshot)) return;
    setSaving(true);
    setError("");
    try {
      let next = roles;
      if (server && snapshot) {
        const state = await saveProjectTeamBuilder(projectId, {
          revision: snapshot.revision,
          roles,
          consultants: snapshot.consultants.map((person) => ({
            consultant_id: Number(person.id),
            requested_hours: person.requested_hours,
          })),
        });
        next = state.roles;
        setSnapshot(state);
      }
      if (!server)
        localStorage.setItem(
          crewDraftKey(owner, projectId),
          JSON.stringify({
            roles: next,
            people,
            selectedIds: people.map((person) => String(person.id)),
          }),
        );
      setRoles(next);
      setSavedRoles(next);
      setDirty(false);
      setMessage(
        server
          ? "Team structure saved."
          : "Team structure saved on this device.",
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not save the team structure.",
      );
    } finally {
      setSaving(false);
    }
  };
  const active = roles.find((role) => role.id === activeId);
  const titleOptions = [
    ...new Set([...(levels?.data ?? []), ...roles.map((role) => role.title)]),
  ];
  if (!projectId) return null;
  return (
    <Paper
      variant="outlined"
      sx={{ mt: 3, p: { xs: 2, md: 3 }, borderRadius: 2 }}
    >
      <Typography variant="h6" fontWeight={700}>
        Team structure
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose a role for each selected candidate. Drag a candidate onto their
        lead to set who they report to, or use the reporting dropdown.
      </Typography>
      {error ? (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button
              disabled={saving}
              onClick={() => {
                if (
                  !dirty ||
                  window.confirm(
                    "Reload the saved structure and discard unsaved changes?",
                  )
                ) {
                  setDirty(false);
                  setRetry((value) => value + 1);
                }
              }}
            >
              Reload
            </Button>
          }
        >
          {error}
        </Alert>
      ) : null}
      {message ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      ) : null}
      {levelsError ? (
        <Alert
          severity="warning"
          action={<Button onClick={() => loadLevels()}>Retry</Button>}
        >
          Role options could not be loaded.
        </Alert>
      ) : null}
      {loading ? (
        <CircularProgress size={24} />
      ) : !people.length ? (
        <Alert severity="info">
          Select candidates in Step 1 to build your team structure.
        </Alert>
      ) : (
        <>
          <Box
            component="fieldset"
            disabled={saving}
            sx={{
              border: 0,
              p: 0,
              m: 0,
              minWidth: 0,
              pointerEvents: saving ? "none" : "auto",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "300px minmax(0, 1fr)" },
              gap: 2,
            }}
          >
            <Box sx={{ maxHeight: 490, overflowY: "auto", pr: 0.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected candidates ({people.length})
              </Typography>
              {people.map((person) => {
                const id = String(person.id);
                const role = roles.find((item) => item.personIds.includes(id));
                return (
                  <Paper
                    key={id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderColor:
                        activeId === role?.id ? "#005C8A" : "divider",
                    }}
                  >
                    <Stack
                      draggable={Boolean(role)}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/crew-person", id);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 1, cursor: role ? "grab" : "default" }}
                    >
                      <GripVertical size={16} />
                      <Typography variant="body2" fontWeight={600}>
                        {consultantLabel(person.id)}
                      </Typography>
                    </Stack>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label={`Role for ${consultantLabel(person.id)}`}
                      value={role?.title ?? ""}
                      onChange={(event) => setRole(id, event.target.value)}
                    >
                      <MenuItem value="">Choose role</MenuItem>
                      {titleOptions.map((title) => (
                        <MenuItem key={title} value={title}>
                          {title}
                        </MenuItem>
                      ))}
                    </TextField>
                    {role ? (
                      <Button
                        size="small"
                        onClick={() => setActiveId(role.id)}
                        sx={{ mt: 0.5 }}
                      >
                        Edit role & reporting line
                      </Button>
                    ) : null}
                  </Paper>
                );
              })}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  height: 410,
                  display: "flex",
                  border: "1px solid #E2E8F0",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CrewHierarchy
                  candidateMode
                  roles={roles}
                  people={people}
                  activeRole={activeId}
                  onSelect={setActiveId}
                  onDropRole={move}
                  onDropPerson={(personId, parentId) =>
                    move(`person-${personId}`, parentId)
                  }
                />
              </Box>
              {active ? (
                <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                  <Typography fontWeight={600} sx={{ mb: 2 }}>
                    Edit {consultantLabel(active.personIds[0])}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Candidate role"
                    value={active.title}
                    onChange={event => setRole(active.personIds[0], event.target.value)}
                  >
                    {titleOptions.map(title => <MenuItem key={title} value={title}>{title}</MenuItem>)}
                  </TextField>
                <TextField
                  select
                  fullWidth
                  size="small"
                  sx={{ mt: 2 }}
                  label={`Reports to · ${consultantLabel(active.personIds[0])}`}
                  value={active.parentId ?? ""}
                  onChange={(event) =>
                    move(active.id, event.target.value || null)
                  }
                >
                  <MenuItem value="">No lead / top level</MenuItem>
                  {roles
                    .filter(
                      (role) =>
                        role.id !== active.id &&
                        canParent(roles, active.id, role.id),
                    )
                    .map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {
                          consultantLabel(role.personIds[0])
                        }{" "}
                        · {role.title}
                      </MenuItem>
                    ))}
                </TextField>
                  <Button sx={{ mt: 1 }} disabled={!active.parentId} onClick={() => move(active.id, null)}>
                    Remove reporting link
                  </Button>
                </Paper>
              ) : null}
            </Box>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mr: "auto" }}
            >
              {server ? "Saved with this project" : "Browser draft"}
            </Typography>
            {dirty ? (
              <Button
                disabled={saving}
                onClick={() => {
                  setRoles(savedRoles);
                  setDirty(false);
                  setMessage("");
                }}
              >
                Discard changes
              </Button>
            ) : null}
            <Button
              variant="contained"
              disabled={saving || !dirty || Boolean(error)}
              onClick={save}
            >
              {saving ? "Saving…" : "Save structure"}
            </Button>
          </Stack>
        </>
      )}
    </Paper>
  );
}
