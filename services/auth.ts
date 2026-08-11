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
        timezone: { label: "Timezone", type: "text" },
        token: { label: "Token", type: "text", required:false },
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

            try {
              const response = await request<ILoginForm, any>({
                url: API_ROUTES.LOGIN,
                method: "POST",
                data,
              });
              

              if (response.status === API_STATUS.ERROR || !response.data?.token) {
                const errorMessage = response.message || "Login failed";
                console.error("Email/password login failed - Backend Error:", {
                  status: response.status,
                  code: response.code,
                  message: errorMessage,
                  fullResponse: response
                });
                // Throw error with backend message so NextAuth can show it
                throw new Error(errorMessage);
              }

              return {
                ...response.data,
                accessToken: response.data.token,
              };
            } catch (error: any) {
              // Catch errors thrown by request utility (CustomError, AxiosError, etc.)
              const backendResponse = error?.response?.data || error?.response;
              const errorMessage = backendResponse?.message || error?.message || "Login failed";
              
              console.error("Email/password login failed - Request Error:", {
                error,
                message: errorMessage,
                code: error?.statusCode || error?.code || backendResponse?.code,
                response: backendResponse,
                stack: error?.stack
              });
              
              // Throw error with backend message so NextAuth can show it
              throw new Error(errorMessage);
            }
          }

          // If neither token nor email/password is provided
          console.warn("No valid credentials provided");
          return null;
        } catch (error) {
          // If it's an Error with a message (backend error), re-throw it so NextAuth can show it
          if (error instanceof Error && error.message) {
            throw error;
          }
          
          console.error("Authorize error - Unexpected error:", {
            error,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          });
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
