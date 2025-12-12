"use client";

import type { ProjectInfoData } from "@/types/projects";
import { Box, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";

type ProjectInfoProps = {
  data: ProjectInfoData;
  children?: React.ReactNode;
};

const ProjectInfo: React.FC<ProjectInfoProps> = ({ data, children }) => {
  return (
    <Box
      sx={{
        border: "2px solid #FFB64E",
        borderRadius: 1,
        p: 2,
        mb: 2,
        bgcolor: "background.paper",
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="stretch"
        sx={{
          mb: 2,
          "& > *:not(:last-child)": {
            pr: 2,
          },
        }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Project Name
          </Typography>
          <Typography fontWeight={600}>{data.name}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Client & Industry
          </Typography>
          <Typography fontWeight={600}>{data.clientIndustry}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Module
          </Typography>
          <Typography fontWeight={600}>{data.module}</Typography>
        </Grid>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "#E0E0E0",
            display: { xs: "none", md: "block" },
          }}
        />

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Functional Scope
          </Typography>
          <Typography fontWeight={600}>{data.functionalScope}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Technical Scope
          </Typography>
          <Typography fontWeight={600}>{data.technicalScope}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Out of Scope
          </Typography>
          <Typography fontWeight={600}>{data.outOfScope}</Typography>
        </Grid>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "#E0E0E0",
            display: { xs: "none", md: "block" },
          }}
        />

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Start Date
          </Typography>
          <Typography fontWeight={600}>{data.start_date}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Duration
          </Typography>
          <Typography fontWeight={600}>{data.duration}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Status
          </Typography>
          <Typography fontWeight={600} color="primary.main">
            {data.status}
          </Typography>
        </Grid>
      </Grid>

      {children}
    </Box>
  );
};

export default ProjectInfo;
