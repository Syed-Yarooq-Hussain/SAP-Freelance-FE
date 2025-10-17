"use client";

import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import { Box } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

interface InterviewProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  stats: StatCardProps[];
  rows: T[];
  columns?: GridColDef<T>[];
  getColumns?: (onRescheduleClick: () => void) => GridColDef<T>[];
  rescheduleEnabled?: boolean;
}

export default function Interview<
  T extends GridValidRowModel = GridValidRowModel
>({
  title,
  stats,
  rows,
  columns,
  getColumns,
  rescheduleEnabled = false,
}: InterviewProps<T>) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const resolvedColumns = useMemo(() => {
    if (getColumns) return getColumns(() => setRescheduleOpen(true));
    return columns || [];
  }, [getColumns, columns]);

  return (
    <Box>
      <DashboardStats stats={stats} containerProps={{ marginBottom: "30px" }} />

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <DataTable
          title={title}
          columns={resolvedColumns}
          rows={rows}
          pageSize={10}
        />
      </Box>

      {rescheduleEnabled && (
        <DynamicPopup
          open={rescheduleOpen}
          onClose={() => setRescheduleOpen(false)}
          title="Reschedule"
          description="Suggest a date and time for interview."
          fields={[
            {
              id: "date",
              label: "Date",
              type: "date",
              value: date,
              onChange: (val: string | File) => {
                if (typeof val === "string") setDate(val);
              },
            },
            {
              id: "time",
              label: "Time",
              type: "time",
              value: time,
              onChange: (val: string | File) => {
                if (typeof val === "string") setTime(val);
              },
            },
          ]}
          buttonText="Request"
          buttonColor="BLUE"
          onSubmit={() => setRescheduleOpen(false)}
        />
      )}
    </Box>
  );
}
