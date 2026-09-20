"use client";

import { consultantLabel } from "@/utils/consultantIdentity";

import { Fragment } from "react";
import {
  Alert,
  Box,
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
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6">All milestones</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Estimates include selected candidates. Payable amounts come from saved
        hired allocations. Payment status comes from issued payment records.
      </Typography>
      {!milestones.length ? (
        <Alert severity="info">No milestones found for this project.</Alert>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Table
            size="small"
            aria-label="Milestone estimates and payable amounts"
          >
            <TableHead>
              <TableRow>
                <TableCell>Milestone</TableCell>
                <TableCell>Estimated amount</TableCell>
                <TableCell>Payable amount</TableCell>
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
                        <Typography fontWeight={600}>
                          {milestone.name}
                        </Typography>
                        {milestone.teamError ? (
                          <Typography variant="caption" color="error">
                            {milestone.teamError}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {team
                          ? formatCurrency(
                              Number(team.estimated_amount),
                              team.currency,
                            )
                          : "Unavailable"}
                      </TableCell>
                      <TableCell>
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
                        {!team && !positive.length
                          ? "Payment status unavailable"
                          : status}
                      </TableCell>
                    </TableRow>
                    {team?.breakdown?.length || records.length ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <details>
                            <summary
                              style={{ cursor: "pointer", padding: "8px 0" }}
                            >
                              View calculation and payment records
                            </summary>
                            {team?.breakdown?.map((line) => (
                              <Typography
                                variant="body2"
                                key={line.consultant_id}
                                sx={{ my: 1 }}
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
