import { beforeEach, describe, expect, it, vi } from "vitest";
const request = vi.hoisted(() => vi.fn());
vi.mock("@/utils/request", () => ({ request }));
import {
  getProjectTeamBuilder,
  saveProjectTeamBuilder,
  validateTeamBuilderState,
} from "@/services/projectTeamBuilder";
import type { ProjectTeamBuilderState } from "@/types/projectTeamBuilder";

const snapshot: ProjectTeamBuilderState = {
  revision: 2,
  roles: [
    {
      id: "role-1",
      title: "Senior",
      placed: true,
      parentId: null,
      personIds: ["202"],
    },
  ],
  consultants: [
    {
      id: 202,
      name: "Aisha",
      requested_hours: 16,
      weekly_available_hours: 40,
      rate: 100,
      currency: "USD",
      modules: { core: "FI", others: "CO" },
    },
  ],
};
beforeEach(() => request.mockReset());
describe("team builder API contract", () => {
  it("uses authenticated request infrastructure and exact GET/PUT paths with revisions", async () => {
    request.mockResolvedValue({ data: snapshot });
    expect(await getProjectTeamBuilder(7)).toEqual(snapshot);
    expect(request).toHaveBeenLastCalledWith({
      url: "/projects/7/team-builder",
      method: "GET",
    });
    const body = {
      revision: 1,
      roles: snapshot.roles,
      consultants: [{ consultant_id: 202, requested_hours: 16 }],
    };
    expect(await saveProjectTeamBuilder(7, body)).toEqual(snapshot);
    expect(request).toHaveBeenLastCalledWith({
      url: "/projects/7/team-builder",
      method: "PUT",
      data: body,
    });
  });
  it("rejects malformed snapshots and cyclic or dangling assignments", () => {
    expect(() => validateTeamBuilderState(null)).toThrow(
      "Invalid team builder response",
    );
    expect(() =>
      validateTeamBuilderState({ ...snapshot, revision: -1 }),
    ).toThrow();
    expect(() =>
      validateTeamBuilderState({
        ...snapshot,
        roles: [{ ...snapshot.roles[0], parentId: "role-1" }],
      }),
    ).toThrow();
    expect(() =>
      validateTeamBuilderState({
        ...snapshot,
        roles: [{ ...snapshot.roles[0], personIds: ["999"] }],
      }),
    ).toThrow();
    expect(() =>
      validateTeamBuilderState({
        ...snapshot,
        consultants: [
          { ...snapshot.consultants[0], weekly_available_hours: undefined },
        ],
      }),
    ).toThrow();
  });
  it("accepts empty initial projects and multi-role assignments without duplicating members", () => {
    expect(
      validateTeamBuilderState({ revision: 0, roles: [], consultants: [] })
        .revision,
    ).toBe(0);
    expect(
      validateTeamBuilderState({
        ...snapshot,
        roles: [
          ...snapshot.roles,
          { ...snapshot.roles[0], id: "role-2", parentId: "role-1" },
        ],
      }).consultants,
    ).toHaveLength(1);
  });
});
