"use client";

import { consultantLabel } from "@/utils/consultantIdentity";

import { Fragment } from "react";
import {
  Alert,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { IProjectPaymentDTO } from "@/types/teamBuilder";
import { formatCurrency } from "@/utils/payments";
import {
  milestoneIdForPayment,
  paymentAmount,
  paymentCurrency,
  type BillingMilestone,
} from "@/utils/teamBuilderBilling";

export default function MilestoneBillingOverview({
  milestones,
  payments,
}: {
  milestones: BillingMilestone[];
  payments: IProjectPaymentDTO[];
}) {
  return (
    <Box sx={{ mb: 3, border: "1px solid #E2E8F0", borderRadius: 3, overflow: "hidden", bgcolor: "#fff" }}>
      <Box sx={{ px: 2.5, pt: 2.5 }}><Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Milestone overview <Box component="span" sx={{ ml: 1, fontSize: 12, color: "#64748B", fontWeight: 500 }}>{milestones.length} milestones</Box></Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Review costs and expand a milestone for its breakdown.
      </Typography>
      </Box>
      {!milestones.length ? (
        <Alert severity="info">No milestones found for this project.</Alert>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Table
            size="small"
            sx={{ minWidth: 650, "& th": { bgcolor: "#F8FAFC", color: "#64748B", fontSize: 11, fontWeight: 600, py: 1.5 }, "& td": { borderColor: "#F1F5F9", fontSize: 13, py: 1.75 }, "& th:first-of-type, & td:first-of-type": { pl: 2.5 } }}
            aria-label="Milestone estimates and payable amounts"
          >
            <TableHead>
              <TableRow>
                <TableCell>Milestone</TableCell>
                <TableCell align="right">Estimated</TableCell>
                <TableCell align="right">Payable</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Payment status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {milestones.map((milestone) => {
                const team = milestone.team;
                const records = payments.filter(
                  (payment) =>
                    milestoneIdForPayment(payment) === String(milestone.id),
                );
                const positive = records.filter(
                  (payment) => paymentAmount(payment) > 0,
                );
                const paid = positive.filter(
                  (payment) => payment.is_paid === true,
                );
                const status = positive.length
                  ? paid.length === positive.length
                    ? "Paid"
                    : paid.length
                      ? "Partially paid"
                      : "Unpaid"
                  : team?.payable_amount === 0
                    ? "No payment due"
                    : "Unpaid · no payment issued";
                return (
                  <Fragment key={milestone.id}>
                    <TableRow>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                          {milestone.name}
                        </Typography>
                        {milestone.teamError ? (
                          <Typography variant="caption" color="error">
                            {milestone.teamError}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                        {team
                          ? formatCurrency(
                              Number(team.estimated_amount),
                              team.currency,
                            )
                          : "Unavailable"}
                      </TableCell>
                      <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                        {team
                          ? formatCurrency(
                              Number(team.payable_amount),
                              team.currency,
                            )
                          : "Unavailable"}
                      </TableCell>
                      <TableCell>
                        {team?.currency || records[0]?.currency || "—"}
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={!team && !positive.length ? "Unavailable" : status}
                          sx={{ height: 24, fontSize: 11, fontWeight: 600, bgcolor: status === "Paid" ? "#ECFDF5" : status === "No payment due" ? "#F1F5F9" : "#FFFBEB", color: status === "Paid" ? "#047857" : status === "No payment due" ? "#64748B" : "#92400E" }} />
                      </TableCell>
                    </TableRow>
                    {team?.breakdown?.length || records.length ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ pt: "0 !important", pb: "10px !important" }}>
                          <details>
                            <summary
                              style={{ cursor: "pointer", padding: "2px 0", fontSize: 11, fontWeight: 600, color: "#64748B" }}
                            >
                              Cost & payment breakdown
                            </summary>
                            {team?.breakdown?.map((line) => (
                              <Typography
                                variant="body2"
                                key={line.consultant_id}
                                sx={{ my: 1, px: 1.5, py: 1, bgcolor: "#F8FAFC", borderRadius: 1.5, fontSize: 12, lineHeight: 1.8 }}
                              >
                                {consultantLabel(line.consultant_id)}
                                : {line.hours} h ×{" "}
                                {formatCurrency(
                                  Number(line.hourly_rate),
                                  line.currency || team.currency,
                                )}{" "}
                                ={" "}
                                {formatCurrency(
                                  Number(line.estimated_amount),
                                  line.currency || team.currency,
                                )}{" "}
                                estimated;{" "}
                                {formatCurrency(
                                  Number(line.payable_amount),
                                  line.currency || team.currency,
                                )}{" "}
                                payable ({line.status}).
                              </Typography>
                            ))}
                            {records.map((payment) => (
                              <Typography variant="body2" key={payment.id}>
                                Payment #{payment.id}:{" "}
                                {formatCurrency(
                                  paymentAmount(payment),
                                  paymentCurrency(payment, milestones),
                                )}{" "}
                                · {payment.is_paid === true ? "Paid" : "Unpaid"}
                              </Typography>
                            ))}
                          </details>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
