"use client";

import { useConsultantCalendar } from "@/actions/consultants/useConsultantCalendar";
import { useConsultantMe } from "@/actions/consultants/useConsultantProfile";
import { useSaveConsultantSchedule } from "@/actions/consultants/useSaveConsultantSchedule";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import DynamicPopup from "@/components/Popup";
import SchedulerLauncher from "@/components/SchedulerPopup";
import Sidebar from "@/components/Sidebar";
import SkeletonCalendar from "@/components/SkeletonCalendar";
import { mapApiDaysToCalendarEvents } from "@/utils/mapConsultantCalendar";
import { Box, Divider, TextField, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";

export default function CalendarScreen() {
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());
  const [availOpen, setAvailOpen] = React.useState(false);
  const [availStart, setAvailStart] = React.useState<string>("");
  const [availEnd, setAvailEnd] = React.useState<string>("");
  const [availDate, setAvailDate] = React.useState<string | null>(null);
  const { data: meData } = useConsultantMe();
  const weeklyFromMe = meData?.data?.working_schedule?.weekly ?? [];

  const { mutateAsync: saveSchedule, isPending } = useSaveConsultantSchedule();

  const queryClient = useQueryClient();

  const handleOpenAvail = React.useCallback(
    (date: string, start: string, end: string) => {
      setAvailDate(date);
      setAvailStart(start);
      setAvailEnd(end);
      setAvailOpen(true);
    },
    []
  );

  const handleAvailSubmit = async () => {
    if (!availDate || !availStart || !availEnd) return;

    const payload: any = {
      custom: [
        {
          date: availDate,
          active: true,
          slot: [{ start: availStart, end: availEnd }],
        },
      ],
    };

    if (weeklyFromMe?.length) {
      payload.weekly = weeklyFromMe;
    }

    try {
      await saveSchedule(payload);

      await queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "consultant-calendar",
      });

      setAvailOpen(false);
      setAvailDate(null);
      setAvailStart("");
      setAvailEnd("");
    } catch (e) {
      console.error("Failed to update availability", e);
    }
  };

  const { data, isLoading } = useConsultantCalendar(month, year);

  const events = React.useMemo(() => {
    if (!data?.days) return [];
    return mapApiDaysToCalendarEvents(data.days, handleOpenAvail);
  }, [data, handleOpenAvail]);

  return (
    <Sidebar>
      <Box>
        {isLoading ? (
          <SkeletonCalendar />
        ) : (
          <MonthlyCalendar
            year={year}
            month={month}
            mode="full"
            showLegend
            events={events}
            onMonthChange={(y, m) => {
              setYear(y);
              setMonth(m);
            }}
            actionNode={<SchedulerLauncher />}
          />
        )}

        <DynamicPopup
          open={availOpen}
          onClose={() => setAvailOpen(false)}
          title="Change availability"
          buttonText="Set"
          buttonColor="BLUE"
          onSubmit={handleAvailSubmit}
          disableSubmit={!availStart || !availEnd || isPending}
        >
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
                Start time
              </Typography>
              <TextField
                type="time"
                size="small"
                fullWidth
                value={availStart}
                onChange={(e) => setAvailStart(e.target.value)}
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
                value={availEnd}
                onChange={(e) => setAvailEnd(e.target.value)}
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
        </DynamicPopup>
      </Box>
    </Sidebar>
  );
}
