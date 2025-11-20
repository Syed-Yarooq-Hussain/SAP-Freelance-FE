"use client";

import MonthlyCalendar from "@/components/MonthlyCalendar";
import DynamicPopup from "@/components/Popup";
import SchedulerLauncher from "@/components/SchedulerPopup";
import Sidebar from "@/components/Sidebar";
import { buildSeedEvents } from "@/data/calendar";
import { Box, Divider, TextField, Typography } from "@mui/material";
import * as React from "react";

export default function CalendarScreen() {
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());
  const [availOpen, setAvailOpen] = React.useState(false);
  const [availStart, setAvailStart] = React.useState<string>("");
  const [availEnd, setAvailEnd] = React.useState<string>("");

  const handleOpenAvail = React.useCallback(() => setAvailOpen(true), []);
  const handleAvailSubmit = () => {
    setAvailOpen(false);
    setAvailStart("");
    setAvailEnd("");
  };

  const events = React.useMemo(
    () => buildSeedEvents(handleOpenAvail),
    [handleOpenAvail]
  );

  return (
    <Sidebar>
      <Box>
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

        <DynamicPopup
          open={availOpen}
          onClose={() => setAvailOpen(false)}
          title="Change availability"
          buttonText="Set"
          buttonColor="BLUE"
          onSubmit={handleAvailSubmit}
          disableSubmit={!availStart || !availEnd}
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
