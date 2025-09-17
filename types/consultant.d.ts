import { IBaseUser } from "./commonauth";

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
