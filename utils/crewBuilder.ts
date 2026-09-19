import type { TeamBuilderRow } from "@/types/teamBuilder";

export interface CrewRole {
  id: string;
  title: string;
  personIds: string[];
  parentId: string | null;
  placed: boolean;
}
export interface CrewDraft {
  roles: CrewRole[];
  people: TeamBuilderRow[];
  selectedIds: string[];
}

export function canParent(
  roles: CrewRole[],
  id: string,
  parentId: string | null,
): boolean {
  const visited = new Set([id]);
  let current = parentId;
  while (current) {
    if (visited.has(current)) return false;
    visited.add(current);
    const parent = roles.find((role) => role.id === current);
    if (!parent?.placed) return false;
    current = parent.parentId;
  }
  return true;
}

export function removeRole(roles: CrewRole[], id: string): CrewRole[] {
  const parent = roles.find((role) => role.id === id)?.parentId ?? null;
  return roles
    .filter((role) => role.id !== id)
    .map((role) =>
      role.parentId === id ? { ...role, parentId: parent } : role,
    );
}

export function crewDraftKey(
  owner: string,
  projectId?: string | number | null,
  clientId?: string | number,
) {
  return `tb_crew_${owner}_${projectId ? `project_${projectId}` : `new_${clientId ?? "self"}`}`;
}

export function readCrewDraft(key: string): CrewDraft | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    if (
      !value ||
      !Array.isArray(value.roles) ||
      !Array.isArray(value.people) ||
      !Array.isArray(value.selectedIds)
    )
      return null;
    const roles: CrewRole[] = value.roles.filter(
      (r: CrewRole) =>
        r &&
        typeof r.id === "string" &&
        typeof r.title === "string" &&
        Array.isArray(r.personIds) &&
        r.personIds.every((id) => typeof id === "string") &&
        (r.parentId === null || typeof r.parentId === "string") &&
        typeof r.placed === "boolean",
    );
    const unique = roles.filter(
      (role, index) => roles.findIndex((r) => r.id === role.id) === index,
    );
    return {
      roles: unique.map((role) => ({
        ...role,
        parentId: canParent(unique, role.id, role.parentId)
          ? role.parentId
          : null,
      })),
      people: value.people.filter(
        (p: TeamBuilderRow) =>
          p &&
          (typeof p.id === "string" || typeof p.id === "number") &&
          typeof p.rate === "string",
      ),
      selectedIds: value.selectedIds.filter(
        (id: unknown) => typeof id === "string",
      ),
    };
  } catch {
    return null;
  }
}

/** Lay out each subtree in its own horizontal band so siblings never overlap. */
export function layoutCrew(roles: CrewRole[]) {
  const placed = roles.filter((r) => r.placed);
  const positions: { role: CrewRole; x: number; y: number }[] = [];
  let nextLeaf = 0;
  const walk = (role: CrewRole, depth: number): number => {
    const children = placed.filter((r) => r.parentId === role.id);
    const xs = children.map((child) => walk(child, depth + 1));
    const x = xs.length
      ? (xs[0] + xs[xs.length - 1]) / 2
      : nextLeaf++ * 244 + 30;
    positions.push({ role, x, y: depth * 168 + 36 });
    return x;
  };
  placed
    .filter((r) => !r.parentId || !placed.some((p) => p.id === r.parentId))
    .forEach((r) => walk(r, 0));
  return {
    positions,
    width: Math.max(500, nextLeaf * 244 + 60),
    height: Math.max(400, ...positions.map((p) => p.y + 160)),
  };
}
