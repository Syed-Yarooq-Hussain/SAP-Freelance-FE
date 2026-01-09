"use client";

import { useCallback, useEffect, useState } from "react";

export interface StoredProject {
  id: string;
  name: string;
  step: number;
  status: string;
}

export function useProjectProgress() {
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(() => {
    if (typeof window === "undefined") return;

    const stored: StoredProject[] = JSON.parse(
      localStorage.getItem("tb_projects") || "[]"
    );

    const filtered = stored.filter((p) => p.status === "Initiated");
    setProjects(filtered);
    setLoading(false);
  }, []);

  const saveProjects = (updated: StoredProject[]) => {
    localStorage.setItem("tb_projects", JSON.stringify(updated));
    window.dispatchEvent(new Event("tb_projects_updated"));
    loadProjects();
  };

  const addProject = (proj: StoredProject) => {
    const stored: StoredProject[] = JSON.parse(
      localStorage.getItem("tb_projects") || "[]"
    );

    const exists = stored.some((p) => p.id === proj.id);
    if (exists) return;

    const trimmed = [...stored, proj].slice(-5);
    saveProjects(trimmed);
  };

  const updateProjectStep = (projectId: string, step: number) => {
    const stored: StoredProject[] = JSON.parse(
      localStorage.getItem("tb_projects") || "[]"
    );

    let found = false;

    const updated = stored.map((p) => {
      if (p.id === projectId) {
        found = true;
        return {
          ...p,
          step: Math.max(p.step ?? 1, step),
        };
      }
      return p;
    });

    if (!found) {
      updated.push({
        id: projectId,
        name: "Untitled Project",
        step,
        status: "Initiated",
      });
    }

    localStorage.setItem("tb_project_id", projectId);
    localStorage.setItem("tb_project_in_progress", "true");

    saveProjects(updated);
  };

  const removeProject = (projectId: string) => {
    const stored: StoredProject[] = JSON.parse(
      localStorage.getItem("tb_projects") || "[]"
    );

    saveProjects(stored.filter((p) => p.id !== projectId));
  };

  useEffect(() => {
    loadProjects();
    const handler = () => loadProjects();
    window.addEventListener("tb_projects_updated", handler);
    return () => window.removeEventListener("tb_projects_updated", handler);
  }, [loadProjects]);

  const persistRequestedHours = (
    projectId: string,
    rows: { id: string | number; request?: number }[],
    selectedIds: string[]
  ) => {
    if (!projectId) return;

    const map: Record<string, number> = {};

    rows.forEach((r) => {
      const id = String(r.id);
      if (selectedIds.includes(id)) {
        map[id] = Number(r.request ?? 0);
      }
    });

    localStorage.setItem(
      `tb_requested_hours_${projectId}`,
      JSON.stringify(map)
    );
  };

  const getCompletedSteps = (projectId: string): number[] => {
    if (typeof window === "undefined") return [];
    return JSON.parse(
      localStorage.getItem(`tb_step_completed_${projectId}`) || "[]"
    );
  };

  const isStepCompleted = (projectId: string, step: number): boolean => {
    return getCompletedSteps(projectId).includes(step);
  };

  const markStepCompleted = (projectId: string, step: number) => {
    if (typeof window === "undefined") return;

    const key = `tb_step_completed_${projectId}`;
    const completed = getCompletedSteps(projectId);

    if (!completed.includes(step)) {
      completed.push(step);
      localStorage.setItem(key, JSON.stringify(completed));
    }
  };

  return {
    projects,
    loading,
    addProject,
    updateProjectStep,
    removeProject,
    reload: loadProjects,
    persistRequestedHours,
    markStepCompleted,
    isStepCompleted,
  };
}
