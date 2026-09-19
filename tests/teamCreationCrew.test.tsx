import { useState } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TeamBuilderRow } from "@/types/teamBuilder";
import { crewDraftKey } from "@/utils/crewBuilder";
import { CustomError } from "@/exceptions/custom-exception";

const api = vi.hoisted(() => ({
  enabled: false,
  getTeam: vi.fn(),
  saveTeam: vi.fn(),
  load: vi.fn(),
  create: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  project: vi.fn(),
  levels: vi.fn(),
  toast: vi.fn(),
  persist: vi.fn(),
  next: vi.fn(),
}));
vi.mock("@/services/projectTeamBuilder", () => ({
  isTeamBuilderApiEnabled: () => api.enabled,
  getProjectTeamBuilder: api.getTeam,
  saveProjectTeamBuilder: api.saveTeam,
}));
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: 77 } } }),
}));
vi.mock("@/actions/consultants/useClientConsultants", () => ({
  useClientConsultants: () => ({ mutate: api.load, isPending: false }),
}));
vi.mock("@/actions/projects/useCreateProject", () => ({
  useCreateProject: () => ({ mutateAsync: api.create }),
}));
vi.mock("@/actions/projects/useAddConsultants", () => ({
  useAddConsultants: () => ({ mutateAsync: api.add }),
  useRemoveConsultant: () => ({ mutateAsync: api.remove }),
}));
vi.mock("@/actions/projects/useGetProjectConsultants", () => ({
  useGetProjectConsultants: () => ({ mutate: api.project }),
}));
vi.mock("@/actions/common/useConsultantLevels", () => ({
  useConsultantLevels: () => ({
    mutate: api.levels,
    data: { data: ["Senior"] },
  }),
}));
vi.mock("@/providers/ToastProvider", () => ({
  useToast: () => ({ toast: api.toast }),
}));
vi.mock("@/utils/useProjectProgress", () => ({
  useProjectProgress: () => ({ persistRequestedHours: api.persist }),
}));
vi.mock("@/utils/useAnimatedCounter", () => ({
  useAnimatedCounter: (value: number) => value,
}));
vi.mock("@/components/StatCard", () => ({ default: () => null }));
vi.mock("@/components/Popup", () => ({ default: () => null }));
vi.mock("@/components/specific/teambuilder/ConsultantProfileModal", () => ({
  default: () => null,
}));
vi.mock("@/components/specific/teambuilder/TeamBuilderFilters", () => ({
  default: ({
    open,
    onApply,
  }: {
    open: boolean;
    onApply: (filters: object) => void;
  }) =>
    open ? (
      <button onClick={() => onApply({ country: "Germany" })}>
        Apply test filter
      </button>
    ) : null,
}));
import TeamCreation from "@/components/specific/teambuilder/TeamCreation";
import RoleHierarchy from "@/components/RoleHierarchy";

function Page({ projectId }: { projectId?: string }) {
  const [rows, setRows] = useState<TeamBuilderRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return (
    <TeamCreation
      rows={rows}
      setRows={setRows}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      onNext={api.next}
      projectId={projectId}
    />
  );
}
const consultant = (id: number, name: string) => ({
  id,
  name,
  modules: { core: "FI", others: "CO" },
  rate: 100,
  experience: 8,
  weekly_available_hours: 40,
});
beforeEach(() => {
  vi.clearAllMocks();
  api.enabled = false;
  api.getTeam.mockReset();
  api.saveTeam.mockReset();
  api.create.mockResolvedValue({ data: { id: "new-project" } });
  api.add.mockResolvedValue({});
  api.remove.mockResolvedValue({});
  api.load.mockImplementation((query, handlers) =>
    handlers.onSuccess({
      data: query.country ? [consultant(2, "Bilal")] : [consultant(1, "Aisha")],
      pagination: { total: 1, total_pages: 1, current_page: 1, limit: 20 },
    }),
  );
  api.project.mockImplementation((_query, handlers) =>
    handlers.onSuccess({ data: [] }),
  );
});
afterEach(() => {
  cleanup();
  localStorage.clear();
});

