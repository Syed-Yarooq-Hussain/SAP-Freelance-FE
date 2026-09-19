export interface MilestoneAllocation {
  consultant_id: string;
  hours: number;
}

export interface MilestoneTeam {
  revision: number;
  allocations: MilestoneAllocation[];
  locked: boolean;
  estimated_amount: number;
  payable_amount: number;
  currency: string;
}
