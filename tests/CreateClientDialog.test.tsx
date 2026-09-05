import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CreateClientDialog from "@/components/admin/CreateClientDialog";

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  reset: vi.fn(),
  toast: vi.fn(),
}));

vi.mock("@/actions/admin/useAdminClientManagement", () => ({
  useCreateAdminClient: () => ({
    mutate: mocks.mutate,
    reset: mocks.reset,
    isPending: false,
  }),
}));

vi.mock("@/providers/ToastProvider", () => ({
  useToast: () => ({ toast: mocks.toast }),
}));

describe("CreateClientDialog", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);

  const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "client@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "StrongPassword123!" },
    });
  };

  it("creates a verified client and closes the modal", () => {
    const onClose = vi.fn();
    mocks.mutate.mockImplementation((_payload, options) => options.onSuccess());
    render(<CreateClientDialog open onClose={onClose} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Create Client" }));

    expect(mocks.mutate).toHaveBeenCalledWith(
      { email: "client@example.com", password: "StrongPassword123!" },
      expect.any(Object)
    );
    expect(mocks.toast).toHaveBeenCalledWith(
      "Verified client created successfully.",
      "success"
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("shows duplicate email errors returned by the backend", () => {
    mocks.mutate.mockImplementation((_payload, options) =>
      options.onError(new Error("Email already exists"))
    );
    render(<CreateClientDialog open onClose={vi.fn()} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Create Client" }));

    expect(screen.getByText("Email already exists")).toBeInTheDocument();
  });

  it("rejects an invalid email, short password, and mismatched confirmation", () => {
    render(<CreateClientDialog open onClose={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "different" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Client" }));

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Password must contain at least 8 characters.")).toBeInTheDocument();
    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    expect(mocks.mutate).not.toHaveBeenCalled();
  });
});
