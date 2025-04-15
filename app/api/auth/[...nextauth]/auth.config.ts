import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { EUserRole } from "@/types/user.d.types";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
	throw new Error("Missing Google OAuth credentials");
}

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
					role: "patient" as EUserRole,
				};
			},
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				phone: { label: "Phone", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.phone || !credentials?.password) {
					throw new Error("Missing credentials");
				}

				try {
					const response = await fetch(
						`${process.env.BACKEND_URL}/auth/login`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								phone: credentials.phone,
								password: credentials.password,
							}),
						}
					);

					const data = await response.json();

					if (!response.ok) {
						throw new Error(data.message || "Authentication failed");
					}

					return {
						id: data.user.id,
						name: data.user.name,
						email: data.user.email,
						image: data.user.image,
						role: data.user.role,
						accessToken: data.accessToken,
					};
				} catch (error) {
					throw new Error("Authentication failed");
				}
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				token.accessToken =
					account.type === "credentials" ?
						user.accessToken
					:	account.access_token;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.role = token.role;
				session.user.id = token.sub;
				session.accessToken = token.accessToken;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
};
