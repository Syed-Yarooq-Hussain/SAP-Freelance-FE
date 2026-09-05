import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProfitMarginCell from "@/components/admin/ProfitMarginCell";

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  reset: vi.fn(),
  toast: vi.fn(),
}));

vi.mock("@/actions/admin/useAdminClientManagement", () => ({
  useUpdateClientProfitMargin: () => ({
    mutate: mocks.mutate,
    reset: mocks.reset,
    isPending: false,
  }),
}));

vi.mock("@/providers/ToastProvider", () => ({
  useToast: () => ({ toast: mocks.toast }),
}));

describe("ProfitMarginCell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mutate.mockImplementation((_payload, options) => options.onSuccess());
  });
  afterEach(cleanup);

  const startEditing = (value: string) => {
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
  };

  it.each(["-1", "2.5"])("rejects invalid margin %s", (value) => {
    render(<ProfitMarginCell clientId={12} value={0} />);
    startEditing(value);
    expect(screen.getByText("Enter a non-negative whole number.")).toBeInTheDocument();
    expect(mocks.mutate).not.toHaveBeenCalled();
  });

  it("allows a positive whole-number margin", () => {
    render(<ProfitMarginCell clientId={12} value={0} />);
    startEditing("20");
    expect(mocks.mutate).toHaveBeenCalledWith(
      { clientId: 12, profitMarginPercentage: 20 },
      expect.any(Object)
    );
  });

  it("allows zero after confirming replacement of a non-zero margin", () => {
    render(<ProfitMarginCell clientId={12} value={20} />);
    startEditing("0");
    expect(mocks.mutate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Replace" }));
    expect(mocks.mutate).toHaveBeenCalledWith(
      { clientId: 12, profitMarginPercentage: 0 },
      expect.any(Object)
    );
  });
});
