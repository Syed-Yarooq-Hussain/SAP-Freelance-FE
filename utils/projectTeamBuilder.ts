import type { ProjectTeamBuilderState } from "@/types/projectTeamBuilder";
import type { CrewDraft } from "@/utils/crewBuilder";
import { formatHourlyRate } from "@/utils/rates";

export function teamBuilderStateToDraft(
  state: ProjectTeamBuilderState,
): CrewDraft {
  return {
    roles: state.roles,
    selectedIds: state.consultants.map((person) => String(person.id)),
    people: state.consultants.map((person) => ({
      id: person.id,
      name: person.name ?? person.username,
      coremodules: person.modules?.core || "N/A",
      othersmodules: person.modules?.others || "N/A",
      experience: `${person.experience ?? 0} Years`,
      rate: `${formatHourlyRate(person.rate ?? 0, person.currency)}/hour`,
      rateValue: person.rate,
      currency: person.currency,
      avail: person.weekly_available_hours ?? 0,
      request: person.requested_hours,
      working_schedule: person.working_schedule,
    })),
  };
}
