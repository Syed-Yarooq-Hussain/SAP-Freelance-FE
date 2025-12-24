"use client";

import ProjectInfo from "@/components/ProjectInfo";
import ProjectMilestone from "@/components/ProjectMilestone";
import ProjectTeam from "@/components/ProjectTeam";
import DashboardStats from "@/components/StatsCardList";
import type { ProjectDetailsLayoutProps } from "@/types/projects";
import { Box } from "@mui/material";

export default function ProjectDetailsLayout({
  stats,
  projectInfo,
  teamMembers,
  children,
  showMilestone = false,
  milestoneData,
}: ProjectDetailsLayoutProps) {
  return (
    <Box>
      <DashboardStats stats={stats} containerProps={{ marginBottom: "30px" }} />

      <Box
        sx={{
          p: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <ProjectInfo data={projectInfo}>
          <ProjectTeam team={teamMembers} />
          {showMilestone && milestoneData && (
            <ProjectMilestone milestone={milestoneData} />
          )}
        </ProjectInfo>

        {children}
      </Box>
    </Box>
  );
}
