"use client";

import { consultantLabel } from "@/utils/consultantIdentity";

import { useClientConsultants } from "@/actions/consultants/useClientConsultants";
import { useSapOtherModules } from "@/actions/common/useSapModules";
import {
  useAddConsultants,
  useRemoveConsultant,
} from "@/actions/projects/useAddConsultants";
import { useCreateProject } from "@/actions/projects/useCreateProject";
import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import {
  crewDraftKey,
  readCrewDraft,
  type CrewRole,
} from "@/utils/crewBuilder";
import { useSession } from "next-auth/react";
import {
  getProjectTeamBuilder,
  isTeamBuilderApiEnabled,
  saveProjectTeamBuilder,
} from "@/services/projectTeamBuilder";
import { CustomError } from "@/exceptions/custom-exception";
import ConsultantAvailabilityDialog from "./ConsultantAvailabilityDialog";
import ConsultantProfileModal from "@/components/specific/teambuilder/ConsultantProfileModal";
import TeamBuilderFilters from "@/components/specific/teambuilder/TeamBuilderFilters";
import StatCard from "@/components/StatCard";
import { CONSULTANT_STATUS } from "@/constants/status";
import { teamBuilderColumns, teamBuilderStats } from "@/data/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import type { ApiPagination } from "@/types/api";
import type {
  ClientConsultantDTO,
  TeamBuilderRow,
  TeamCreationProps,
} from "@/types/teamBuilder";
import {
  CONSULTANT_PAGE_SIZE,
  extractConsultantListAndPagination,
  hasMoreConsultants,
} from "@/utils/consultantPagination";
import colors from "@/utils/styles/colors";
import { calculateTeamStats } from "@/utils/teamBuilderCalculations";
import { useAnimatedCounter } from "@/utils/useAnimatedCounter";
import { useProjectProgress } from "@/utils/useProjectProgress";
import { buildConsultantQuery } from "@/utils/consultantQuery";
import { formatHourlyRate } from "@/utils/rates";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function TeamCreation({
  onNext,
  projectId,
  rows,
  setRows,
  selectedIds,
  setSelectedIds,
  clientId,
}: TeamCreationProps) {
  const { data: session } = useSession();
  const owner = String(session?.user?.id ?? "");
  const draftKey = crewDraftKey(owner, projectId, clientId);
  const [roles, setRoles] = useState<CrewRole[]>([]);
  const serverEnabled = isTeamBuilderApiEnabled();
  const [revision, setRevision] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [reloadTeam, setReloadTeam] = useState(0);
  const [draftLoaded, setDraftLoaded] = useState<string | null>(null);
  const [draftError, setDraftError] = useState(false);
  const [visibleIds, setVisibleIds] = useState<string[] | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>(
    {},
  );
  const [paginationMeta, setPaginationMeta] = useState<ApiPagination | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: moduleCatalog } = useSapOtherModules();
  const moduleSearch = useMemo(() => {
    const modules = moduleCatalog?.data?.flatMap((group) => group.modules) ?? [];
    const namesFor = (value: unknown) => {
      const ids = new Set(Array.isArray(value) ? value.map(String) : []);
      return modules.filter((module) => ids.has(String(module.id))).map((module) => module.name);
    };
    return {
      searchQuery,
      publicIdentity: true,
      coreModules: namesFor(activeFilters.modules),
      otherModules: namesFor(activeFilters.other_modules),
    };
  }, [moduleCatalog, activeFilters, searchQuery]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileConsultant, setProfileConsultant] =
    useState<TeamBuilderRow | null>(null);
  const selectedCount = selectedIds.length;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage] = useState("");
  const [snackbarSeverity] = useState<AlertColor>("success");
  const { mutate: loadConsultants, isPending } = useClientConsultants();
  const { mutateAsync: createProjectAsync } = useCreateProject();
  const { toast } = useToast();
  const addConsultants = useAddConsultants();
  const removeConsultant = useRemoveConsultant();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const stats = calculateTeamStats(rows, selectedIds);

  const animatedHoursPerWeek = useAnimatedCounter(stats.hoursPerWeek);
  const animatedAvgRatePerHour = useAnimatedCounter(stats.avgRatePerHour);
  const animatedHoursPerMonth = useAnimatedCounter(stats.hoursPerMonth);
  const animatedPerMonthCost = useAnimatedCounter(stats.perMonthCost);
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const getProjectConsultants = useGetProjectConsultants();
  const [hydrationReady, setHydrationReady] = useState(false);
  const initialLoadRef = useRef(false);
  const requestSequence = useRef(0);
  const selectedIdsRef = useRef(selectedIds);
  const serverMemberIds = useRef(new Set<string>());
  selectedIdsRef.current = selectedIds;
  const { persistRequestedHours } = useProjectProgress();
  const [shortlistedMap, setShortlistedMap] = useState<Record<string, number>>(
    {},
  );
  const [scheduleData, setScheduleData] = useState<
    TeamBuilderRow["working_schedule"] | null
  >(null);

  const [scheduleConsultantId, setScheduleConsultantId] = useState<string | number>("");

  const openSchedule = (row: TeamBuilderRow) => {
    setScheduleConsultantId(row.id);
    setScheduleData(row.working_schedule);
    setScheduleModalOpen(true);
  };
  useEffect(() => {
    if (!owner) return;
    requestSequence.current += 1;
    serverMemberIds.current.clear();
    initialLoadRef.current = false;
    setHydrationReady(false);
    setVisibleIds(null);
    setAddedIds([]);
    setShortlistedMap({});
    setCreatedProjectId(null);
    setRevision(0);
    setServerError(null);
    setActiveFilters({});
    const draft = readCrewDraft(draftKey);
    setRoles(draft?.roles ?? []);
    setRows(draft?.people ?? []);
    setSelectedIds(draft?.selectedIds ?? []);
    setDraftLoaded(draftKey);
  }, [draftKey, owner, setRows, setSelectedIds]);

  const saveDraft = (id?: string | number) => {
    if (!owner) return;
    const key = id ? crewDraftKey(owner, id) : draftKey;
    const selected = new Set(selectedIds);
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          roles: roles.map((r) => ({
            ...r,
            personIds: r.personIds.filter((personId) => selected.has(personId)),
          })),
          people: rows.filter((row) => selected.has(String(row.id))),
          selectedIds,
        }),
      );
      setDraftError(false);
    } catch {
      setDraftError(true);
    }
  };
  useEffect(() => {
    if (draftLoaded === draftKey && hydrationReady) saveDraft();
  }, [roles, rows, selectedIds, draftLoaded, draftKey, hydrationReady]);

  const rowsWithSchedule = rows.map((r) => ({
    ...r,
    openSchedule,
  }));

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const visible = rowsWithSchedule.filter(
      (row) => !visibleIds || visibleIds.includes(String(row.id)),
    );
    if (!query) return visible;

    return visible.filter((row) => {
      const idMatch = consultantLabel(row.id).toLowerCase().includes(query);
      const coreMatch = row.coremodules?.toLowerCase().includes(query);
      const othersMatch = row.othersmodules?.toLowerCase().includes(query);
      return (
        idMatch ||
        coreMatch ||
        othersMatch
      );
    });
  }, [rowsWithSchedule, searchQuery, visibleIds]);

  const mapConsultantRow = (
    item: ClientConsultantDTO,
    index: number,
  ): TeamBuilderRow => ({
    id: item.id,
    name: item.name ?? item.username ?? item.user?.username,
    country: item.country,
    projectName:
      item.project_name && item.project_name !== "N/A"
        ? item.project_name
        : undefined,
    coremodules: item.modules?.core || "N/A",
    othersmodules: item.modules?.others || "N/A",
    experience: item.experience ? `${item.experience} Years` : "N/A",
    experienceYears: item.experience ?? null,
    rate:
      item.rate !== undefined
        ? `${formatHourlyRate(item.rate, item.currency)}/hour`
        : "N/A",
    rateValue: item.rate ?? 0,
    baseRate: item.base_rate ?? null,
    profitMarginPercentage: item.profit_margin_percentage ?? null,
    currency: item.currency ?? "USD",
    showAdminPricing: false,
    avail: item.weekly_available_hours ?? 0,
    request: shortlistedMap[String(item.id)] ?? 0,
    error: "",
    avatar: `/img/u${((index % 5) + 1).toString()}.png`,
    working_schedule: item.working_schedule || undefined,
    badges: item.badges ?? [],
  });

  const fetchConsultants = useCallback(
    (filters: Record<string, unknown> = {}, page = 1) => {
      const sequence = ++requestSequence.current;
      loadConsultants(
        buildConsultantQuery(
          {
            ...filters,
            page,
            limit: CONSULTANT_PAGE_SIZE,
          },
          clientId,
        ),
        {
          onSuccess: (res) => {
            if (sequence !== requestSequence.current) return;
            const { list, pagination } = extractConsultantListAndPagination(
              res.data,
              res.pagination,
            );
            const mapped = list.map((item, index) =>
              mapConsultantRow(item, (page - 1) * CONSULTANT_PAGE_SIZE + index),
            );
            setVisibleIds((current) =>
              page === 1
                ? mapped.map((row) => String(row.id))
                : [
                    ...new Set([
                      ...(current ?? []),
                      ...mapped.map((row) => String(row.id)),
                    ]),
                  ],
            );
            setRows((current) => {
              const merged = mapped.map((row) => {
                const existing = current.find(
                  (person) => String(person.id) === String(row.id),
                );
                return existing
                  ? {
                      ...row,
                      ...(serverMemberIds.current.has(String(row.id))
                        ? existing
                        : {}),
                      request: existing.request,
                      error: existing.error,
                    }
                  : row;
              });
              const preserved =
                page === 1
                  ? current.filter((row) =>
                      selectedIdsRef.current.includes(String(row.id)),
                    )
                  : current;
              return [
                ...preserved.filter(
                  (row) =>
                    !merged.some(
                      (person) => String(person.id) === String(row.id),
                    ),
                ),
                ...merged,
              ];
            });
            setPaginationMeta(pagination);
            setCurrentPage(page);
            setHasMore(hasMoreConsultants(pagination, list.length, page));
            setFilterOpen(false);
          },
          onError: (error) => {
            if (sequence !== requestSequence.current) return;
            const msg =
              error instanceof Error
                ? error.message
                : "Failed to load consultants";
            toast(msg, "error");
          },
        },
      );
    },
    [clientId, loadConsultants, setRows, shortlistedMap, toast],
  );

  useEffect(() => {
    if (!hydrationReady || draftLoaded !== draftKey || initialLoadRef.current)
      return;
    initialLoadRef.current = true;
    fetchConsultants({}, 1);
  }, [fetchConsultants, hydrationReady, draftLoaded, draftKey]);

  const loadMore = useCallback(() => {
    if (isPending || !hasMore) return;
    fetchConsultants(
      activeFilters,
      paginationMeta?.next_page ?? currentPage + 1,
    );
  }, [
    activeFilters,
    currentPage,
    fetchConsultants,
    hasMore,
    isPending,
    paginationMeta,
  ]);

  useEffect(() => {
    if (!owner || draftLoaded !== draftKey) return;
    let cancelled = false;
    if (!projectId && !(serverEnabled && reloadTeam > 0 && createdProjectId)) {
      setHydrationReady(true);
      return;
    }

    if (serverEnabled) {
      setHydrationReady(false);
      setServerError(null);
      getProjectTeamBuilder(projectId || createdProjectId!)
        .then((state) => {
          if (cancelled) return;
          const ids = state.consultants.map((person) => String(person.id));
          serverMemberIds.current = new Set(ids);
          const draft = readCrewDraft(draftKey);
          // A revision-zero project may import its pre-deployment local role plan.
          const savedRoles =
            state.revision === 0 && draft?.roles.length
              ? draft.roles.map((role) => ({
                  ...role,
                  personIds: role.personIds.filter((id) => ids.includes(id)),
                }))
              : state.roles;
          setRoles(savedRoles);
          setRevision(state.revision);
          setRows(
            state.consultants.map((person, index) => ({
              ...mapConsultantRow(person, index),
              request: person.requested_hours,
            })),
          );
          setSelectedIds(ids);
          setAddedIds(ids.map(Number));
          setShortlistedMap(
            Object.fromEntries(
              state.consultants.map((person) => [
                String(person.id),
                person.requested_hours,
              ]),
            ),
          );
          initialLoadRef.current = false;
          setHydrationReady(true);
        })
        .catch((error) => {
          if (!cancelled)
            setServerError(
              error instanceof Error
                ? error.message
                : "Unable to load the saved team.",
            );
        });
      return () => {
        cancelled = true;
      };
    }

    if (!projectId) return;
    const stored = localStorage.getItem(`tb_requested_hours_${projectId}`);

    if (stored) {
      try {
        const map = JSON.parse(stored);
        setShortlistedMap(map);
        if (!readCrewDraft(draftKey)) setSelectedIds(Object.keys(map));
      } catch {
        /* Ignore an invalid legacy hours draft. */
      }
    }

    getProjectConsultants.mutate(
      {
        projectId,
        statuses: [CONSULTANT_STATUS.SHORTLISTED],
      },
      {
        onSuccess: (res) => {
          if (cancelled) return;
          const map: Record<string, number> = {};

          (res.data ?? []).forEach((c) => {
            map[String(c.consultant_id)] = c.requested_hours ?? 0;
          });

          const serverIds = Object.keys(map);
          setAddedIds(serverIds.map(Number));
          setShortlistedMap((current) => ({ ...current, ...map }));
          if (!stored && !readCrewDraft(draftKey)) setSelectedIds(serverIds);
          setRows((current) => {
            const missing = (res.data ?? []).filter(
              (item) =>
                !current.some(
                  (row) => String(row.id) === String(item.consultant_id),
                ),
            );
            return [
              ...current,
              ...missing.map((item) => ({
                id: item.consultant_id,
                name: item.name,
                coremodules: item.modules?.core || "N/A",
                othersmodules: item.modules?.others || "N/A",
                experience: String(item.experience ?? 0) + " Years",
                rate: formatHourlyRate(item.rate, item.currency) + "/hour",
                currency: item.currency ?? "USD",
                rateValue: item.rate,
                avail: item.requested_hours,
                request: item.requested_hours,
                working_schedule: item.working_schedule,
              })),
            ];
          });
          setHydrationReady(true);
        },
        onError: () => {
          if (!cancelled) setHydrationReady(true);
        },
      },
    );
    return () => {
      cancelled = true;
    };
  }, [
    projectId,
    owner,
    draftLoaded,
    draftKey,
    serverEnabled,
    reloadTeam,
    createdProjectId,
  ]);

  const handleSave = async () => {
    if (saving || !hydrationReady || serverError) return;
    const selected = selectedIds.map((id) =>
      rows.find((row) => String(row.id) === id),
    );
    if (
      !selected.length ||
      selected.some(
        (row) =>
          !row ||
          !Number.isInteger(row.request) ||
          row.request <= 0 ||
          row.request > row.avail,
      )
    ) {
      toast(
        "Select consultants and enter valid whole weekly hours for each person.",
        "error",
      );
      return;
    }
    setSaving(true);
    let targetId = projectId || createdProjectId;
    try {
      if (!targetId) {
        const response = await createProjectAsync(
          clientId ? { client_id: clientId } : undefined,
        );
        targetId = String(response.data?.id ?? "");
        if (!targetId) throw new Error("Invalid project response from server");
        setCreatedProjectId(targetId);
      }
      const payload = selected.map((row) => ({
        consultant_id: Number(row!.id),
        requested_hours: row!.request,
      }));
      if (serverEnabled) {
        const saved = await saveProjectTeamBuilder(targetId, {
          revision,
          roles: roles.map((role) => ({
            ...role,
            personIds: role.personIds.filter((id) => selectedIds.includes(id)),
          })),
          consultants: payload,
        });
        setRevision(saved.revision);
        setRoles(saved.roles);
      } else {
        await addConsultants.mutateAsync({
          projectId: targetId,
          body: payload,
        });
        for (const id of addedIds.filter(
          (id) => !selectedIds.includes(String(id)),
        )) {
          await removeConsultant.mutateAsync({
            projectId: targetId,
            consultantId: id,
          });
          setAddedIds((current) =>
            current.filter((personId) => personId !== id),
          );
        }
      }
      setAddedIds(selectedIds.map(Number));
      persistRequestedHours(targetId, rows, selectedIds);
      saveDraft(targetId);
      if (!projectId) {
        try {
          localStorage.removeItem(draftKey);
        } catch {
          /* The project copy remains available. */
        }
      }
      toast(
        serverEnabled ? "Team shortlist saved!" : "Team shortlist saved!",
        "success",
      );
      onNext?.(targetId);
    } catch (error) {
      if (
        serverEnabled &&
        error instanceof CustomError &&
        error.statusCode === 409
      ) {
        setServerError(
          "The team changed on the server or a protected team member cannot be changed. Export your draft if needed, then reload the saved team before retrying.",
        );
      }
      toast(
        error instanceof Error
          ? error.message
          : "Unable to save your team. Please retry.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRequestChange = (
    id: string | number,
    value: number,
    avail: number,
  ): void => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              request: value,
              error: value > avail ? `Max: ${avail} hours` : "",
            }
          : row,
      ),
    );
  };

  const handleFilter = (filters: Record<string, unknown>) => {
    setActiveFilters(filters);
    setPaginationMeta(null);
    setCurrentPage(1);
    setHasMore(true);
    fetchConsultants(filters, 1);
  };

  const handleViewProfile = (row: TeamBuilderRow) => {
    setProfileConsultant(row);
    setProfileModalOpen(true);
  };

  const handleAddConsultantToSelection = () => {
    if (!profileConsultant) return;

    const id = String(profileConsultant.id);
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
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
            <Typography variant="body2" sx={{ fontWeight: 400 }}>
              Set weekly hours, and review your projected engagement cost.
            </Typography>
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

        {serverError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button
                color="inherit"
                onClick={() => setReloadTeam((n) => n + 1)}
              >
                Reload saved team
              </Button>
            }
          >
            {serverError}
          </Alert>
        )}
        {serverEnabled && !hydrationReady && !serverError && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Loading saved shortlist…
          </Alert>
        )}
        {draftError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Your selection could not be saved in this browser. Save your
            shortlist before leaving this page.
          </Alert>
        )}
        <Box
          mt={3}
          sx={{
            boxShadow: 2,
            bgcolor: colors.LIGHT_YELLOW,
            py: 2,
            borderRadius: 2,
          }}
        >
          <fieldset
            disabled={saving || !hydrationReady}
            aria-busy={saving || !hydrationReady}
            style={{
              border: 0,
              padding: 0,
              margin: 0,
              minWidth: 0,
              pointerEvents: saving || !hydrationReady ? "none" : undefined,
            }}
          >
            <DataTable<TeamBuilderRow>
              variant="consultant"
              title="Consultant Selection"
              hidePagination
              scrollHeight={560}
              onScrollEnd={loadMore}
              loadingMore={isPending}
              showSearch
              searchPlaceholder="Search by consultant ID or module..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              columns={teamBuilderColumns(
                handleRequestChange,
                handleViewProfile,
                moduleSearch,
              )}
              rows={filteredRows}
              enableSelection
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              rowClickable={false}
            />
          </fieldset>

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

          {scheduleModalOpen && <ConsultantAvailabilityDialog
            open={scheduleModalOpen}
            onClose={() => setScheduleModalOpen(false)}
            consultantId={scheduleConsultantId}
            schedule={scheduleData}
          />}

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
              <AppButton
                label={saving ? "Saving team?" : "Save & Continue"}
                colorKey="BLUE"
                width={190}
                onClick={handleSave}
                disabled={
                  saving || !selectedCount || !hydrationReady || !!serverError
                }
              />
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
