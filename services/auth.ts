import { ILoginForm } from "@/types/common-auth";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getMe } from "@/services/getMe";
import NextAuth, { User } from "next-auth";
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
        token: { label: "Token", type: "text" }, // For LinkedIn OAuth
      },
      authorize: async (credentials) => {
        // Handle LinkedIn OAuth with token
        if (credentials?.token) {
          try {
            const userData = await getMe(credentials.token as string);
            
            if (!userData) {
              console.error("LinkedIn auth failed: User data not found");
              return null;
            }

            return {
              ...userData,
              token: credentials.token as string,
              accessToken: credentials.token as string,
            };
          } catch (error) {
            console.error("LinkedIn auth error:", error);
            return null;
          }
        }

        // Handle regular email/password login
        const data = credentials as ILoginForm;

        const response = await request<ILoginForm, User>({
          url: API_ROUTES.LOGIN,
          method: "POST",
          data,
        });
        if (response.status === API_STATUS.ERROR) {
          console.error("Login failed:", response.message);
          return null;
        }

        const userData = response.data;

        if (!userData || !userData.token) return null;

        return {
          ...userData,
          accessToken: userData.token,
        };
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
        token.accessToken = user.token;
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
