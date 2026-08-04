export interface ConsultantDashboardSummaryData {
  overview?: {
    total_resources?: number;
    avg_hourly_rate?: number;
    avg_weekly_availability_hours?: number;
    verified_profiles?: number;
    certified_profiles?: number;
    pending_profiles?: number;
    total_verified?: number;
    total_certified?: number;
  };
  modules?: Array<{ name: string; count: number }>;
  experience_levels?: Array<{ label: string; value: number }>;
  countries?: Array<{ name: string; count: number }>;
  profile_status?: Array<{ label: string; value: number }>;
  total_resources?: number;
  avg_hourly_rate?: number;
  avg_weekly_availability_hours?: number;
  verified_profiles?: number;
  certified_profiles?: number;
  pending_profiles?: number;
  modules_breakdown?: Array<{ label: string; value: number }>;
  experience_level_breakdown?: Array<{ label: string; value: number }>;
  countries_breakdown?: Array<{ label: string; value: number }>;
  profile_status_breakdown?: Array<{ label: string; value: number }>;
}
