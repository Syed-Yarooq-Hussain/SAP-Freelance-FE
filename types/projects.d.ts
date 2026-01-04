export interface IProject {
  id: string;
  client_id: string;
  name: string;
  company_name: string;
  status: string;
}

export interface ProjectInfoData {
  name: string;
  clientIndustry: string;
  module: string;
  functionalScope: string;
  technicalScope: string;
  outOfScope: string;
  start_date: string;
  duration: string;
  status: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface MilestoneData {
  name: string;
  dependencies: string;
  details: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface ProjectDetailsLayoutProps {
  stats: StatCardProps[];
  projectInfo: ProjectInfoData;
  teamMembers: TeamMember[];
  children?: React.ReactNode;
  showMilestone?: boolean;
  milestoneData?: MilestoneData;
}

export interface IProjectDetailsResponse {
  id: string;
  name: string;
  client_id: string;
  company_name: string;
  status: string;
  deleted_at: string | null;

  projectDetails?: {
    id: string;
    start_date: string;
    end_date: string;
    duration: string;
    cost: number;
    paid_amount: number;
    project_id: string;
    deleted_at: string | null;
  };

  client?: {
    id: number;
    username: string;
    email: string;
    currency: string;
    city: string;
    country: string;
    phone: string;
    status: string;
    deleted_at: string | null;
  };
}

export interface IAdminProject {
  id: string;
  name: string;
  status: string;
  client_name: string;
  start_date: string;
  duration: string;
  modules: {
    core: string;
    others: string;
  };
}