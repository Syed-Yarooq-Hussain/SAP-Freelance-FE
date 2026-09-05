"use client";

import { Box } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

interface WorkingDay {
  day: string;
  start?: string;
  end?: string;
  active: boolean;
}

interface Props {
  value: {
    date: string;
    time: string;
  };
  onChange: (data: { date: string; time: string }) => void;
  workingSchedule: WorkingDay[];
}

export default function InterviewDateTimePicker({
  value,
  onChange,
  workingSchedule,
}: Props) {
  const activeDays =
    workingSchedule && workingSchedule.length > 0
      ? workingSchedule.filter((d) => d.active).map((d) => d.day.toLowerCase())
      : null;

  const getScheduleForDate = (date: Dayjs) =>
    workingSchedule.find(
      (d) => d.day.toLowerCase() === date.format("dddd").toLowerCase()
    );

  const selectedDate = value.date ? dayjs(value.date) : null;
  const schedule =
    activeDays && selectedDate ? getScheduleForDate(selectedDate) : null;
  const safeSchedule =
    schedule && schedule.active && schedule.start && schedule.end
      ? schedule
      : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={2}>
      <DatePicker
        label="Date"
        value={selectedDate}
        shouldDisableDate={(date) => {
          if (date.isBefore(dayjs(), "day")) return true;

          if (!activeDays || activeDays.length === 0) return true;

          return !activeDays.includes(date.format("dddd").toLowerCase());
        }}
        onChange={(val) =>
          onChange({
            ...value,
            date: val ? val.format("YYYY-MM-DD") : "",
            time: "",
          })
        }
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            InputLabelProps: {
              shrink: true,
            },
          },
        }}
      />

      <TimePicker
        label="Time"
        ampm={false}
        format="HH:mm"
        value={value.time ? dayjs(value.time, "HH:mm") : null}
        disabled={!safeSchedule}
        minutesStep={5}
        minTime={safeSchedule ? dayjs(safeSchedule.start!, "HH:mm") : undefined}
        maxTime={safeSchedule ? dayjs(safeSchedule.end!, "HH:mm") : undefined}
        shouldDisableTime={(time, view) => {
          if (!safeSchedule) return true;

          const start = dayjs(safeSchedule.start!, "HH:mm");
          const end = dayjs(safeSchedule.end!, "HH:mm");

          if (view === "hours") {
            const hour = time.hour();
            return hour < start.hour() || hour > end.hour();
          }

          if (view === "minutes") {
            const current = dayjs().hour(time.hour()).minute(time.minute());

            return current.isBefore(start) || current.isAfter(end);
          }

          return false;
        }}
        onChange={(val) =>
          onChange({
            ...value,
            time: val ? val.format("HH:mm") : "",
          })
        }
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            InputLabelProps: {
              shrink: true,
            },
            helperText: safeSchedule
              ? `Available: ${safeSchedule.start} – ${safeSchedule.end}`
              : "Select a date first",
          },
        }}
      />
      </Box>
    </LocalizationProvider>
  );
}
