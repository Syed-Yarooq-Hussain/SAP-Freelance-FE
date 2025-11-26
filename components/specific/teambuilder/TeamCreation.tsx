"use client";

import { useClientConsultants } from "@/actions/consultants/useClientConsultants";
import { useAddConsultants } from "@/actions/projects/useAddConsultants";
import { useCreateProject } from "@/actions/projects/useCreateProject";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import FilterDrawer from "@/components/FilterDrawer";
import StatCard from "@/components/StatCard";
import { teamBuilderColumns, teamBuilderStats } from "@/data/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import type { IConsultantUser } from "@/types/consultant";
import type { TeamBuilderRow, TeamCreationProps } from "@/types/teamBuilder";
import colors from "@/utils/styles/colors";
import FilterListIcon from "@mui/icons-material/FilterList";
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
import { useEffect, useState } from "react";

export default function TeamCreation({ onNext }: TeamCreationProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCount] = useState(0);
  const [consultantRows, setConsultantRows] = useState<TeamBuilderRow[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage] = useState("");
  const [snackbarSeverity] = useState<AlertColor>("success");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { mutate: loadConsultants, isPending } = useClientConsultants();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { toast } = useToast();
  const addConsultants = useAddConsultants();

  useEffect(() => {
    loadConsultants(undefined, {
      onSuccess: (res) => {
        const mapped: TeamBuilderRow[] =
          res.data
            ?.filter((item: IConsultantUser) => {
              const c = item.consultants;
              return !(
                c?.id === null &&
                c?.module_id === null &&
                c?.level_id === null &&
                c?.experience === null &&
                c?.rate === null &&
                c?.weekly_available_hours === null
              );
            })
            .map((item: IConsultantUser, index: number) => {
              const c = item.consultants;

              return {
                id: c.id ?? `consultant-${index + 1}`,
                modules: c.module_id ? String(c.module_id) : "N/A",
                experience: c.experience ? `${c.experience} Years` : "N/A",
                rate: c.rate ? `$${c.rate}/hour` : "N/A",
                avail: c.weekly_available_hours ?? 0,
                request: 0,
                avatar: `/img/u${((index % 5) + 1).toString()}.png`,
              };
            }) ?? [];

        setConsultantRows(mapped);
      },
      onError: (error) => {
        const msg =
          error instanceof Error ? error.message : "Failed to load consultants";
        toast(msg, "error");
      },
    });
  }, [loadConsultants, toast]);

  const handleAddToShortlist = () => {
    createProject(undefined, {
      onSuccess: (res) => {
        const projectId = res.data?.id;

        if (!projectId) {
          toast("Invalid project response from server", "error");
          return;
        }

        toast("Project created!", "success");

        const payload = selectedRows.map((id) => {
          const row = consultantRows.find((c) => c.id.toString() === id);

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

  const isAddDisabled =
    selectedRows.length === 0 ||
    selectedRows.some((id) => {
      const row = consultantRows.find((r) => r.id.toString() === id);
      return !row || row.request <= 0 || row.request > row.avail;
    });

  const handleRequestChange = (
    id: string | number,
    value: number,
    avail: number
  ): void => {
    setConsultantRows((prev: TeamBuilderRow[]) =>
      prev.map((row: TeamBuilderRow) =>
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

  return (
    <>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
          mt: 3,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          {/* <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Project Details
          </Typography> */}

          <Button
            onClick={() => setFilterOpen(true)}
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

        {/* <CreateForm
          elements={getTeamBuilderFormFields()}
          onSuccess={() => {}}
          actionsContainerProps={{ sx: { display: "none" } }}
        /> */}

        <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

        <Grid container spacing={2} mt={3}>
          {teamBuilderStats.map((s, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        <Box mt={3}>
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
              title="Consultant Selection"
              columns={teamBuilderColumns(handleRequestChange)}
              rows={consultantRows}
              pageSize={10}
              showAvatar
              avatarField="avatar"
              enableSelection
              onSelectionChange={(ids) => setSelectedRows(ids)}
            />
          )}

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
            flexWrap="wrap"
            gap={2}
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
              <AppButton label="Discard" colorKey="RED" width={180} />
              <AppButton
                label="Add to Shortlist"
                colorKey="BLUE"
                width={180}
                onClick={handleAddToShortlist}
                disabled={isCreating || isAddDisabled}
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
