"use client";

import AppButton from "@/components/Button";
import { CreateForm } from "@/components/CreateForm";
import DataTable from "@/components/DataTable";
import FilterDrawer from "@/components/FilterDrawer";
import StatCard from "@/components/StatCard";
import {
    teamBuilderColumns,
    teamBuilderFormElements,
    teamBuilderRows,
    teamBuilderStats,
} from "@/data/teamBuilder";
import colors from "@/utils/styles/colors";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";

type TeamCreationProps = {
  onNext: () => void;
  onDiscard?: () => void;
};

export default function TeamCreation({ onNext, onDiscard }: TeamCreationProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCount] = useState(0);

  const handleFormSubmit = (data: Record<string, string | number | boolean>) =>
    console.log("Form submitted:", data);

  return (
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
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Project Details
        </Typography>

        <Button
          onClick={() => setFilterOpen(true)}
          startIcon={<FilterListIcon />}
          sx={{
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

      <CreateForm
        elements={teamBuilderFormElements}
        onSuccess={handleFormSubmit}
        actionsContainerProps={{ sx: { display: "none" } }}
      />

      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

      <Grid container spacing={2} mt={3}>
        {teamBuilderStats.map((s, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Box mt={3}>
        <DataTable
          title="Consultant Selection"
          columns={teamBuilderColumns}
          rows={teamBuilderRows}
          pageSize={10}
          showAvatar
          avatarField="avatar"
          enableSelection
        />

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
            <AppButton
              label="Discard"
              colorKey="RED"
              width={180}
              onClick={onDiscard}
            />
            <AppButton
              label="Add to Shortlist"
              colorKey="BLUE"
              width={180}
              onClick={onNext}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
