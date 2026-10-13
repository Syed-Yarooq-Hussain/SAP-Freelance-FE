import type { IMilestone, IProjectPaymentDTO } from "@/types/teamBuilder";
import type { MilestoneTeam } from "@/types/milestoneTeam";

export type BillingMilestone = IMilestone & {
  team?: MilestoneTeam;
  teamError?: string;
  billing?: {
    basis: "hired_team_weeks";
    weeks: number;
    estimated_amount: number;
    payable_amount: number;
    currency: string;
    breakdown?: { consultant_id: string | number; weekly_hours: number; total_hours: number; client_hourly_rate: number; amount: number; currency: string }[];
  };
};

export function paymentAmount(payment: IProjectPaymentDTO): number {
  const value = Number(payment.amount);
  if (payment.amount == null || !Number.isFinite(value) || value < 0)
    throw new Error(`Invalid amount for payment #${payment.id}`);
  return value;
}

export function milestoneIdForPayment(payment: IProjectPaymentDTO) {
  return String(payment.project_milestone_id || payment.milestone?.id || "");
}

export function paymentCurrency(
  payment: IProjectPaymentDTO,
  milestones: BillingMilestone[],
) {
  return (
    payment.currency ||
    milestones.find((m) => String(m.id) === milestoneIdForPayment(payment))
      ?.billing?.currency ||
    "USD"
  );
}

export function summarizeBilling(
  milestones: BillingMilestone[],
  payments: IProjectPaymentDTO[],
) {
  const groups = new Map<
    string,
    { currency: string; payable: number; paid: number; remaining: number }
  >();
  const group = (currency: string) => {
    if (!groups.has(currency))
      groups.set(currency, { currency, payable: 0, paid: 0, remaining: 0 });
    return groups.get(currency)!;
  };
  // Issued payments are the sole balance source; never add allocation snapshots.
  for (const payment of payments) {
    const amount = paymentAmount(payment);
    const total = group(paymentCurrency(payment, milestones));
    total.payable += amount;
    if (payment.is_paid === true) total.paid += amount;
    else total.remaining += amount;
  }
  return [...groups.values()].map((total) => ({
    ...total,
    payable: Math.round(total.payable * 100) / 100,
    paid: Math.round(total.paid * 100) / 100,
    remaining: Math.round(total.remaining * 100) / 100,
  }));
}
