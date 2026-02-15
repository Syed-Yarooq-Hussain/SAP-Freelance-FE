import { ILoginForm } from "@/types/common-auth";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getMe } from "@/services/getMe";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { API_STATUS } from "../constants/api_status";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" }, // LinkedIn token
      },
      authorize: async (credentials:any) => {
        try {

          // --- CASE 1: LinkedIn OAuth via token ---
          if (credentials?.token) {
            try {
              const linkedInUser = await getMe(credentials.token);
              if (!linkedInUser) {
                console.error("LinkedIn auth failed: User data not found");
                return null;
              }

              return {
                ...linkedInUser,
                token: credentials.token,
                accessToken: credentials.token,
              };
            } catch (error: any) {
              console.error("LinkedIn auth failed in authorize:", error?.message || error);
              // Return null instead of throwing to prevent CredentialsSignin error
              return null;
            }
          }

          // --- CASE 2: Regular email/password login ---
          if (credentials?.email && credentials?.password) {
            const data = credentials as ILoginForm;

            const response = await request<ILoginForm, any>({
              url: API_ROUTES.LOGIN,
              method: "POST",
              data,
            });

            if (response.status === API_STATUS.ERROR || !response.data?.token) {
              console.error("Email/password login failed:", response.message);
              return null;
            }

            return {
              ...response.data,
              accessToken: response.data.token,
            };
          }

          // If neither token nor email/password is provided
          console.warn("No valid credentials provided");
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.accessToken = (user as any).token || (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: token.user as typeof session.user,
        accessToken: token.accessToken as string,
      };
    },
  },
});
