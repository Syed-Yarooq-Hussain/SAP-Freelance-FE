import { Roles } from "@/constants/roles";
import { ILoginForm } from "@/types/common-auth";
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const TEST_USERS: Record<string, { role: number; name: string }> = {
  "client@test.com": { role: Roles.CLIENT, name: "Test Client" },
  "consultant@test.com": { role: Roles.CONSULTANT, name: "Test Consultant" },
  "admin@test.com": { role: Roles.ADMIN, name: "Test Admin" },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        const { email = "", password = "" } = (creds || {}) as ILoginForm;
        const hit = TEST_USERS[email.toLowerCase()];
        if (!hit) return null;
        if (password !== "test") return null;

        return {
          id: `test-${hit.role}`,
          name: hit.name,
          email,
          role: hit.role,
          token: "test-token",
        } as unknown as User;
      },
    }),
  ],

  session: { strategy: "jwt" },

  secret: "dev-only-secret",

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as any;
        token.accessToken = (user as any).token ?? "test-token";
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: token.user as typeof session.user,
        accessToken: (token as any).accessToken as string,
      };
    },
  },
});
