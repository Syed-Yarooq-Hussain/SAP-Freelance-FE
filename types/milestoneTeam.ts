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
  configured?: boolean;
  breakdown?: {
    consultant_id: string;
    name?: string;
    hours: number;
    hourly_rate: number;
    status: string;
    estimated_amount: number;
    payable_amount: number;
    currency: string;
  }[];
}
