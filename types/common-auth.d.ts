export interface IBaseSignupDTO {
  username: string;
  role: number;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  currency: string;
  city: string;
  country: string;
  status: number;
}

export interface ISignupDTO {
  // username: string;
  email:string;
  password: string
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  username: string;
  avatar?: string;
  role: number;
  email: string;
  phone: string;
  currency: string;
  city: string;
  country: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IAuthResponse {
  code: number;
  status: string;
  message: string;
  data: IUser & { token: string };
}
