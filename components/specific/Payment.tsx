import { Box, Divider } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import AppButton from "../Button";
import DataTable from "../DataTable";
import { MonetizationOn, MoneyOff } from "@mui/icons-material";
import { CreditCard } from "lucide-react";

type TabKey = "upcoming" | "made" | "outstanding";

interface PaymentProps<
  T extends GridValidRowModel & { status?: string } = GridValidRowModel & {
    status?: string;
  }
> {
  title: string;
  columns: GridColDef<T>[];
  rows: T[];
  showTabs?: boolean;
}

const norm = (v: unknown) => String(v ?? "").toLowerCase();

export default function Payment<
  T extends GridValidRowModel & { status?: string } = GridValidRowModel & {
    status?: string;
  }
>({ title, columns, rows, showTabs = false }: PaymentProps<T>) {
  const [active, setActive] = useState<TabKey>("upcoming");

  const filteredRows = useMemo<T[]>(() => {
    if (!showTabs) return rows;

    const upcoming = ["pending", "scheduled", "upcoming", "due"];
    const made = ["paid", "completed", "settled"];
    const outstanding = ["overdue", "outstanding", "failed", "past due"];

    return rows.filter((r) => {
      const s = norm(r.status);
      if (active === "upcoming") return upcoming.includes(s) || s === "";
      if (active === "made") return made.includes(s);
      return outstanding.includes(s);
    });
  }, [rows, showTabs, active]);

  return (
    <Box
      sx={{ p: 2, boxShadow: 2, bgcolor: "background.paper" }}
    >
      {showTabs && (
        <>
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
            <AppButton
              label="Upcoming payments"
              colorKey="BLUE"
              variant={active === "upcoming" ? "contained" : "outlined"}
              onClick={() => setActive("upcoming")}
              width={200}
            />
            <AppButton
              label="Made payment"
              colorKey="BLUE"
              variant={active === "made" ? "contained" : "outlined"}
              onClick={() => setActive("made")}
              width={200}
            />
            <AppButton
              label="Outstanding"
              colorKey="BLUE"
              variant={active === "outstanding" ? "contained" : "outlined"}
              onClick={() => setActive("outstanding")}
              width={200}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />
        </>
      )}

      <DataTable
        title={title}
        columns={columns}
        rows={filteredRows}
        pageSize={10}
        noResultText={<div className="flex flex-col justify-center items-center gap-2">
          <CreditCard className="h-10 w-10 text-slate-700" />
          <p className="text-xs max-w-1/2 text-slate-700 text-center">You don&apos;t have any payments yet. Your payment history, upcoming payments, and transaction records will appear here once payments are processed.</p>
        </div>}
      />
    </Box>
  );
}
