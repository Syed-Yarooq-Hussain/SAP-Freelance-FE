"use client";

import MonthlyCalendar, { type CalendarEvent } from "@/components/MonthlyCalendar";
import { consultantLabel } from "@/utils/consultantIdentity";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useMemo, useState } from "react";

type Slot = { start?: string; end?: string; start_time?: string; end_time?: string };
type Day = { day?: string; date?: string; active?: boolean; start?: string; end?: string; slot?: Slot[]; slots?: Slot[] };
type Schedule = { weekly?: Day[]; weekdays?: Day[]; custom?: Day[]; effective_from?: string; effective_to?: string; timezone?: string };

export default function ConsultantAvailabilityDialog({ open, onClose, consultantId, schedule }: {
  open: boolean;
  onClose: () => void;
  consultantId: string | number;
  schedule: Schedule | Day[] | null | undefined;
}) {
  const [visible, setVisible] = useState(() => ({ year: new Date().getFullYear(), month: new Date().getMonth() }));
  const config: Schedule = Array.isArray(schedule) ? { weekly: schedule } : schedule ?? {};
  const events = useMemo<CalendarEvent[]>(() => {
    const weekly = config.weekly ?? config.weekdays ?? [];
    const custom = config.custom ?? [];
    const days = new Date(visible.year, visible.month + 1, 0).getDate();
    const result: CalendarEvent[] = [];
    for (let day = 1; day <= days; day++) {
      // Local date construction avoids moving a calendar day across UTC boundaries.
      const date = `${visible.year}-${String(visible.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const override = custom.find(item => item.date === date);
      const insideWindow = (!config.effective_from || date >= config.effective_from) && (!config.effective_to || date <= config.effective_to);
      const weekday = new Date(visible.year, visible.month, day).toLocaleDateString("en-US", { weekday: "long" });
      const entry = override ?? (insideWindow ? weekly.find(item => item.day?.toLowerCase() === weekday.toLowerCase()) : undefined);
      if (!entry?.active) continue;
      const slots = entry.slot ?? entry.slots ?? [{ start: entry.start, end: entry.end }];
      const times = slots.map(slot => {
        const start = slot.start ?? slot.start_time;
        const end = slot.end ?? slot.end_time;
        return start && end ? `${start} - ${end}` : null;
      }).filter(Boolean);
      if (times.length) result.push({ date, type: "project", title: "Available", time: times.join(" · ") });
    }
    return result;
  }, [schedule, visible.year, visible.month]);
  const hasSchedule = Boolean(config.weekly?.length || config.weekdays?.length || config.custom?.length);

  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
    <DialogTitle>{consultantLabel(consultantId)} — Availability</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Green dates show saved availability. Unmarked dates have no saved available slots.
        {config.timezone ? ` Times are in ${config.timezone}.` : " Times are shown as saved; the schedule does not specify a timezone."}
        {" This view does not confirm booking availability."}
      </Typography>
      {!hasSchedule && <Alert severity="info" sx={{ mb: 2 }}>No working schedule has been provided.</Alert>}
      {hasSchedule && !events.length && <Alert severity="info" sx={{ mb: 2 }}>No saved available slots for this month. You can browse other months.</Alert>}
      <Box sx={{ overflowX: "auto" }}><Box sx={{ minWidth: 700 }}>
        <MonthlyCalendar month={visible.month} year={visible.year} events={events}
          onMonthChange={(year, month) => setVisible({ year, month })} mode="full" showLegend={false} title="Availability" />
      </Box></Box>
    </DialogContent>
    <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
  </Dialog>;
}
