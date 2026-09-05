import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ConsultantRateDisplay from "@/components/specific/teambuilder/ConsultantRateDisplay";
import { buildConsultantQuery } from "@/utils/consultantQuery";

const finalRateMatcher = (_: string, element: Element | null) =>
  element?.tagName === "P" && element.textContent === "$120.00/hr";

describe("client-specific consultant pricing", () => {
  afterEach(cleanup);

  it("includes selected client_id for an admin consultant request", () => {
    expect(buildConsultantQuery({ page: 1 }, 123)).toEqual({
      page: 1,
      client_id: 123,
    });
  });

  it("does not impersonate a client during normal client discovery", () => {
    expect(buildConsultantQuery({ page: 1 })).toEqual({ page: 1 });
    expect(buildConsultantQuery({ page: 1 })).not.toHaveProperty("client_id");
  });

  it("displays the backend rate without applying the margin again", () => {
    render(
      <ConsultantRateDisplay
        rateValue={120}
        baseRate={100}
        profitMarginPercentage={20}
        currency="USD"
        showAdminPricing
      />
    );
    expect(screen.getByText(finalRateMatcher)).toBeInTheDocument();
    expect(screen.queryByText(/\$144/)).not.toBeInTheDocument();
    expect(screen.getByText(/Base \$100\.00.*Margin 20%/)).toBeInTheDocument();
  });

  it("hides base rate and margin from client users", () => {
    render(
      <ConsultantRateDisplay
        rateValue={120}
        baseRate={100}
        profitMarginPercentage={20}
        currency="USD"
      />
    );
    expect(screen.getByText(finalRateMatcher)).toBeInTheDocument();
    expect(screen.queryByText(/Base/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Margin/)).not.toBeInTheDocument();
  });
});
