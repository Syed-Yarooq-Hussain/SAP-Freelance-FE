"use client";

import { Fragment } from "react";
import { Alert, Box, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { consultantLabel } from "@/utils/consultantIdentity";
import type { IProjectPaymentDTO } from "@/types/teamBuilder";
import { formatCurrency } from "@/utils/payments";
import { milestoneIdForPayment, paymentAmount, paymentCurrency, type BillingMilestone } from "@/utils/teamBuilderBilling";

export default function MilestoneBillingOverview({ milestones, payments }: { milestones: BillingMilestone[]; payments: IProjectPaymentDTO[] }) {
  return <Box sx={{ mb: 3, border: "1px solid #E2E8F0", borderRadius: 3, overflow: "hidden", bgcolor: "#fff" }}>
    <Box sx={{ px: 2.5, pt: 2.5 }}>
      <Typography sx={{ fontSize: 15, fontWeight: 700 }}>Milestone overview</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Full hired team, billed for the milestone duration. Balances reflect issued payments.</Typography>
    </Box>
    {!milestones.length ? <Alert severity="info">No milestones found for this project.</Alert> : <Box sx={{ overflowX: "auto" }}>
      <Table size="small" aria-label="Milestone billing" sx={{ minWidth: 700, "& th": { bgcolor: "#F8FAFC", color: "#64748B", fontSize: 11, fontWeight: 600 }, "& td": { borderColor: "#F1F5F9", fontSize: 13, py: 1.75 } }}>
        <TableHead><TableRow><TableCell>Milestone</TableCell><TableCell>Weeks</TableCell><TableCell align="right">Estimated</TableCell><TableCell align="right">Issued payable</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
        <TableBody>{milestones.map(milestone => {
          const records = payments.filter(payment => milestoneIdForPayment(payment) === String(milestone.id));
          const billing = milestone.billing?.basis === "hired_team_weeks" ? milestone.billing : undefined;
          const amounts = new Map<string, number>();
          records.forEach(payment => { const currency = paymentCurrency(payment, milestones); amounts.set(currency, (amounts.get(currency) ?? 0) + paymentAmount(payment)); });
          const positive = records.filter(payment => paymentAmount(payment) > 0);
          const paid = positive.filter(payment => payment.is_paid === true);
          const status = positive.length ? paid.length === positive.length ? "Paid" : paid.length ? "Partially paid" : "Unpaid" : records.length || billing?.payable_amount === 0 ? "No payment due" : "Not issued";
          const weeks = billing?.weeks ?? (milestone.required_hours != null ? Number(milestone.required_hours) / 40 : null);
          return <Fragment key={milestone.id}>
            <TableRow>
              <TableCell><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{milestone.name}</Typography><Typography variant="caption" color="text.secondary">{milestone.start_date?.split("T")[0]} – {milestone.due_date?.split("T")[0]}</Typography></TableCell>
              <TableCell>{weeks != null && Number.isFinite(weeks) ? Number(weeks.toFixed(2)) : "—"}</TableCell>
              <TableCell align="right">{billing ? `${formatCurrency(billing.estimated_amount, billing.currency)} ${billing.currency}` : "Not available yet"}</TableCell>
              <TableCell align="right">{amounts.size ? [...amounts].map(([currency, amount]) => <Box key={currency}>{formatCurrency(amount, currency)} {currency}</Box>) : billing?.payable_amount === 0 ? `${formatCurrency(0, billing.currency)} ${billing.currency}` : "Not issued"}</TableCell>
              <TableCell><Chip size="small" label={status} sx={{ fontSize: 11, bgcolor: status === "Paid" ? "#ECFDF5" : status === "Unpaid" ? "#FFFBEB" : "#F1F5F9", color: status === "Paid" ? "#047857" : "#64748B" }} /></TableCell>
            </TableRow>
            {(billing?.breakdown?.length || records.length) ? <TableRow><TableCell colSpan={5} sx={{ pt: "0 !important" }}><details><summary style={{ cursor: "pointer", fontSize: 11, color: "#64748B" }}>Cost & payment breakdown</summary>
              {billing?.breakdown?.map(line => <Typography variant="body2" key={line.consultant_id} sx={{ mt: 1 }}>{consultantLabel(line.consultant_id)}: {line.weekly_hours} hours/week × {billing.weeks} weeks = {line.total_hours} hours × {formatCurrency(line.client_hourly_rate, line.currency)} = {formatCurrency(line.amount, line.currency)} {line.currency}</Typography>)}
              {records.map(payment => <Typography variant="body2" key={payment.id}>Payment #{payment.id}: {formatCurrency(paymentAmount(payment), paymentCurrency(payment, milestones))} · {payment.is_paid === true ? "Paid" : "Unpaid"}</Typography>)}
            </details></TableCell></TableRow> : null}
          </Fragment>;
        })}</TableBody>
      </Table>
    </Box>}
  </Box>;
}
