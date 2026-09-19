import type { IProjectConsultant } from "@/types/teamBuilder";
import type { MilestoneAllocation } from "@/types/milestoneTeam";

export const milestoneRate = (candidate: IProjectConsultant) => {
  const agreed = Number(candidate.decided_rate);
  const listed = Number(candidate.rate);
  // Rates from the project API already include the client's margin.
  return Number.isFinite(agreed) && agreed > 0
    ? agreed
    : candidate.status !== "hired" && Number.isFinite(listed) && listed > 0
      ? listed
      : null;
};

export function milestoneEstimate(
  allocations: MilestoneAllocation[],
  candidates: IProjectConsultant[],
) {
  const currencies = new Set<string>();
  let estimate = 0;
  let hired = 0;
  let hours = 0;
  let invalid = false;
  for (const allocation of allocations) {
    const candidate = candidates.find(
      (item) => String(item.consultant_id) === String(allocation.consultant_id),
    );
    const rate = candidate ? milestoneRate(candidate) : null;
    if (
      !candidate ||
      candidate.status === "rejected" ||
      candidate.deleted_at ||
      rate === null ||
      !Number.isFinite(allocation.hours) ||
      allocation.hours <= 0 ||
      allocation.hours > 100000 ||
      Math.abs(allocation.hours * 100 - Math.round(allocation.hours * 100)) >
        0.000001
    ) {
      invalid = true;
      continue;
    }
    currencies.add(candidate.currency || "USD");
    const amount = Math.round(allocation.hours * rate * 100) / 100;
    estimate += amount;
    hours += allocation.hours;
    if (candidate.status === "hired") hired += amount;
  }
  return {
    estimate: Math.round(estimate * 100) / 100,
    hired: Math.round(hired * 100) / 100,
    hours: Math.round(hours * 100) / 100,
    invalid: invalid || currencies.size > 1 || allocations.length > 100,
    currency: [...currencies][0] || "USD",
    mixedCurrency: currencies.size > 1,
  };
}
