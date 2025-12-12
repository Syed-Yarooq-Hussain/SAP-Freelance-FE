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

    const stored = JSON.parse(localStorage.getItem("tb_projects") || "[]");

    const filtered = stored.filter(
      (p: StoredProject) => p.status === "Initiated"
    );

    setProjects(filtered);
    setLoading(false);
  }, []);

  const saveProjects = (updated: StoredProject[]) => {
    localStorage.setItem("tb_projects", JSON.stringify(updated));
    window.dispatchEvent(new Event("tb_projects_updated"));
    loadProjects();
  };

  const addProject = (proj: StoredProject) => {
    const stored = JSON.parse(localStorage.getItem("tb_projects") || "[]");
    stored.push(proj);
    const trimmed = stored.slice(-5);

    saveProjects(trimmed);
  };

  const updateProjectStep = (projectId: string, step: number) => {
    const stored = JSON.parse(localStorage.getItem("tb_projects") || "[]");

    const updated = stored.map((p: StoredProject) =>
      p.id == projectId ? { ...p, step } : p
    );

    saveProjects(updated);
  };

  const removeProject = (projectId: string) => {
    const stored = JSON.parse(localStorage.getItem("tb_projects") || "[]");

    const updated = stored.filter((p: StoredProject) => p.id != projectId);

    saveProjects(updated);
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
