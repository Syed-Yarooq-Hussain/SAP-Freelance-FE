export const isProjectSetupStatus = (status: string | null | undefined) => {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

  return ["pending", "initiated", "initiate", "draft"].includes(normalized);
};

export const getAdminProjectResumeStep = (
  projectId: string | number,
  apiStep?: number
) => {
  let clientFlowStep = Number(apiStep || 0);

  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(localStorage.getItem("tb_projects") || "[]") as Array<{
        id: string | number;
        step?: number;
      }>;
      const savedStep = stored.find(
        (project) => String(project.id) === String(projectId)
      )?.step;
      if (savedStep) clientFlowStep = Math.max(clientFlowStep, savedStep);
    } catch {
      // Fall back to the API step when local progress is unavailable.
    }
  }

  // Admin has an additional client-selection step before the shared flow.
  return Math.max(3, Math.min(5, (clientFlowStep || 2) + 1));
};
