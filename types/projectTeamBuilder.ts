import type { ClientConsultantDTO } from "@/types/teamBuilder";
import type { CrewRole } from "@/utils/crewBuilder";

export interface ProjectTeamBuilderMember extends ClientConsultantDTO {
  requested_hours: number;
}

export interface ProjectTeamBuilderState {
  revision: number;
  roles: CrewRole[];
  consultants: ProjectTeamBuilderMember[];
}

export interface SaveProjectTeamBuilder {
  revision: number;
  roles: CrewRole[];
  consultants: { consultant_id: number; requested_hours: number }[];
}
