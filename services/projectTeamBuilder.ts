import { request } from "@/utils/request";
import { API_ROUTES } from "@/utils/api_routes";
import { canParent } from "@/utils/crewBuilder";
import type {
  ProjectTeamBuilderState,
  SaveProjectTeamBuilder,
} from "@/types/projectTeamBuilder";

// Enable only after the contract in docs/team-builder-backend-prompt.md is deployed.
export const isTeamBuilderApiEnabled = () =>
  process.env.NEXT_PUBLIC_TEAM_BUILDER_API_ENABLED === "true";

export function validateTeamBuilderState(
  data: ProjectTeamBuilderState | null,
): ProjectTeamBuilderState {
  const invalid = () => {
    throw new Error(
      "Invalid team builder response from server. Your changes have not been discarded.",
    );
  };
  if (
    !data ||
    !Number.isInteger(data.revision) ||
    data.revision < 0 ||
    !Array.isArray(data.roles) ||
    !Array.isArray(data.consultants)
  )
    return invalid();
  const people = new Set<string>();
  for (const person of data.consultants) {
    if (
      !person ||
      !Number.isInteger(Number(person.id)) ||
      Number(person.id) < 1 ||
      people.has(String(person.id)) ||
      !Number.isInteger(person.requested_hours) ||
      person.requested_hours < 1 ||
      typeof person.rate !== "number" ||
      !Number.isFinite(person.rate) ||
      person.rate < 0 ||
      typeof person.weekly_available_hours !== "number" ||
      !Number.isFinite(person.weekly_available_hours) ||
      person.weekly_available_hours < 0 ||
      !person.modules ||
      typeof person.modules.core !== "string" ||
      typeof person.modules.others !== "string"
    )
      return invalid();
    people.add(String(person.id));
  }
  const ids = new Set<string>();
  for (const role of data.roles) {
    if (
      !role ||
      typeof role.id !== "string" ||
      !role.id ||
      ids.has(role.id) ||
      typeof role.title !== "string" ||
      !role.title ||
      typeof role.placed !== "boolean" ||
      (role.parentId !== null && typeof role.parentId !== "string") ||
      (!role.placed && role.parentId !== null) ||
      !Array.isArray(role.personIds) ||
      role.personIds.some((id) => typeof id !== "string" || !people.has(id)) ||
      new Set(role.personIds).size !== role.personIds.length
    )
      return invalid();
    ids.add(role.id);
  }
  if (data.roles.some((role) => !canParent(data.roles, role.id, role.parentId)))
    return invalid();
  return data;
}

export async function getProjectTeamBuilder(
  projectId: string | number,
): Promise<ProjectTeamBuilderState> {
  const response = await request<undefined, ProjectTeamBuilderState>({
    url: API_ROUTES.PROJECT_TEAM_BUILDER(projectId),
    method: "GET",
  });
  return validateTeamBuilderState(response.data);
}

export async function saveProjectTeamBuilder(
  projectId: string | number,
  body: SaveProjectTeamBuilder,
): Promise<ProjectTeamBuilderState> {
  const response = await request<
    SaveProjectTeamBuilder,
    ProjectTeamBuilderState
  >({
    url: API_ROUTES.PROJECT_TEAM_BUILDER(projectId),
    method: "PUT",
    data: body,
  });
  return validateTeamBuilderState(response.data);
}
