import type { IMilestone, IProjectPaymentDTO } from "@/types/teamBuilder";
import type { MilestoneTeam } from "@/types/milestoneTeam";

export type BillingMilestone = IMilestone & {
  team?: MilestoneTeam;
  teamError?: string;
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
      ?.team?.currency ||
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
  const snapshotIds = new Set<string>();
  for (const milestone of milestones) {
    if (!milestone.team || milestone.team.configured === false) continue;
    snapshotIds.add(String(milestone.id));
    group(milestone.team.currency).payable += Number(
      milestone.team.payable_amount,
    );
  }
  // Payments back their milestone snapshot, rather than being added a second time.
  // Custom payments and records whose snapshot is unavailable count once here.
  for (const payment of payments) {
    const amount = paymentAmount(payment);
    const total = group(paymentCurrency(payment, milestones));
    if (!snapshotIds.has(milestoneIdForPayment(payment)))
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
