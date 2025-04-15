import NextAuth from "next-auth";
import { EUserRole } from "./user.d.types";

declare module "next-auth" {
	interface User {
		id: string;
		name: string;
		email: string;
		image?: string;
		role: EUserRole;
		accessToken?: string;
	}

	interface Session {
		user: User;
		accessToken: string;
		error?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: EUserRole;
		accessToken: string;
	}
}
