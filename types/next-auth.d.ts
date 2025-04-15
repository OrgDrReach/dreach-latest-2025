import { DefaultSession, DefaultUser } from "next-auth";
import type { DashboardRole } from "./dashboard";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: DashboardRole;
			isVerified: boolean;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		role: DashboardRole;
		isVerified: boolean;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: DashboardRole;
		isVerified: boolean;
	}
}
