"use client";

import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import React from "react";
import AppButton from "./Button";

type MilestoneData = {
  name: string;
  dependencies: string;
  details: string;
  deadline: string;
  status: string;
};

type ProjectMilestoneProps = {
  milestone: MilestoneData;
  showActions?: boolean;
};

const ProjectMilestone: React.FC<ProjectMilestoneProps> = ({
  milestone,
  showActions = true,
}) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography
        variant="body1"
        fontWeight={600}
        mb={1.5}
        color="text.primary"
      >
        Milestone
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Name
          </Typography>
          <Typography fontWeight={600}>{milestone.name}</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Dependencies
          </Typography>
          <Typography fontWeight={600}>{milestone.dependencies}</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Details
          </Typography>
          <Typography fontWeight={600} noWrap title={milestone.details}>
            {milestone.details}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Deadline
          </Typography>
          <Typography fontWeight={600}>{milestone.deadline}</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <TextField
            select
            size="small"
            value={milestone.status}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 1 },
              mt: 0.5,
            }}
          >
            {["To do", "In progress", "Completed", "Delayed"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {showActions && (
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              gap: 2,
              mt: { xs: 1, md: 0 },
            }}
          >
            <AppButton label="Edit" colorKey="BLUE" width={180} />
            <AppButton label="Delete" colorKey="RED" width={180} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProjectMilestone;
