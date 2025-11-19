import { IBaseUser } from "./common-auth";

export interface IConsultantExtra {
  module: string;
  level: string;
  experience: number;
  rate: number;
  weekly_available_hours: number;
  schedule: Record<string, string>;
  cv_url: string;
}

export interface IConsultantSignupPayload {
  user: IBaseUser;
  consultant: IConsultantExtra;
}

export interface IConsultantMeta {
  id: number;
  module_id: number | null;
  level_id: number | null;
  experience: number | null;
  rate: number | null;
  weekly_available_hours: number | null;
  user_id: string;
  working_schedule: unknown | null;
  skills: unknown | null;
  career_details: unknown | null;
}

export interface IConsultantUser extends IUser {
  consultants: IConsultantMeta;
}
