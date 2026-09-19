"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getScopeStudio,
  isScopeStudioApiEnabled,
  saveScopeStudio,
} from "@/services/scopeStudio";
import { emptyScope, validateScopeState } from "@/utils/scopeStudio";
import type { ScopeDocument, ScopeStudioState } from "@/types/scopeStudio";

export function useScopeStudio(projectId: string, owner: string) {
  const server = isScopeStudioApiEnabled();
  const storageKey = `scope_studio_v1_${owner}_${projectId}`;
  const [state, setState] = useState<ScopeStudioState>({
    revision: 0,
    document: emptyScope(),
    versions: [],
  });
  const current = useRef(state);
  current.current = state;
  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localError, setLocalError] = useState(false);
  const [retry, setRetry] = useState(0);
  const busy = useRef(false);
  const edit = useRef(0);
  const generation = useRef(0);
  useEffect(() => {
    const gen = ++generation.current;
    setReady(false);
    setError(null);
    setDirty(false);
    let local: ScopeStudioState | null = null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        local = validateScopeState(JSON.parse(raw));
        setState(local);
      }
    } catch {
      setLocalError(true);
    }
    if (!server) {
      setReady(true);
      return;
    }
    getScopeStudio(projectId)
      .then((saved) => {
        if (generation.current !== gen) return;
        // Migrate the current browser draft when the backend has no scope yet.
        const migrate =
          saved.revision === 0 &&
          !saved.document.archetype &&
          !saved.document.sections.length &&
          local &&
          (local.document.archetype ||
            local.document.sections.length ||
            local.document.source);
        setState(
          migrate && local ? { ...saved, document: local.document } : saved,
        );
        if (migrate) {
          edit.current += 1;
          setDirty(true);
        }
        setReady(true);
      })
      .catch((reason) => {
        if (generation.current === gen)
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load project scope.",
          );
      });
    return () => {
      generation.current += 1;
    };
  }, [projectId, storageKey, server, retry]);

  const update = useCallback((document: ScopeDocument) => {
    edit.current += 1;
    setState((prev) => ({ ...prev, document }));
    setDirty(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      setLocalError(false);
    } catch {
      setLocalError(true);
    }
  }, [state, storageKey, ready]);

  const save = useCallback(
    async (checkpoint = false) => {
      if (busy.current || !ready || (server && error)) return false;
      const snapshot = current.current;
      if (!server) {
        const next = checkpoint
          ? {
              ...snapshot,
              versions: [
                ...snapshot.versions,
                {
                  id: crypto.randomUUID(),
                  savedAt: new Date().toISOString(),
                  document: structuredClone(snapshot.document),
                },
              ].slice(-20),
            }
          : snapshot;
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
          setState(next);
          setDirty(false);
          setLocalError(false);
          return true;
        } catch {
          setLocalError(true);
          return false;
        }
      }
      busy.current = true;
      setSaving(true);
      const sequence = edit.current;
      const gen = generation.current;
      try {
        const saved = await saveScopeStudio(projectId, {
          revision: snapshot.revision,
          document: snapshot.document,
          checkpoint,
        });
        if (generation.current !== gen) return false;
        setState((prev) => ({
          ...saved,
          document: edit.current === sequence ? saved.document : prev.document,
        }));
        if (edit.current === sequence) setDirty(false);
        return true;
      } catch (reason) {
        if (generation.current === gen)
          setError(
            `${reason instanceof Error ? reason.message : "Scope could not be saved."} Your edits are kept here. Export a copy before reloading the saved scope.`,
          );
        return false;
      } finally {
        busy.current = false;
        setSaving(false);
      }
    },
    [ready, server, error, projectId, storageKey],
  );

  useEffect(() => {
    if (!server || !ready || !dirty || saving || error) return;
    const timeout = setTimeout(() => {
      void save();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [server, ready, dirty, saving, error, save, state.document]);
  useEffect(() => {
    if (!(server && dirty) && !localError) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [server, dirty, localError]);
  return {
    ...state,
    update,
    save,
    ready,
    saving,
    server,
    error,
    localError,
    dirty,
    reload: () => setRetry((n) => n + 1),
  };
}
