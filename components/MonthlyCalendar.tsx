"use client";

import AppButton from "@/components/Button";
import { MONTH_NAMES, PROJECT_BG, WEEKDAYS } from "@/constants/calendar";
import {
  buildMonthCells,
  formatMonthYear,
  yearsAround,
  ymd,
} from "@/utils/dateTime";
import colors from "@/utils/styles/colors";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";

export type CalendarEventType = "project" | "interview";

export interface CalendarEvent {
  date: string;
  type: CalendarEventType;
  title?: string;
  time?: string;
  label?: string;
  hours?: string;
  meetingUrl?: string;
  changeAvailabilityLabel?: string;
  changeAvailabilityHref?: string;
  onChangeAvailability?: () => void;
}

export interface MonthlyCalendarProps {
  month: number;
  year: number;
  events?: CalendarEvent[];
  onMonthChange?: (nextYear: number, nextMonth: number) => void;
  mode?: "full" | "compact";
  showLegend?: boolean;
  actionNode?: React.ReactNode;
  title?: string;
  framed?: boolean;
  showTitle?: boolean;
  showNav?: boolean;
}

const dotStyle = (bg: string) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: bg,
});
const eventColor = (t: CalendarEventType) =>
  t === "project" ? colors.GREEN : colors.DARK_BLUE;

