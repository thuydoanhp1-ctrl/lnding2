import { UserStatus } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      status: UserStatus;
      isAdmin: boolean;
      referralCode?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    status?: UserStatus;
    isAdmin?: boolean;
    referralCode?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    status?: UserStatus;
    isAdmin?: boolean;
    referralCode?: string | null;
    lastRefresh?: number;
  }
}
