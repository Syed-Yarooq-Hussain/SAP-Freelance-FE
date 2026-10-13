"use client";

import { consultantLabel } from "@/utils/consultantIdentity";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getProjectConsultantsService } from "@/services/getProjectConsultants";
import {
  getProjectTeamBuilder,
  isTeamBuilderApiEnabled,
  saveProjectTeamBuilder,
} from "@/services/projectTeamBuilder";
import {
  canParent,
  addDesignRoles,
  crewDraftKey,
  readCrewDraft,
  type CrewRole,
} from "@/utils/crewBuilder";
import type { ProjectTeamBuilderState } from "@/types/projectTeamBuilder";
import type { IProjectConsultant, TeamBuilderRow } from "@/types/teamBuilder";
import CrewWorkspace from "@/components/specific/teambuilder/CrewWorkspace";

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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(0);
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
      const draft = readCrewDraft(crewDraftKey(owner, projectId));
      const saved = state?.roles ?? draft?.roles ?? [];
      const eligible = new Set(rows.map(person => String(person.id)));
      const next: CrewRole[] = saved.map(role => ({ ...role, personIds: role.personIds.filter(id => eligible.has(id)) }));
      for (const member of unique) {
        const id = String(member.consultant_id);
        if (!state && !draft && member.role && !next.some(role => role.personIds.includes(id))) {
          next.push({ id: crypto.randomUUID(), title: member.role, personIds: [id], placed: true, parentId: null });
        }
      }
      const initialRoles = !draft && !saved.length ? addDesignRoles(next) : next;
      const normalized = initialRoles.map(role => ({ ...role, parentId: canParent(initialRoles, role.id, role.parentId) ? role.parentId : null }));
      setPeople(rows);
      setRoles(normalized);
      setSavedRoles(normalized);
      setSnapshot(state);
      setDirty(initialRoles.length !== next.length);
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
        Assign selected consultants to roles, then arrange the project hierarchy. Choose a standard role or add your own.
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
      {loading ? (
        <CircularProgress size={24} />
      ) : !people.length ? (
        <Alert severity="info">
          Select candidates in Step 1 to build your team structure.
        </Alert>
      ) : (
        <>
          <Box component="fieldset" disabled={saving} sx={{ border: 0, p: 0, m: 0, minWidth: 0, pointerEvents: saving ? "none" : "auto" }}>
            <CrewWorkspace selectionLocked rows={people}
              visibleRows={people.filter(person => [person.name, consultantLabel(person.id), person.coremodules, person.othersmodules].join(" ").toLowerCase().includes(search.trim().toLowerCase()))}
              selectedIds={people.map(person => String(person.id))} onSelect={() => {}}
              roles={roles} onRolesChange={change} onHoursChange={() => {}}
              search={search} onSearch={setSearch} onProfile={() => {}} onSchedule={() => {}}
              loading={false} hasMore={false} onLoadMore={() => {}}
              persistenceLabel={server ? "Project team structure" : "Browser draft"} />
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
