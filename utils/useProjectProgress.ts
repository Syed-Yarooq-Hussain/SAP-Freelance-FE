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

  /**
   * ✅ SAFE step persistence
   * - Adds project if missing
   * - Never rolls step backward
   */
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

    // 🔥 Project not found → ADD IT
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

  return {
    projects,
    loading,
    addProject,
    updateProjectStep,
    removeProject,
    reload: loadProjects,
  };
}