it("renders the Step 2 hierarchy on a fresh browser directly from the server", async () => {
  api.enabled = true;
  api.getTeam.mockResolvedValue({
    revision: 2,
    roles: [
      {
        id: "r1",
        title: "Senior",
        personIds: ["1"],
        parentId: null,
        placed: true,
      },
    ],
    consultants: [{ ...consultant(1, "Aisha"), requested_hours: 16 }],
  });
  render(<RoleHierarchy projectId="existing" />);
  expect(
    await screen.findByText("Saved project structure"),
  ).toBeInTheDocument();
  expect(screen.getByText("Aisha")).toBeInTheDocument();
  expect(localStorage.length).toBe(0);
});

it("keeps selected people and edited hours through filtering, and saves them to the server", async () => {
  render(<Page />);
  fireEvent.click(await screen.findByLabelText("Shortlist Aisha"));
  fireEvent.change(screen.getByLabelText("Requested hours for Aisha"), {
    target: { value: "12" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Filters" }));
  fireEvent.click(screen.getByText("Apply test filter"));
  expect(await screen.findByText("Bilal")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Selected 1/ }));
  expect(screen.getByLabelText("Requested hours for Aisha")).toHaveValue(12);
  fireEvent.click(screen.getByRole("button", { name: "Save & Continue" }));
  await waitFor(() => expect(api.next).toHaveBeenCalledWith("new-project"));
  expect(api.add).toHaveBeenCalledWith({
    projectId: "new-project",
    body: [{ consultant_id: 1, requested_hours: 12 }],
  });
  expect(
    JSON.parse(localStorage.getItem(crewDraftKey("77", "new-project"))!)
      .selectedIds,
  ).toEqual(["1"]);
});

it("restores a project draft and persists edited hours for an existing shortlist member", async () => {
  const person: TeamBuilderRow = {
    id: 1,
    name: "Aisha",
    coremodules: "FI",
    othersmodules: "CO",
    experience: "8 Years",
    rate: "$100/hour",
    avail: 40,
    request: 9,
  };
  localStorage.setItem(
    crewDraftKey("77", "existing"),
    JSON.stringify({
      roles: [
        {
          id: "role",
          title: "Senior",
          personIds: ["1"],
          placed: true,
          parentId: null,
        },
      ],
      people: [person],
      selectedIds: ["1"],
    }),
  );
  api.project.mockImplementation((_query, handlers) =>
    handlers.onSuccess({ data: [{ consultant_id: 1, requested_hours: 6 }] }),
  );
  render(<Page projectId="existing" />);
  expect(await screen.findByLabelText("Requested hours for Aisha")).toHaveValue(
    9,
  );
  fireEvent.change(screen.getByLabelText("Requested hours for Aisha"), {
    target: { value: "15" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save & Continue" }));
  await waitFor(() => expect(api.next).toHaveBeenCalledWith("existing"));
  expect(api.create).not.toHaveBeenCalled();
  expect(api.add).toHaveBeenCalledWith({
    projectId: "existing",
    body: [{ consultant_id: 1, requested_hours: 15 }],
  });
  expect(screen.getByText("STAFFED")).toBeInTheDocument();
});

it("blocks invalid hours and reuses the created project when a shortlist save is retried", async () => {
  api.add.mockRejectedValueOnce(new Error("Temporary error"));
  render(<Page />);
  fireEvent.click(await screen.findByLabelText("Shortlist Aisha"));
  fireEvent.click(screen.getByRole("button", { name: "Save & Continue" }));
  expect(api.create).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText("Requested hours for Aisha"), {
    target: { value: "10" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save & Continue" }));
  await waitFor(() =>
    expect(api.toast).toHaveBeenCalledWith("Temporary error", "error"),
  );
  fireEvent.click(screen.getByRole("button", { name: "Save & Continue" }));
  await waitFor(() => expect(api.next).toHaveBeenCalledWith("new-project"));
  expect(api.create).toHaveBeenCalledTimes(1);
});

it("loads the server snapshot over a stale draft and saves the full team atomically", async () => {
  api.enabled = true;
  // Discovery reports free capacity; the project snapshot includes this team's booking.
  api.load.mockImplementation((_query, handlers) =>
    handlers.onSuccess({
      data: [{ ...consultant(1, "Aisha"), weekly_available_hours: 8 }],
      pagination: { total: 1, total_pages: 1, current_page: 1, limit: 20 },
    }),
  );
  localStorage.setItem(
    crewDraftKey("77", "existing"),
    JSON.stringify({
      roles: [
        {
          id: "old",
          title: "Old draft",
          personIds: [],
          placed: false,
          parentId: null,
        },
      ],
      people: [],
      selectedIds: [],
    }),
  );
  const roles = [
    {
      id: "server-role",
      title: "Senior",
      personIds: ["1"],
      placed: true,
      parentId: null,
    },
  ];
  api.getTeam.mockResolvedValue({
    revision: 4,
    roles,
    consultants: [{ ...consultant(1, "Aisha"), requested_hours: 16 }],
  });
  api.saveTeam.mockResolvedValue({
    revision: 5,
    roles,
    consultants: [{ ...consultant(1, "Aisha"), requested_hours: 20 }],
  });
  render(<Page projectId="existing" />);
  await waitFor(() =>
    expect(screen.getByLabelText("Requested hours for Aisha")).toHaveValue(16),
  );
  expect(screen.queryByText("Old draft")).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Requested hours for Aisha"), {
    target: { value: "20" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save & Continue" }));
  await waitFor(() => expect(api.next).toHaveBeenCalledWith("existing"));
  expect(api.saveTeam).toHaveBeenCalledWith("existing", {
    revision: 4,
    roles,
    consultants: [{ consultant_id: 1, requested_hours: 20 }],
  });
  expect(api.add).not.toHaveBeenCalled();
  expect(api.remove).not.toHaveBeenCalled();
  expect(api.project).not.toHaveBeenCalled();
});

it("blocks a failed server load and retries without silently using a browser-only save", async () => {
  api.enabled = true;
  api.getTeam.mockRejectedValueOnce(new Error("Backend unavailable"));
  api.getTeam.mockResolvedValueOnce({
    revision: 0,
    roles: [],
    consultants: [{ ...consultant(1, "Aisha"), requested_hours: 8 }],
  });
  render(<Page projectId="existing" />);
  expect(await screen.findByText("Backend unavailable")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Save & Continue" }),
  ).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Reload saved team" }));
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Save & Continue" }),
    ).toBeEnabled(),
  );
  expect(api.getTeam).toHaveBeenCalledTimes(2);
  expect(api.next).not.toHaveBeenCalled();
});

it("preserves edits and blocks continuation on a revision conflict until explicit reload", async () => {
  api.enabled = true;
  api.getTeam.mockResolvedValue({
    revision: 3,
    roles: [],
    consultants: [{ ...consultant(1, "Aisha"), requested_hours: 8 }],
  });
  api.saveTeam.mockRejectedValue(new CustomError(409, "Stale team revision"));
  render(<Page projectId="existing" />);
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Save & Continue" }),
    ).toBeEnabled(),
  );
  fireEvent.change(screen.getByLabelText("Requested hours for Aisha"), {
    target: { value: "14" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save & Continue" }));
  await screen.findByRole("button", { name: "Reload saved team" });
  expect(screen.getByLabelText("Requested hours for Aisha")).toHaveValue(14);
  expect(
    screen.getByRole("button", { name: "Save & Continue" }),
  ).toBeDisabled();
  expect(api.next).not.toHaveBeenCalled();
  expect(api.add).not.toHaveBeenCalled();
});

it("does not advance after a non-conflict atomic save failure", async () => {
  api.enabled = true;
  api.getTeam.mockResolvedValue({
    revision: 1,
    roles: [],
    consultants: [{ ...consultant(1, "Aisha"), requested_hours: 8 }],
  });
  api.saveTeam.mockRejectedValue(new Error("Save failed"));
  render(<Page projectId="existing" />);
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Save & Continue" }),
    ).toBeEnabled(),
  );
  fireEvent.click(screen.getByRole("button", { name: "Save & Continue" }));
  await waitFor(() =>
    expect(api.toast).toHaveBeenCalledWith("Save failed", "error"),
  );
  expect(api.next).not.toHaveBeenCalled();
  expect(api.add).not.toHaveBeenCalled();
});
