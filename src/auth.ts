import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import { generateReferralCode } from "@/lib/referral";
import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  events: {
    async createUser({ user }) {
      if (user.id) {
        const referralCode = generateReferralCode();
        const adminEmails = (env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());
        const isAdmin = user.email ? adminEmails.includes(user.email.toLowerCase()) : false;

        await db.user.update({
          where: { id: user.id },
          data: {
            referralCode,
            isAdmin,
          },
        });
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      // Refresh status & isAdmin from DB at most once per 60s
      const now = Math.floor(Date.now() / 1000);
      if (!token.lastRefresh || now - (token.lastRefresh as number) > 60) {
        if (token.id) {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: { id: true, status: true, isAdmin: true, referralCode: true },
          });

          if (dbUser) {
            token.status = dbUser.status;
            token.isAdmin = dbUser.isAdmin;
            token.referralCode = dbUser.referralCode;
            token.lastRefresh = now;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.status = (token.status as any) || "active";
        session.user.isAdmin = !!token.isAdmin;
        session.user.referralCode = token.referralCode as string | null;
      }
      return session;
    },
  },
});
