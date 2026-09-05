import { describe, expect, it } from "vitest";
import {
  getAdminProjectResumeStep,
  isProjectSetupStatus,
} from "@/utils/adminProjectNavigation";

describe("admin project navigation", () => {
  it.each(["pending", "initiated", "INITIATED", "draft"])(
    "resumes setup for %s projects",
    (status) => expect(isProjectSetupStatus(status)).toBe(true)
  );

  it.each(["in_progress", "in-progress", "active", "completed"])(
    "opens the read-only view for %s projects",
    (status) => expect(isProjectSetupStatus(status)).toBe(false)
  );

  it("maps the shared project step to the admin flow", () => {
    expect(getAdminProjectResumeStep("project-1", 2)).toBe(3);
    expect(getAdminProjectResumeStep("project-1", 3)).toBe(4);
    expect(getAdminProjectResumeStep("project-1", 4)).toBe(5);
  });
});
