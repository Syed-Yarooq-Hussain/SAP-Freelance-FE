import { IUser } from "@/types/common-auth";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: IUser;
    token: string;
  }

  interface User extends IUser {
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: IUser;
    token: string;
  }
}
