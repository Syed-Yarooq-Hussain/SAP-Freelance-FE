import { useState } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  canParent,
  crewDraftKey,
  layoutCrew,
  readCrewDraft,
  removeRole,
  type CrewRole,
} from "@/utils/crewBuilder";
import { calculateTeamStats } from "@/utils/teamBuilderCalculations";
import type { TeamBuilderRow } from "@/types/teamBuilder";
import CrewWorkspace from "@/components/specific/teambuilder/CrewWorkspace";

const fetchRoles = vi.hoisted(() => vi.fn());
vi.mock("@/actions/common/useConsultantLevels", () => ({
  useConsultantLevels: () => ({
    mutate: fetchRoles,
    data: { data: ["Solution Architect", "Senior Consultant"] },
    isPending: false,
  }),
}));
const people: TeamBuilderRow[] = [
  {
    id: 1,
    name: "Aisha",
    coremodules: "FI",
    othersmodules: "CO",
    experience: "8 Years",
    rate: "$100/hour",
    avail: 40,
    request: 10,
  },
  {
    id: 2,
    name: "Bilal",
    coremodules: "ABAP",
    othersmodules: "N/A",
    experience: "5 Years",
    rate: "$50/hour",
    avail: 20,
    request: 20,
  },
];
const roles: CrewRole[] = [
  {
    id: "lead",
    title: "Solution Architect",
    personIds: [],
    parentId: null,
    placed: true,
  },
  {
    id: "child",
    title: "Senior Consultant",
    personIds: [],
    parentId: "lead",
    placed: true,
  },
  {
    id: "leaf",
    title: "Senior Consultant",
    personIds: [],
    parentId: "child",
    placed: true,
  },
];
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("crew structure", () => {
  it("rejects self-parenting, descendant cycles and missing parents", () => {
    expect(canParent(roles, "lead", "lead")).toBe(false);
    expect(canParent(roles, "lead", "leaf")).toBe(false);
    expect(canParent(roles, "child", "missing")).toBe(false);
    expect(canParent(roles, "leaf", "lead")).toBe(true);
  });
  it("promotes children when a position is deleted", () => {
    expect(
      removeRole(roles, "child").find((r) => r.id === "leaf")?.parentId,
    ).toBe("lead");
    expect(
      removeRole(roles, "lead").find((r) => r.id === "child")?.parentId,
    ).toBeNull();
  });
  it("loads scoped drafts and repairs cyclic persisted data", () => {
    const key = crewDraftKey("user1", "project1");
    expect(key).not.toBe(crewDraftKey("user2", "project1"));
    localStorage.setItem(key, "invalid json");
    expect(readCrewDraft(key)).toBeNull();
    localStorage.setItem(
      key,
      JSON.stringify({
        roles: roles.map((r) =>
          r.id === "lead" ? { ...r, parentId: "leaf" } : r,
        ),
        people,
        selectedIds: ["1"],
      }),
    );
    const draft = readCrewDraft(key)!;
    expect(layoutCrew(draft.roles).positions).toHaveLength(3);
  });
  it("counts each consultant once and uses each person's hours and rate", () => {
    expect(calculateTeamStats(people, ["1", "1", "2"])).toEqual({
      hoursPerWeek: 30,
      hoursPerMonth: 120,
      avgRatePerHour: 75,
      perMonthCost: 8000,
    });
  });
});

function Workspace() {
  const [teamRoles, setTeamRoles] = useState<CrewRole[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return (
    <CrewWorkspace
      rows={people}
      visibleRows={people}
      selectedIds={selectedIds}
      onSelect={setSelectedIds}
      roles={teamRoles}
      onRolesChange={setTeamRoles}
      onHoursChange={vi.fn()}
      search=""
      onSearch={vi.fn()}
      onProfile={vi.fn()}
      onSchedule={vi.fn()}
      loading={false}
      hasMore={false}
      onLoadMore={vi.fn()}
    />
  );
}

describe("crew workspace interaction", () => {
  it("adds API roles, assigns via click, places a role and unassigns on shortlist removal", () => {
    render(<Workspace />);
    fireEvent.change(screen.getByLabelText("Role to add"), {
      target: { value: "Solution Architect" },
    });
    fireEvent.click(screen.getByLabelText("Add role"));
    fireEvent.click(screen.getByLabelText("Select Aisha for assignment"));
    fireEvent.click(screen.getByRole("button", { name: "Assign Aisha" }));
    expect(screen.getByLabelText("Remove Aisha")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("STAFFED")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Place in hierarchy" }));
    expect(
      within(
        screen.getByRole("region", { name: "Project hierarchy" }),
      ).getByText("Aisha"),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Remove Aisha"));
    expect(screen.getByText("OPEN")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Unassign consultant 1 from Solution Architect"),
    ).not.toBeInTheDocument();
  });
  it("assigns a dropped consultant and supports undo/redo without dropping shortlist selection", () => {
    render(<Workspace />);
    fireEvent.change(screen.getByLabelText("Role to add"), {
      target: { value: "Senior Consultant" },
    });
    fireEvent.click(screen.getByLabelText("Add role"));
    const article = screen
      .getByRole("button", { name: "Senior Consultant" })
      .closest("article")!;
    fireEvent.drop(article, {
      dataTransfer: {
        getData: (key: string) =>
          key === "application/crew-person" ? "2" : "",
      },
    });
    expect(screen.getByText("STAFFED")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Undo role change"));
    expect(screen.getByText("OPEN")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove Bilal")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(screen.getByLabelText("Redo role change"));
    expect(screen.getByText("STAFFED")).toBeInTheDocument();
  });
});