export default function MonthlyCalendar({
  month,
  year,
  events = [],
  onMonthChange,
  mode = "full",
  showLegend = true,
  actionNode,
  title,
  framed = true,
  showTitle = true,
  showNav = true,
}: MonthlyCalendarProps) {
  const isFull = mode === "full";

  const [pickerAnchor, setPickerAnchor] = React.useState<HTMLElement | null>(
    null
  );
  const pickerOpen = Boolean(pickerAnchor);
  const [tempMonth, setTempMonth] = React.useState(month);
  const [tempYear, setTempYear] = React.useState(year);

  const openPicker = (e: React.MouseEvent<HTMLElement>) => {
    setTempMonth(month);
    setTempYear(year);
    setPickerAnchor(e.currentTarget);
  };
  const closePicker = () => setPickerAnchor(null);
  const applyPicker = () => {
    onMonthChange?.(tempYear, tempMonth);
    closePicker();
  };

  const years = React.useMemo(
    () => yearsAround(new Date().getFullYear(), 10),
    []
  );

  const cells = React.useMemo(
    () => buildMonthCells(year, month),
    [year, month]
  );

  const map = React.useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    events.forEach((e) => {
      const key = e.date.slice(0, 10);
      const arr = m.get(key) || [];
      arr.push(e);
      m.set(key, arr);
    });
    return m;
  }, [events]);

  const headerTitle = title || formatMonthYear(year, month);

  const handlePrev = () => {
    if (!onMonthChange || !showNav) return;
    const nm = month - 1;
    if (nm < 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, nm);
  };
  const handleNext = () => {
    if (!onMonthChange || !showNav) return;
    const nm = month + 1;
    if (nm > 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, nm);
  };

  const buildDotTooltip = (events: CalendarEvent[]) => (
    <Box>
      {events.map((e, idx) => (
        <Box key={idx} sx={{ mb: 0.75 }}>
          <Typography
            sx={{
              fontWeight: 700,
              mb: 0.25,
              color: e.type === "project" ? colors.GREEN : colors.DARK_BLUE,
            }}
          >
            {e.type === "project" ? "Availability" : e.title ?? "Interview"}
          </Typography>

          {e.time && (
            <Typography variant="body2">
              {e.type === "project" ? e.time : `Interview ${e.time}`}
            </Typography>
          )}

          {e.hours && <Typography variant="body2">{e.hours}</Typography>}

          {e.meetingUrl && (
            <Typography
              component="a"
              href={e.meetingUrl}
              target="_blank"
              rel="noreferrer"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Join meeting
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );

  const hasHeader = showTitle || showNav || showLegend || Boolean(actionNode);

  const content = (
    <>
      {hasHeader && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {showNav && (
              <Tooltip title="Previous month">
                <span>
                  <IconButton onClick={handlePrev} size="small">
                    <ChevronLeft />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {showTitle && (
              <>
                <Typography
                  role="button"
                  tabIndex={0}
                  onClick={openPicker}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openPicker(e as unknown as React.MouseEvent<HTMLElement>);
                    }
                  }}
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {headerTitle}
                </Typography>

                <Popover
                  open={pickerOpen}
                  anchorEl={pickerAnchor}
                  onClose={closePicker}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <Box sx={{ p: 2, minWidth: 280 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <FormControl size="small" fullWidth>
                        <InputLabel id="mc-month-label">Month</InputLabel>
                        <Select
                          labelId="mc-month-label"
                          label="Month"
                          value={tempMonth}
                          onChange={(e) => setTempMonth(Number(e.target.value))}
                        >
                          {MONTH_NAMES.map((mName, i) => (
                            <MenuItem key={mName} value={i}>
                              {mName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl size="small" fullWidth>
                        <InputLabel id="mc-year-label">Year</InputLabel>
                        <Select
                          labelId="mc-year-label"
                          label="Year"
                          value={tempYear}
                          onChange={(e) => setTempYear(Number(e.target.value))}
                        >
                          {years.map((y) => (
                            <MenuItem key={y} value={y}>
                              {y}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <AppButton
                        label="Go"
                        colorKey="BLUE"
                        width="auto"
                        onClick={applyPicker}
                      />
                    </Stack>
                  </Box>
                </Popover>
              </>
            )}

            {showNav && (
              <Tooltip title="Next month">
                <span>
                  <IconButton onClick={handleNext} size="small">
                    <ChevronRight />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>

          {showLegend && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={dotStyle(eventColor("project"))} />
                <Typography variant="caption">Availability</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={dotStyle(eventColor("interview"))} />
                <Typography variant="caption">Events</Typography>
              </Box>
            </Box>
          )}

          {actionNode}
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          mb: 1,
        }}
      >
        {WEEKDAYS.map((w) => (
          <Box
            key={w}
            sx={{
              border: "1px solid",
              borderColor: "grey.300",
              bgcolor: "grey.100",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 0.75,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, letterSpacing: 0.2 }}
            >
              {w}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
      >
        {cells.map((d, i) => {
          const iso = ymd(d);
          const isThisMonth =
            d.getMonth() === month && d.getFullYear() === year;
          const dayEvents = map.get(iso) || [];

          const hasProject = dayEvents.some((e) => e.type === "project");
          const hasInterview = dayEvents.some((e) => e.type === "interview");
          const showGreenDot = hasProject || hasInterview;

          return (
            <Box
              key={`${iso}-${i}`}
              sx={{
                minHeight: isFull ? 96 : 56,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: isThisMonth ? "divider" : "grey.200",
                bgcolor: isThisMonth
                  ? isFull && hasProject
                    ? PROJECT_BG
                    : "#fff"
                  : "grey.50",
                p: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: isThisMonth ? "text.primary" : "text.disabled",
                }}
              >
                {d.getDate()}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.75,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {isFull
                  ? showGreenDot && <Box sx={dotStyle(colors.GREEN)} />
                  : (["project", "interview"] as CalendarEventType[]).map(
                      (t) => {
                        const eventsOfType = dayEvents.filter(
                          (e) => e.type === t
                        );
                        if (!eventsOfType.length) return null;

                        return (
                          <Tooltip
                            key={t}
                            title={buildDotTooltip(eventsOfType)}
                            arrow
                            placement="top"
                            slotProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "#fff",
                                  color: "text.primary",
                                  borderRadius: 1.5,
                                  p: 1.25,
                                  boxShadow: 3,
                                  border: "1px solid",
                                  borderColor: "grey.200",
                                  maxWidth: 260,
                                  pointerEvents: "auto",
                                },
                              },
                              arrow: { sx: { color: "#fff" } },
                            }}
                          >
                            <Box sx={dotStyle(eventColor(t))} />
                          </Tooltip>
                        );
                      }
                    )}
              </Box>

              {isFull && (hasProject || hasInterview) && (
                <Box
                  sx={{
                    mt: 0.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                  }}
                >
                  {dayEvents
                    .filter((e) => e.type === "project")
                    .slice(0, 2)
                    .map((e, idx) => (
                      <Box
                        key={`p-${idx}`}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.25,
                        }}
                      >
                        {e.time && (
                          <Typography
                            variant="caption"
                            sx={{ display: "block" }}
                          >
                            {e.time}
                          </Typography>
                        )}
                        {e.hours && (
                          <Typography
                            variant="caption"
                            sx={{ display: "block" }}
                          >
                            {e.hours}
                          </Typography>
                        )}

                        {(e.changeAvailabilityLabel ||
                          e.onChangeAvailability ||
                          e.changeAvailabilityHref) && (
                          <AppButton
                            label={
                              e.changeAvailabilityLabel ?? "Change availability"
                            }
                            variant="outlined"
                            colorKey="GREEN"
                            width="auto"
                            onClick={() => {
                              if (e.onChangeAvailability)
                                e.onChangeAvailability();
                            }}
                            sx={{
                              width: 125,
                              textAlign: "center",
                              borderRadius: 1,
                              bgcolor: "#E8F5E9",
                              border: "1px solid #2E7D32",
                              color: "#2E7D32",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              lineHeight: 1.2,
                              whiteSpace: "nowrap",
                              mb: 0.5,
                            }}
                          />
                        )}
                      </Box>
                    ))}

                  {dayEvents
                    .filter((e) => e.type === "interview")
                    .map((e, idx) => {
                      const tooltip = (
                        <Box>
                          <Typography
                            sx={{
                              color: colors.DARK_BLUE,
                              fontWeight: 700,
                              mb: 0.25,
                            }}
                          >
                            {e.title ?? "Interview"}
                          </Typography>

                          {e.time && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              Interview {e.time}
                            </Typography>
                          )}

                          {e.meetingUrl && (
                            <Typography
                              component="a"
                              href={e.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              sx={{
                                color: "primary.main",
                                fontWeight: 600,
                                textDecoration: "underline",
                              }}
                            >
                              Join meeting
                            </Typography>
                          )}
                        </Box>
                      );

                      return (
                        <Tooltip
                          key={`i-${idx}`}
                          title={tooltip}
                          arrow
                          placement="top-start"
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: "#fff",
                                color: "text.primary",
                                borderRadius: 1.5,
                                p: 1.25,
                                boxShadow: 3,
                                border: "1px solid",
                                borderColor: "grey.200",
                                maxWidth: 260,
                                pointerEvents: "auto",
                              },
                            },
                            arrow: { sx: { color: "#fff" } },
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              px: 1,
                              py: 0.75,
                              borderRadius: 1.5,
                              bgcolor: "#F3F7FC",
                              border: "1px solid #E0E0E0",
                              cursor: "default",
                              mb: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 4,
                                borderRadius: "4px 0 0 4px",
                                bgcolor: colors.DARK_BLUE,
                              }}
                            />

                            <Box sx={{ pl: 1 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 700,
                                  color: colors.DARK_BLUE,
                                  lineHeight: 1.2,
                                  display: "block",
                                }}
                              >
                                {e.title ?? "Interview"}
                              </Typography>

                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  lineHeight: 1.2,
                                  display: "block",
                                }}
                              >
                                Interview
                              </Typography>

                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  lineHeight: 1.2,
                                  display: "block",
                                }}
                              >
                                {e.time ?? e.label ?? ""}
                              </Typography>
                            </Box>
                          </Box>
                        </Tooltip>
                      );
                    })}

                  {dayEvents.filter((e) => e.type === "project").length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      +
                      {dayEvents.filter((e) => e.type === "project").length - 2}{" "}
                      more
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </>
  );

  if (!framed) return content;

  return (
    <Box sx={{ p: 2, boxShadow: 2, bgcolor: "background.paper" }}>
      {content}
    </Box>
  );
}
