"use client";

import { useUpdateProject } from "@/actions/projects/useaddProjectDetails";
import { useUploadDocument } from "@/actions/documents/useUploadDocument";
import { useUpdatePaymentStatus } from "@/actions/payments/useUpdatePaymentStatus";
import AppButton from "@/components/Button";
import MilestoneBillingOverview from "./MilestoneBillingOverview";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import {
  createTeamBuilderPaymentMilestoneColumns,
  createTeamBuilderPaymentCustomRangeColumns,
} from "@/data/teamBuilder";
import type { PaymentTableRow, IProjectPaymentDTO } from "@/types/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import { APP_ROUTES } from "@/utils/app_routes";
import { formatCurrency } from "@/utils/payments";
import {
  milestoneIdForPayment,
  paymentAmount,
  paymentCurrency,
  summarizeBilling,
  type BillingMilestone,
} from "@/utils/teamBuilderBilling";
import { getProjectPaymentService } from "@/services/getProjectPayment";
import { getProjectMilestonesService } from "@/services/getProjectMilestones";
import { getMilestoneTeam } from "@/services/milestoneTeam";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function TeamPayments({
  projectId,
  onDiscard,
  completionRoute = APP_ROUTES.CLIENT.DASHBOARD,
}: {
  projectId: string;
  onDiscard: () => void;
  completionRoute?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<{
    projectId: string;
    milestones: BillingMilestone[];
    payments: IProjectPaymentDTO[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [selectedPayments, setSelectedPayments] = useState<Set<string>>(
    new Set(),
  );
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"milestone" | "custom">("milestone");
  const busy = useRef(false);
  const requestId = useRef(0);
  const updateProject = useUpdateProject();
  const { mutateAsync: uploadDocument } = useUploadDocument();
  const { mutateAsync: updatePaymentStatus } = useUpdatePaymentStatus();
  const milestones = data?.projectId === projectId ? data.milestones : [];
  const payments = data?.projectId === projectId ? data.payments : [];

  const refresh = useCallback(async () => {
    const sequence = ++requestId.current;
    setLoading(true);
    setLoadError("");
    try {
      const [paymentResponse, milestoneResponse] = await Promise.all([
        getProjectPaymentService(projectId),
        getProjectMilestonesService(projectId),
      ]);
      const allMilestones = await Promise.all(
        (milestoneResponse.data ?? []).map(
          async (milestone): Promise<BillingMilestone> => {
            const item = milestone as BillingMilestone;
            try {
              const team =
                item.team ??
                (await getMilestoneTeam(projectId, Number(item.id)));
              const estimated = Number(team.estimated_amount),
                payable = Number(team.payable_amount);
              if (
                team.estimated_amount == null ||
                team.payable_amount == null ||
                !Number.isFinite(estimated) ||
                !Number.isFinite(payable) ||
                estimated < 0 ||
                payable < 0 ||
                !/^[A-Z]{3}$/.test(team.currency)
              )
                throw new Error("Invalid milestone billing snapshot");
              return {
                ...item,
                team: {
                  ...team,
                  estimated_amount: estimated,
                  payable_amount: payable,
                },
              };
            } catch (error) {
              return {
                ...item,
                team: undefined,
                teamError:
                  error instanceof Error
                    ? error.message
                    : "Snapshot unavailable",
              };
            }
          },
        ),
      );
      const records = [
        ...new Map(
          (paymentResponse.data ?? [])
            .filter((payment) => !payment.deleted_at)
            .map((payment) => [String(payment.id), payment]),
        ).values(),
      ].map((payment) => ({
        ...payment,
        id: String(payment.id),
        amount: paymentAmount(payment),
        currency: paymentCurrency(payment, allMilestones),
      }));
      if (sequence !== requestId.current) return;
      setData({ projectId, milestones: allMilestones, payments: records });
      setSelectedPayments(
        (previous) =>
          new Set(
            [...previous].filter((id) =>
              records.some((record) => record.id === id),
            ),
          ),
      );
    } catch (error) {
      if (sequence === requestId.current)
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load project billing",
        );
    } finally {
      if (sequence === requestId.current) setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    setData(null);
    setSelectedPayments(new Set());
    setPaymentId(null);
    setActionError("");
    void refresh();
    return () => {
      requestId.current += 1;
    };
  }, [refresh]);

  const onSelect = useCallback(
    (id: string, checked: boolean) =>
      setSelectedPayments(checked ? new Set([id]) : new Set()),
    [],
  );
  const onPaid = useCallback((id: string) => {
    if (busy.current) return;
    setSelectedPayments(new Set([id]));
    setPaymentId(id);
    setSelectedFile(null);
    setActionError("");
  }, []);
  const milestoneColumns = useMemo(
    () => createTeamBuilderPaymentMilestoneColumns(onSelect, onPaid),
    [onSelect, onPaid],
  );
  const customColumns = useMemo(
    () => createTeamBuilderPaymentCustomRangeColumns(onSelect, onPaid),
    [onSelect, onPaid],
  );
  const displayRows: PaymentTableRow[] = payments.map((payment) => ({
    ...payment,
    selected: selectedPayments.has(String(payment.id)),
    showUpload: false,
    // Compatibility fields for existing payment actions; no synthetic charges.
    baseAmount: payment.amount,
    totalAmount: payment.amount,
    vat: 0,
    serviceCharge: 0,
  }));
  const milestonePayments = displayRows.filter((payment) =>
    Boolean(milestoneIdForPayment(payment)),
  );
  const customPayments = displayRows.filter(
    (payment) => !milestoneIdForPayment(payment),
  );
  const totals = summarizeBilling(milestones, payments);
  const hasPaidPayment = payments.some(
    (payment) => payment.is_paid === true && paymentAmount(payment) > 0,
  );
  const canStart =
    hasPaidPayment &&
    !loading &&
    !loadError &&
    !submitting &&
    !updateProject.isPending;

  const submitPayment = async () => {
    if (busy.current || loading || loadError) return;
    const payment = payments.find((record) => String(record.id) === paymentId);
    if (!payment || payment.is_paid || paymentAmount(payment) <= 0) return;
    busy.current = true;
    setSubmitting(true);
    setActionError("");
    try {
      let docId: number | null = null;
      if (selectedFile) {
        const response = await uploadDocument({
          file: selectedFile,
          type: "client_payment",
        });
        docId = Number(response.data?.id ?? response.data?.doc_id);
        if (!Number.isInteger(docId) || docId <= 0)
          throw new Error("The upload did not return a valid document ID.");
      }
      await updatePaymentStatus({
        paymentId: payment.id,
        payload: {
          is_paid: true,
          doc_id: docId,
          payment_module: payment.payment_module,
        },
      });
      setPaymentId(null);
      setSelectedFile(null);
      toast("Payment marked as paid", "success");
      await refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update payment";
      setActionError(message);
      toast(message, "error");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  };
  const startProject = () => {
    if (!canStart || busy.current) return;
    busy.current = true;
    setActionError("");
    updateProject.mutate(
      { projectId, body: { status: "in_progress" } },
      {
        onSuccess: () => {
          toast("Project started!", "success");
          router.push(completionRoute);
        },
        onError: (error) => {
          setActionError(error.message);
          toast(error.message, "error");
        },
        onSettled: () => {
          busy.current = false;
        },
      },
    );
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mt: 3, bgcolor: "#F8FAFC", borderRadius: 3, border: "1px solid #E2E8F0" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#0F172A" }}>Payments & launch</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "#64748B" }}>Review your milestones and record a payment to get started.</Typography>
        </Box>
        <Button size="small" sx={{ textTransform: "none", color: "#64748B", flexShrink: 0 }} disabled={loading || submitting} onClick={() => void refresh()}>
          Refresh
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ mb: 2 }}>
          <CircularProgress size={22} />
          <Typography variant="body2">Refreshing payment records…</Typography>
        </Box>
      ) : null}
      {loadError ? (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={<Button onClick={() => void refresh()}>Retry</Button>}
        >
          {loadError}
        </Alert>
      ) : null}
      {actionError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      ) : null}
      {data?.projectId === projectId ? (
        <>
          {milestones.some((m) => !m.team) ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Some milestone snapshots are unavailable. Their payment records
              remain visible; their estimates cannot be shown. Refresh billing
              to retry.
            </Alert>
          ) : null}
          {totals.map((total) => (
            <Box key={total.currency} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {total.currency}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  gap: 2,
                }}
              >
                {[
                  ["Total payable", total.payable],
                  ["Already paid", total.paid],
                  ["Remaining payable", total.remaining],
                ].map(([label, amount]) => (
                  <Paper
                    key={label}
                    variant="outlined"
                    sx={{ p: 2.5, borderRadius: 2.5, borderColor: label === "Remaining payable" ? "#C8DCEB" : "#E2E8F0", bgcolor: label === "Remaining payable" ? "#EDF5FA" : "#fff" }}
                  >
                    <Typography sx={{ fontSize: 12, color: "#64748B", mb: 1 }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 700, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", color: label === "Already paid" ? "#047857" : "#0F172A" }}>
                      {formatCurrency(Number(amount), total.currency)}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          ))}
          {totals.some(
            (total) =>
              Math.abs(total.payable - total.paid - total.remaining) > 0.01,
          ) ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Milestone totals and issued payments currently differ.
              The remaining balance includes issued unpaid payments only.
            </Alert>
          ) : null}
          <MilestoneBillingOverview
            milestones={milestones}
            payments={payments}
          />
          <Box
            component="fieldset"
            disabled={
              submitting ||
              loading ||
              Boolean(loadError) ||
              updateProject.isPending
            }
            sx={{ border: "1px solid #E2E8F0", borderRadius: 3, bgcolor: "#fff", m: 0, p: 0, minWidth: 0, overflow: "hidden" }}
          >
            <Box sx={{ px: 2.5, pt: 2.5 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Payment records</Typography>
              <Typography sx={{ fontSize: 12, color: "#64748B", mt: 0.5 }}>Record payments and attach receipts here.</Typography>
              <Tabs value={paymentTab} onChange={(_, value) => setPaymentTab(value)} aria-label="Payment type" sx={{ mt: 1, "& .MuiTab-root": { textTransform: "none", fontSize: 12, minHeight: 44 } }}>
                <Tab value="milestone" label={`Milestones (${milestonePayments.length})`} />
                <Tab value="custom" label={`Custom payments (${customPayments.length})`} />
              </Tabs>
            </Box>
            <Box sx={{ p: { xs: 1, sm: 2 }, borderTop: "1px solid #E2E8F0" }}>
              <DataTable
                key={paymentTab}
                title=""
                isTransparent
                rowClickable={false}
                noResultText={paymentTab === "milestone" ? "No milestone payments issued yet." : "No custom payments yet."}
                columns={paymentTab === "milestone" ? milestoneColumns : customColumns}
                rows={paymentTab === "milestone" ? milestonePayments : customPayments}
                scrollHeight={Math.min(10, Math.max(1, paymentTab === "milestone" ? milestonePayments.length : customPayments.length)) * 52 + 116}
                pageSize={10}
              />
            </Box>
          </Box>
        </>
      ) : null}
      <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #E2E8F0", display: "flex", alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
      <Typography sx={{ fontSize: 12, color: hasPaidPayment ? "#047857" : "#64748B", maxWidth: 360 }}>
        {hasPaidPayment
          ? "Payment received. Your project is ready to start."
          : "Complete at least one payment to start your project."}
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-end"
        flexWrap="wrap"
        gap={2}
      >
        <Button
          variant="outlined"
          sx={{ textTransform: "none", borderColor: "#CBD5E1", color: "#475569", px: 3, borderRadius: 2 }}
          onClick={onDiscard}
          disabled={submitting || updateProject.isPending}
        >Back</Button>
        <AppButton
          label="Start the Project"
          colorKey="BLUE"
          width={180}
          onClick={startProject}
          disabled={!canStart}
        />
      </Box>
      </Box>
      <DynamicPopup
        open={Boolean(paymentId)}
        onClose={() => {
          if (!submitting) setPaymentId(null);
        }}
        title="Upload Receipt"
        description={
          actionError ||
          "Upload a receipt if available, or mark this payment paid without a slip."
        }
        fileUpload
        onFileChange={setSelectedFile}
        fileValue={selectedFile}
        buttonText={
          submitting
            ? "Saving payment…"
            : selectedFile
              ? "Upload & Mark Paid"
              : "Mark Paid Without Slip"
        }
        onSubmit={submitPayment}
        disableSubmit={submitting || loading || Boolean(loadError)}
      />
    </Paper>
  );
}
