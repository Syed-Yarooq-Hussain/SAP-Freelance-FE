"use client";

import ProjectInfo from "@/components/ProjectInfo";
import ProjectMilestone from "@/components/ProjectMilestone";
import ProjectTeam from "@/components/ProjectTeam";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import { Box } from "@mui/material";

interface ProjectInfoData {
  projectName: string;
  clientName: string;
  industry: string;
  module: string;
  functionalScope: string;
  technicalScope: string;
  outOfScope: string;
  startDate: string;
  duration: string;
  status: string;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

interface MilestoneData {
  name: string;
  dependencies: string;
  details: string;
  deadline: string;
  status: string;
}

interface ProjectDetailsLayoutProps {
  stats: StatCardProps[];
  projectInfo: ProjectInfoData;
  teamMembers: TeamMember[];
  children?: React.ReactNode;
  showMilestone?: boolean;
  milestoneData?: MilestoneData;
}

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
          borderRadius: 2,
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
