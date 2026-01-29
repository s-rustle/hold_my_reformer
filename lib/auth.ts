import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    credits?: number;
  }
  interface Session {
    user: User & { name?: string | null; email?: string | null };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          credits: user.credits,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        (token as { id?: string; role?: Role; credits?: number }).id = user.id;
        (token as { id?: string; role?: Role; credits?: number }).role = user.role;
        (token as { id?: string; role?: Role; credits?: number }).credits = user.credits;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.credits = token.credits as number;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
