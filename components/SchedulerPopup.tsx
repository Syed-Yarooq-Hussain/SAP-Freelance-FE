"use client";

import { useConsultantMe } from "@/actions/consultants/useConsultantProfile";
import { useSaveConsultantSchedule } from "@/actions/consultants/useSaveConsultantSchedule";
import AppButton from "@/components/Button";
import {
  DAY_MAP,
  WEEKDAYS_MINI,
  WEEKDAY_TITLES,
  WEEKLY_ROWS_INIT,
} from "@/constants/calendar";
import {
  buildMonthMatrix,
  clampToMonthStart,
  dayAfter,
  inRange,
  isWeekendDate,
  sameDay,
  toISO,
} from "@/utils/dateTime";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import DynamicPopup from "./Popup";

type TabKey = "default" | "customDate" | "weekly";
type DayPreset = "All Day" | "Weekends" | "Weekday";

interface RangeCalendarProps {
  view: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  start: Date | null;
  end: Date | null;
  onPick: (day: Date) => void;
}

function RangeCalendar({
  view,
  onPrevMonth,
  onNextMonth,
  start,
  end,
  onPick,
}: RangeCalendarProps) {
  const matrix = React.useMemo(() => buildMonthMatrix(view), [view]);
  const month = view.getMonth();

  return (
    <Box
      sx={{
        border: "1px solid #e5e7eb",
        p: 2,
        mb: 2,
        bgcolor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {view.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </Typography>
        <Box>
          <IconButton size="small" onClick={onPrevMonth}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onNextMonth}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          mb: 0.5,
          px: 0.5,
        }}
      >
        {WEEKDAYS_MINI.map((label, i) => (
          <Typography
            key={`wd-${i}`}
            variant="caption"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontWeight: 700,
            }}
            title={WEEKDAY_TITLES[i]}
          >
            {label}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
        }}
      >
        {matrix.flat().map((day, idx) => {
          const isThisMonth = day.getMonth() === month;
          const isStart = start && sameDay(day, start);
          const isEnd = end && sameDay(day, end);
          const isInside = inRange(day, start, end);
          const bg =
            isStart || isEnd
              ? "#6E9EFF"
              : isInside
              ? "rgba(110,158,255,0.25)"
              : "transparent";
          const color =
            isStart || isEnd ? "#fff" : isThisMonth ? "#111827" : "#9ca3af";
          const border =
            isStart || isEnd
              ? "1px solid #6E9EFF"
              : isInside
              ? "1px solid rgba(110,158,255,0.35)"
              : "1px solid #e5e7eb";

          return (
            <Box
              key={idx}
              onClick={() => onPick(day)}
              sx={{
                userSelect: "none",
                cursor: "pointer",
                height: 34,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: bg,
                color,
                border,
                transition: "background-color 120ms, border-color 120ms",
                "&:hover": { borderColor: "#6E9EFF" },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {day.getDate()}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

interface WeeklyRow {
  dow: number;
  label: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export default function SchedulerLauncher() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<TabKey>("default");
  const [dayPreset, setDayPreset] = React.useState<DayPreset>("All Day");
  const [startTime, setStartTime] = React.useState<string>("");
  const [endTime, setEndTime] = React.useState<string>("");
  const [viewMonth, setViewMonth] = React.useState<Date>(new Date());
  const [rangeStart, setRangeStart] = React.useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = React.useState<Date | null>(null);
  const { mutateAsync, isPending } = useSaveConsultantSchedule();
  const { data: meData } = useConsultantMe();
  const [customDayPreset, setCustomDayPreset] =
    React.useState<DayPreset>("All Day");
  const [weeklyRows, setWeeklyRows] =
    React.useState<WeeklyRow[]>(WEEKLY_ROWS_INIT);

  const nextMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const prevMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const handlePickDay = (day: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(new Date(day));
      setRangeEnd(null);
      return;
    }
    if (rangeStart && !rangeEnd) {
      const s = new Date(rangeStart);
      const e = new Date(day);
      if (e < s) {
        setRangeStart(e);
        setRangeEnd(s);
      } else {
        setRangeEnd(e);
      }
    }
  };

  const customDates: string[] = React.useMemo(() => {
    if (!rangeStart || !rangeEnd) return [];
    const list: string[] = [];
    let c = new Date(rangeStart);
    const end = new Date(rangeEnd);
    while (c <= end) {
      list.push(toISO(c));
      c = dayAfter(c);
    }
    return list;
  }, [rangeStart, rangeEnd]);

  const weeklyValid = React.useMemo(
    () =>
      weeklyRows.some(
        (r) => r.enabled && r.startTime.trim() && r.endTime.trim()
      ),
    [weeklyRows]
  );

  const disableSubmit =
    active === "weekly"
      ? !weeklyValid
      : !startTime ||
        !endTime ||
        (active === "customDate" && customDates.length === 0);

  const resetForm = () => {
    setActive("default");
    setDayPreset("All Day");
    setStartTime("");
    setEndTime("");
    setViewMonth(new Date());
    setRangeStart(null);
    setRangeEnd(null);
    setWeeklyRows(WEEKLY_ROWS_INIT);
  };

  React.useEffect(() => {
    if (active === "weekly" && meData?.data?.working_schedule?.weekly) {
      setWeeklyRows(mapWeeklyFromMe(meData.data.working_schedule.weekly));
    }
  }, [active, meData]);

  const existingWeekly = React.useMemo(() => {
    return meData?.data?.working_schedule?.weekly ?? [];
  }, [meData]);

  function mapWeeklyFromMe(meWeekly: any[]): WeeklyRow[] {
    return meWeekly.map((d) => ({
      dow: DAY_MAP.indexOf(d.day),
      label: d.day.slice(0, 3).toUpperCase(),
      enabled: d.active,
      startTime: d.slot?.[0]?.start ?? "",
      endTime: d.slot?.[0]?.end ?? "",
    }));
  }

  function buildWeeklyPayloadFromExisting(weeklyRows: WeeklyRow[]) {
    return {
      weekly: weeklyRows.map((row) => ({
        day: DAY_MAP[row.dow],
        active: row.enabled,
        slot: row.enabled ? [{ start: row.startTime, end: row.endTime }] : [], // 🔥 IMPORTANT: clear slot when inactive
      })),
    };
  }

  function buildWeeklyFromPreset(
    preset: DayPreset,
    startTime: string,
    endTime: string
  ) {
    return DAY_MAP.map((day) => {
      const isWeekend = day === "Saturday" || day === "Sunday";

      let active = false;

      switch (preset) {
        case "All Day":
          active = true;
          break;
        case "Weekday":
          active = !isWeekend;
          break;
        case "Weekends":
          active = isWeekend;
          break;
      }

      return {
        day,
        active,
        ...(active && {
          slot: [{ start: startTime, end: endTime }],
        }),
      };
    });
  }

  function buildDefaultPayload(
    dayPreset: DayPreset,
    startTime: string,
    endTime: string
  ) {
    return {
      weekly: buildWeeklyFromPreset(dayPreset, startTime, endTime),
    };
  }

  function buildCustomPayload(
    dates: string[],
    preset: DayPreset,
    startTime: string,
    endTime: string,
    existingWeekly: any[]
  ) {
    return {
      custom: dates.map((date) => {
        const weekend = isWeekendDate(date);

        let active = false;

        switch (preset) {
          case "All Day":
            active = true;
            break;
          case "Weekday":
            active = !weekend;
            break;
          case "Weekends":
            active = weekend;
            break;
        }

        return {
          date,
          active,
          ...(active && {
            slot: [{ start: startTime, end: endTime }],
          }),
        };
      }),

      weekly: existingWeekly,
    };
  }

  const handleSubmit = async () => {
    let payload: any = {};

    if (active === "default") {
      payload = buildDefaultPayload(dayPreset, startTime, endTime);
    }

    if (active === "customDate") {
      payload = buildCustomPayload(
        customDates,
        customDayPreset,
        startTime,
        endTime,
        existingWeekly
      );
    }

    if (active === "weekly") {
      payload = buildWeeklyPayloadFromExisting(weeklyRows);
    }

    try {
      await mutateAsync(payload);
      setOpen(false);
      resetForm();
    } catch (e) {
      console.error("Failed to save schedule", e);
    }
  };

  React.useEffect(() => {
    if (active === "customDate") {
      setViewMonth(
        rangeStart
          ? clampToMonthStart(rangeStart)
          : clampToMonthStart(new Date())
      );
    }
  }, [active, rangeStart]);

  const updateWeeklyRow = (idx: number, patch: Partial<WeeklyRow>) => {
    setWeeklyRows((rows) => {
      const copy = rows.slice();
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  };

  return (
    <>
      <AppButton
        label="Scheduler"
        colorKey="BLUE"
        onClick={() => setOpen(true)}
        width={180}
      />

      <DynamicPopup
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        title="Scheduler"
        noteText="The changes will be set for 3 months"
        buttonText="Set"
        buttonColor="BLUE"
        onSubmit={handleSubmit}
        disableSubmit={disableSubmit || isPending}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 1.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <AppButton
            label="Default"
            colorKey="BLUE"
            variant={active === "default" ? "contained" : "outlined"}
            onClick={() => setActive("default")}
            sx={{ flex: 1, minWidth: 0 }}
          />
          <AppButton
            label="Custom Date"
            colorKey="BLUE"
            variant={active === "customDate" ? "contained" : "outlined"}
            onClick={() => setActive("customDate")}
            sx={{ flex: 1, minWidth: 0 }}
          />
          <AppButton
            label="Weekly"
            colorKey="BLUE"
            variant={active === "weekly" ? "contained" : "outlined"}
            onClick={() => setActive("weekly")}
            sx={{ flex: 1, minWidth: 0 }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {active === "customDate" && (
          <RangeCalendar
            view={viewMonth}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            start={rangeStart}
            end={rangeEnd}
            onPick={handlePickDay}
          />
        )}

        {active === "weekly" ? (
          <Box sx={{ borderRadius: 1.5, p: 1.25, mb: 1 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr",
                gap: 1.5,
                alignItems: "center",
                px: 0.5,
                mb: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Days
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Start time
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                End time
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {weeklyRows.map((row, i) => (
                <Box
                  key={row.label}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.3fr 1.3fr",
                    gap: 1.5,
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Checkbox
                      checked={row.enabled}
                      onChange={(e) =>
                        updateWeeklyRow(i, { enabled: e.target.checked })
                      }
                      size="small"
                    />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {row.label}
                    </Typography>
                  </Box>

                  <TextField
                    type="time"
                    size="small"
                    fullWidth
                    disabled={!row.enabled}
                    value={row.startTime}
                    onChange={(e) =>
                      updateWeeklyRow(i, { startTime: e.target.value })
                    }
                    slotProps={{
                      htmlInput: { step: 60 },
                      inputLabel: { shrink: true },
                    }}
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "#f8f9fc",
                        borderRadius: 1,
                      },
                    }}
                  />

                  <TextField
                    type="time"
                    size="small"
                    fullWidth
                    disabled={!row.enabled}
                    value={row.endTime}
                    onChange={(e) =>
                      updateWeeklyRow(i, { endTime: e.target.value })
                    }
                    slotProps={{
                      htmlInput: { step: 60 },
                      inputLabel: { shrink: true },
                    }}
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "#f8f9fc",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1.7fr 1.7fr",
              gap: 1,
              alignItems: "center",
              minWidth: 0,
              borderRadius: 1.5,
              p: 1.25,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
                Select days
              </Typography>
              <TextField
                select
                size="small"
                fullWidth
                value={active === "default" ? dayPreset : customDayPreset}
                onChange={(e) => {
                  const value = e.target.value as DayPreset;
                  if (active === "default") {
                    setDayPreset(value);
                  } else {
                    setCustomDayPreset(value);
                  }
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "#f8f9fc",
                    borderRadius: 1,
                  },
                }}
              >
                <MenuItem value="All Day">All Day</MenuItem>
                <MenuItem value="Weekends">Weekends</MenuItem>
                <MenuItem value="Weekday">Weekday</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
                Start time
              </Typography>
              <TextField
                type="time"
                size="small"
                fullWidth
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                slotProps={{
                  htmlInput: { step: 60 },
                  inputLabel: { shrink: true },
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "#f8f9fc",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
                End time
              </Typography>
              <TextField
                type="time"
                size="small"
                fullWidth
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                slotProps={{
                  htmlInput: { step: 60 },
                  inputLabel: { shrink: true },
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "#f8f9fc",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </DynamicPopup>
    </>
  );
}
