export interface IBaseSignupDTO{
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

export interface ILoginForm {
  email: string;
  password: string;
}
