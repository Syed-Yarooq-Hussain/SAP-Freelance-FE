"use client";

import { useClientConsultants } from "@/actions/consultants/useClientConsultants";
import { useAddConsultants } from "@/actions/projects/useAddConsultants";
import { useCreateProject } from "@/actions/projects/useCreateProject";
import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import ConsultantProfileModal from "@/components/specific/teambuilder/ConsultantProfileModal";
import TeamBuilderFilters from "@/components/specific/teambuilder/TeamBuilderFilters";
import DynamicPopup from "@/components/Popup";
import StatCard from "@/components/StatCard";
import { CONSULTANT_STATUS } from "@/constants/status";
import { teamBuilderColumns, teamBuilderStats } from "@/data/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import type {
  ClientConsultantDTO,
  TeamBuilderRow,
  TeamCreationProps,
  Weekday,
} from "@/types/teamBuilder";
import colors from "@/utils/styles/colors";
import {
  calculateTeamStats,
} from "@/utils/teamBuilderCalculations";
import { useAnimatedCounter } from "@/utils/useAnimatedCounter";
import { useProjectProgress } from "@/utils/useProjectProgress";
import FilterListIcon from "@mui/icons-material/FilterList";
import Groups2Icon from "@mui/icons-material/Groups2";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export default function TeamCreation({
  onNext,
  projectId,
  rows,
  setRows,
  selectedIds,
  setSelectedIds,
}: TeamCreationProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileConsultant, setProfileConsultant] = useState<TeamBuilderRow | null>(
    null
  );
  const selectedCount = selectedIds.length;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage] = useState("");
  const [snackbarSeverity] = useState<AlertColor>("success");
  const { mutate: loadConsultants, isPending } = useClientConsultants();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { toast } = useToast();
  const addConsultants = useAddConsultants();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const stats = calculateTeamStats(rows, selectedIds);
  const isProjectAlreadyCreated = Boolean(projectId);

  const animatedHoursPerWeek = useAnimatedCounter(stats.hoursPerWeek);
  const animatedAvgRatePerHour = useAnimatedCounter(stats.avgRatePerHour);
  const animatedHoursPerMonth = useAnimatedCounter(stats.hoursPerMonth);
  const animatedPerMonthCost = useAnimatedCounter(stats.perMonthCost);
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const getProjectConsultants = useGetProjectConsultants();
  const [hydrationReady, setHydrationReady] = useState(false);
  const { persistRequestedHours } = useProjectProgress();
  const [shortlistedMap, setShortlistedMap] = useState<Record<string, number>>(
    {}
  );
  const [scheduleData, setScheduleData] = useState<
    TeamBuilderRow["working_schedule"] | null
  >(null);

  const openSchedule = (row: TeamBuilderRow) => {
    setScheduleData(row.working_schedule);
    setScheduleModalOpen(true);
  };
  const rowsWithSchedule = rows.map((r) => ({
    ...r,
    openSchedule,
  }));

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rowsWithSchedule;

    return rowsWithSchedule.filter((row) => {
      const idMatch = String(row.id).toLowerCase().includes(query);
      const coreMatch = row.coremodules?.toLowerCase().includes(query);
      const othersMatch = row.othersmodules?.toLowerCase().includes(query);
      return idMatch || coreMatch || othersMatch;
    });
  }, [rowsWithSchedule, searchQuery]);

  const mapConsultantRow = (
    item: ClientConsultantDTO,
    index: number
  ): TeamBuilderRow => ({
    id: item.id,
    name: item.name,
    country: item.country,
    projectName:
      item.project_name && item.project_name !== "N/A"
        ? item.project_name
        : undefined,
    coremodules: item.modules?.core || "N/A",
    othersmodules: item.modules?.others || "N/A",
    experience: item.experience ? `${item.experience} Years` : "N/A",
    experienceYears: item.experience ?? null,
    rate: item.rate ? `$${item.rate}/hour` : "N/A",
    rateValue: item.rate ?? 0,
    avail: item.weekly_available_hours ?? 0,
    request: shortlistedMap[String(item.id)] ?? 0,
    error: "",
    avatar: `/img/u${((index % 5) + 1).toString()}.png`,
    working_schedule: item.working_schedule || undefined,
    badges: item.badges ?? [],
  });

  useEffect(() => {
    if (!hydrationReady) return;
    if (rows.length > 0) return;

    loadConsultants(undefined, {
      onSuccess: (res) => {
        const mapped: TeamBuilderRow[] =
          res.data?.map((item: ClientConsultantDTO, index: number) =>
            mapConsultantRow(item, index)
          ) ?? [];
        setRows(mapped);
      },
      onError: (error) => {
        const msg =
          error instanceof Error ? error.message : "Failed to load consultants";
        toast(msg, "error");
      },
    });
  }, [
    hydrationReady,
    rows.length,
    shortlistedMap,
    loadConsultants,
    toast,
    setRows,
  ]);

  useEffect(() => {
    if (!projectId) {
      setHydrationReady(true);
      return;
    }

    const stored = localStorage.getItem(`tb_requested_hours_${projectId}`);

    if (stored) {
      const map = JSON.parse(stored);
      setShortlistedMap(map);
      setSelectedIds(Object.keys(map));
      setHydrationReady(true);
      return;
    }

    getProjectConsultants.mutate(
      {
        projectId,
        statuses: [CONSULTANT_STATUS.SHORTLISTED],
      },
      {
        onSuccess: (res) => {
          const map: Record<string, number> = {};

          (res.data ?? []).forEach((c) => {
            map[String(c.consultant_id)] = c.requested_hours ?? 0;
          });

          setShortlistedMap(map);
          setSelectedIds(Object.keys(map));
          setHydrationReady(true);
        },
      }
    );
  }, [projectId]);

  const handleAddToShortlist = () => {
    createProject(undefined, {
      onSuccess: (res) => {
        const projectId = res.data?.id;
        const projectName = res.data?.name;

        if (!projectId) {
          toast("Invalid project response from server", "error");
          return;
        }

        persistRequestedHours(projectId, rows, selectedIds);

        const newProject = {
          id: projectId,
          name: projectName || "Untitled Project",
          step: 2,
          status: res.data?.status ?? "Initiated",
        };

        let stored = JSON.parse(localStorage.getItem("tb_projects") || "[]");

        stored.push(newProject);
        stored = stored.slice(-5);

        localStorage.setItem("tb_projects", JSON.stringify(stored));
        window.dispatchEvent(new Event("tb_projects_updated"));
        toast("Project created!", "success");

        const payload = selectedIds.map((id) => {
          const row = rows.find((c) => c.id.toString() === id);
          return {
            consultant_id: Number(id),
            requested_hours: Number(row?.request ?? 0),
          };
        });

        addConsultants.mutate(
          { projectId, body: payload },
          {
            onSuccess: () => {
              toast("Consultants added to shortlist!", "success");
              onNext?.(projectId);
            },
            onError: (err: Error) => toast(err.message, "error"),
          }
        );
      },
      onError: (err: Error) => {
        toast(err.message, "error");
      },
    });
  };

  const buildConsultantPayload = () =>
    selectedIds
      .filter((id) => !addedIds.includes(Number(id)))
      .map((id) => {
        const row = rows.find((c) => String(c.id) === String(id));
        return {
          consultant_id: Number(id),
          requested_hours: Number(row?.request ?? 0),
        };
      });

  const handleProceedNext = () => {
    if (!projectId) return;

    persistRequestedHours(projectId, rows, selectedIds);

    const payload = buildConsultantPayload();

    if (payload.length === 0) {
      onNext?.(projectId);
      return;
    }

    addConsultants.mutate(
      { projectId, body: payload },
      {
        onSuccess: () => {
          setAddedIds((prev) => [
            ...prev,
            ...payload.map((p) => p.consultant_id),
          ]);

          toast("Shortlist updated successfully!", "success");
          onNext?.(projectId);
        },
        onError: (err: Error) => {
          toast(err.message, "error");
        },
      }
    );
  };

  const isAddDisabled =
    rows.length === 0 ||
    selectedIds.some((id) => {
      const row = rows.find((r) => String(r.id) === String(id));
      return !row || row.request <= 0 || row.request > row.avail;
    });

  const handleRequestChange = (
    id: string | number,
    value: number,
    avail: number
  ): void => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              request: value,
              error: value > avail ? `Max: ${avail} hours` : "",
            }
          : row
      )
    );
  };

  const handleFilter = (filters:any) => {
    loadConsultants(filters, {
      onSuccess: (res) => {
        const mapped: TeamBuilderRow[] =
          res.data?.map((item: ClientConsultantDTO, index: number) =>
            mapConsultantRow(item, index)
          ) ?? [];
        setRows(mapped);
        setFilterOpen(false);
      },
      onError: (error) => {
        const msg =
          error instanceof Error ? error.message : "Failed to load consultants";
        toast(msg, "error");
      },
    });
  };

  const handleViewProfile = (row: TeamBuilderRow) => {
    setProfileConsultant(row);
    setProfileModalOpen(true);
  };

  const handleAddConsultantToSelection = () => {
    if (!profileConsultant) return;

    const id = String(profileConsultant.id);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
    setProfileModalOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          mt: 3,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Build Your Team
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 400 }}>Set weekly hours, and review your projected engagement cost.</Typography>
          </Box>
          <Button
            onClick={() => setFilterOpen((prev) => !prev)}
            startIcon={<FilterListIcon />}
            sx={{
              ml: "auto",
              border: `1px solid ${colors.BLUE}`,
              color: colors.BLUE,
              textTransform: "none",
              borderRadius: "50px",
              fontWeight: 500,
              px: 2,
              py: 0.5,
              fontSize: "0.875rem",
              bgcolor: "white",
              "&:hover": {
                bgcolor: `${colors.BLUE}10`,
                borderColor: colors.BLUE,
              },
              boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
            }}
          >
            Filters
          </Button>
        </Box>

      

        <Grid container spacing={2} mb={3} mt={2}>
          {teamBuilderStats.map((s, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                {...s}
                subtitle={
                  index === 0
                    ? animatedHoursPerWeek
                    : index === 1
                    ? `$${animatedAvgRatePerHour}`
                    : index === 2
                    ? animatedHoursPerMonth
                    : index === 3
                    ? `$${Number(animatedPerMonthCost).toLocaleString()}`
                    : s.subtitle
                }
              />
            </Grid>
          ))}
        </Grid>

        <TeamBuilderFilters
          open={filterOpen}
          onApply={(filters) => handleFilter(filters)}
        />

        <Box mt={3} sx={{ boxShadow: 2, bgcolor: colors.LIGHT_YELLOW, py:2, borderRadius: 2 }}>
          {isPending ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <DataTable
              variant="consultant"
              title="Consultant Selection"
              titleIcon={
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: `${colors.ICON_BLUE}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Groups2Icon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
              }
              showSearch
              searchPlaceholder="Search by ID or module..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              columns={teamBuilderColumns(
                handleRequestChange,
                handleViewProfile
              )}
              rows={filteredRows}
              pageSize={10}
              enableSelection
              selectedIds={selectedIds}
              onSelectionChange={(ids) => setSelectedIds(ids)}
              rowClickable={false}
            />
          )}

          <ConsultantProfileModal
            open={profileModalOpen}
            consultant={profileConsultant}
            isSelected={
              profileConsultant
                ? selectedIds.includes(String(profileConsultant.id))
                : false
            }
            onClose={() => {
              setProfileModalOpen(false);
              setProfileConsultant(null);
            }}
            onAddToSelection={handleAddConsultantToSelection}
          />

          <DynamicPopup
            open={scheduleModalOpen}
            onClose={() => setScheduleModalOpen(false)}
            title="Working Schedule"
            description=""
          >
            <Box sx={{ mt: 2 }}>
              {scheduleData?.weekly?.map((day: Weekday, i: number) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Typography>{day.day}</Typography>

                  {day.active ? (
                    <Typography>
                      {day.slot[0].start} - {day.slot[0].end}
                    </Typography>
                  ) : (
                    <Typography color="red">Not Active</Typography>
                  )}
                </Box>
              ))}
            </Box>
          </DynamicPopup>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
            flexWrap="wrap"
            gap={2}
            px={2}
          >
            {selectedCount > 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {selectedCount} selected
              </Typography>
            ) : (
              <Typography variant="body2" color="transparent">
                &nbsp;
              </Typography>
            )}

            <Box display="flex" alignItems="center" gap={1.5}>
              {!isProjectAlreadyCreated ? (
                <AppButton
                  label="Add to Shortlist"
                  colorKey="BLUE"
                  width={180}
                  onClick={handleAddToShortlist}
                  disabled={isCreating || isAddDisabled}
                />
              ) : (
                <AppButton
                  label="Proceed to next step"
                  colorKey="BLUE"
                  width={180}
                  onClick={handleProceedNext}
                  disabled={isAddDisabled}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setSnackbarOpen(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
