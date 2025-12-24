"use client";

import { Avatar, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";

type TeamMember = {
  name: string;
  role: string;
  avatar: string;
};

type ProjectTeamProps = {
  team: TeamMember[];
};

const ProjectTeam: React.FC<ProjectTeamProps> = ({ team }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="h6" fontWeight={700} mb={1.5} color="text.primary">
        Team
      </Typography>

      <Grid container spacing={2}>
        {team.map((member, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                src={member.avatar}
                alt={member.name}
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {member.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  {member.role}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectTeam;
