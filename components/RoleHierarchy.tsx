"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Alert, Button } from "@mui/material";
import {
  getProjectTeamBuilder,
  isTeamBuilderApiEnabled,
} from "@/services/projectTeamBuilder";
import { teamBuilderStateToDraft } from "@/utils/projectTeamBuilder";
import {
  crewDraftKey,
  readCrewDraft,
  type CrewDraft,
} from "@/utils/crewBuilder";
import CrewHierarchy from "@/components/specific/teambuilder/CrewHierarchy";
import styles from "@/components/specific/teambuilder/CrewWorkspace.module.css";

export default function RoleHierarchy({
  projectId,
}: {
  projectId?: string | null;
}) {
  const { data: session } = useSession();
  const [draft, setDraft] = useState<CrewDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  const serverEnabled = isTeamBuilderApiEnabled();
  useEffect(() => {
    let cancelled = false;
    setDraft(null);
    setError(null);
    if (serverEnabled && session?.user?.id && projectId) {
      setLoading(true);
      getProjectTeamBuilder(projectId)
        .then((state) => {
          if (!cancelled) setDraft(teamBuilderStateToDraft(state));
        })
        .catch((reason) => {
          if (!cancelled)
            setError(
              reason instanceof Error
                ? reason.message
                : "Unable to load team structure.",
            );
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }
    setLoading(false);
    if (session?.user?.id && projectId)
      setDraft(readCrewDraft(crewDraftKey(String(session.user.id), projectId)));
    else setDraft(null);
  }, [projectId, session?.user?.id, serverEnabled, retry]);
  if (error)
    return (
      <Alert
        severity="error"
        sx={{ mt: 3 }}
        action={
          <Button color="inherit" onClick={() => setRetry((n) => n + 1)}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  if (loading)
    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        Loading saved team structure…
      </Alert>
    );
  if (!draft?.roles.length) return null;
  return (
    <section
      className={styles.workspace}
      style={{ marginTop: 24 }}
      aria-label="Proposed team structure"
    >
      <div className={styles.columnHeading}>
        <span>PROPOSED TEAM STRUCTURE</span>
        <small>
          {serverEnabled
            ? "Saved project structure"
            : "Browser draft - confirm roles below"}
        </small>
      </div>
      <div style={{ height: 460, display: "flex" }}>
        <CrewHierarchy roles={draft.roles} people={draft.people} />
      </div>
    </section>
  );
}
