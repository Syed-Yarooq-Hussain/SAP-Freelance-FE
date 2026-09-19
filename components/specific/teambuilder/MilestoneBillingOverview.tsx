"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { getProjectMilestonesService } from "@/services/getProjectMilestones";
import type { IMilestone } from "@/types/teamBuilder";
import type { MilestoneTeam } from "@/types/milestoneTeam";
import { formatCurrency } from "@/utils/payments";

type BillingMilestone = IMilestone & {
  team?: MilestoneTeam & {
    configured?: boolean;
    breakdown?: { consultant_id: string; hours: number; hourly_rate: number; status: string; estimated_amount: number; payable_amount: number; currency: string }[];
  };
};

export default function MilestoneBillingOverview({ projectId }: { projectId: string }) {
  const [rows, setRows] = useState<BillingMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getProjectMilestonesService(projectId)
      .then(response => { if (active) setRows(response.data ?? []); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Could not load milestone billing"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [projectId, attempt]);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6">Milestone billing overview</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Estimates include all selected candidates. Payable amounts include only hired candidates with an agreed rate. Taxes and service charges are separate. Custom payments are listed below and are not milestone estimates.
      </Typography>
      {loading ? <CircularProgress size={22} /> : error ? (
        <Alert severity="error" action={<Button onClick={() => setAttempt(value => value + 1)}>Retry</Button>}>{error}</Alert>
      ) : !rows.length ? <Alert severity="info">No milestones found for this project.</Alert> : (
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small" aria-label="Milestone estimates and payable amounts">
            <TableHead><TableRow><TableCell>Milestone</TableCell><TableCell>Estimated</TableCell><TableCell>Payable</TableCell><TableCell>Calculation / status</TableCell></TableRow></TableHead>
            <TableBody>{rows.map(row => {
              const team = row.team;
              const configured = team && team.configured !== false;
              const currency = team?.currency || "USD";
              return <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{configured ? formatCurrency(team.estimated_amount, currency) : "Not configured"}</TableCell>
                <TableCell>{configured ? formatCurrency(team.payable_amount, currency) : "Not configured"}</TableCell>
                <TableCell>
                  <Typography variant="body2">{team?.locked ? "Paid ? locked" : !configured ? "Save this milestone's team first" : team.payable_amount > 0 ? "Billable hired allocations" : "No hired allocation is billable yet"}</Typography>
                  {!!team?.breakdown?.length && <details><summary>View calculation</summary>{team.breakdown.map(line => (
                    <Typography variant="body2" key={line.consultant_id} sx={{ mt: 0.5 }}>
                      Consultant #{line.consultant_id}: {line.hours} h ? {formatCurrency(line.hourly_rate, line.currency)} = {formatCurrency(line.estimated_amount, line.currency)} estimated; {formatCurrency(line.payable_amount, line.currency)} payable ({line.status}).
                    </Typography>
                  ))}</details>}
                </TableCell>
              </TableRow>;
            })}</TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
