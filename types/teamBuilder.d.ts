import type { STATUS } from "@/constants/status_dropdown";

export interface ShortlistedRow {
  id: string;
  modules: string;
  experience: string;
  hourlyRate: string;
  status: STATUS;
  interview: string;
}

export interface CandidateRow {
  id: number;
  avatar: string;
  name: string;
  modules: string;
  experience: string;
  hourlyRate: string;
  signed: string;
  role: string;
}

export type TeamCreationProps = {
  onNext: () => void;
  onDiscard?: () => void;
};

export type TeamBuilderRow = {
  id: string | number;
  modules: string;
  experience: string;
  rate: string;
  avail: number;
  request: number;
  avatar?: string;
};