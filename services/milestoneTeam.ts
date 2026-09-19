import { request } from "@/utils/request";
import type { MilestoneAllocation, MilestoneTeam } from "@/types/milestoneTeam";

const url = (projectId: string, milestoneId: number) =>
  `/projects/${encodeURIComponent(projectId)}/milestones/${milestoneId}/team`;

function validateTeam(team: MilestoneTeam | null): MilestoneTeam {
  if (
    !team ||
    !Array.isArray(team.allocations) ||
    !Number.isInteger(team.revision) ||
    team.revision < 0 ||
    typeof team.locked !== "boolean" ||
    !Number.isFinite(team.estimated_amount) ||
    !Number.isFinite(team.payable_amount) ||
    typeof team.currency !== "string" ||
    !/^[A-Z]{3}$/.test(team.currency) ||
    team.allocations.some(
      (item) =>
        !item ||
        !String(item.consultant_id ?? "").match(/^\d+$/) ||
        !Number.isFinite(item.hours) ||
        item.hours <= 0,
    )
  ) {
    throw new Error(
      "The server did not return a valid milestone team. Reload before trying again.",
    );
  }
  return team;
}

export async function getMilestoneTeam(projectId: string, milestoneId: number) {
  const response = await request<undefined, MilestoneTeam>({
    url: url(projectId, milestoneId),
    method: "GET",
  });
  return validateTeam(response.data);
}

export async function saveMilestoneTeam(
  projectId: string,
  milestoneId: number,
  revision: number,
  allocations: MilestoneAllocation[],
) {
  const response = await request<
    { revision: number; allocations: MilestoneAllocation[] },
    MilestoneTeam
  >({
    url: url(projectId, milestoneId),
    method: "PUT",
    data: { revision, allocations },
  });
  return validateTeam(response.data);
}
