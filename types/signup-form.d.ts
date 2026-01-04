export interface ISignUpClientForm {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  country: string;
}

export interface ISignUpConsultantForm {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  city?: string;
  country?: string;
  coreModule: any;
  otherModule: any;
  experience: number;
  rate: number;
  weekly_available_hours: number;
  availability: {
    day: string;
    enabled: boolean;
    start?: string;
    end?: string;
  }[];

  cvUrl?: string;
}

export interface ISapModule {
  id: string;
  name: string;
  is_core: boolean;
  deleted_at: string | null;
}