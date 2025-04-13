import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/server-actions/user";
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

				const res = await loginUser(credentials.phone, credentials.password);

				if (res.status !== 201) {
					throw new Error(res.message || "Authentication failed");
				}

				// Return a properly typed User object
				return {
					id: res.user?.id || "",
					email: res.user?.email || "",
					name:
						res.user?.firstName ?
							`${res.user.firstName} ${res.user.lastName}`
						:	"",
					phone: res.user?.phone || "",
					firstName: res.user?.firstName || "",
					lastName: res.user?.lastName || "",
					role: res.user?.role || EUserRole.PATIENT,
					isVerified: res.user?.isVerified || false,
					image: res.user?.profileImage || null,
					providerRole: res.user?.providerRole,
					address: res.user?.address,
					profileImage: res.user?.profileImage,
				};
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.phone = user.phone;
				token.firstName = user.firstName;
				token.lastName = user.lastName;
				token.role = user.role;
				token.isVerified = user.isVerified;
				token.providerRole = user.providerRole;
				token.address = user.address;
				token.profileImage = user.profileImage;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.email = token.email;
				session.user.name = token.name;
				session.user.phone = token.phone as string;
				session.user.firstName = token.firstName as string;
				session.user.lastName = token.lastName as string;
				session.user.role = token.role as EUserRole;
				session.user.isVerified = token.isVerified as boolean;
				session.user.providerRole =
					token.providerRole as typeof session.user.providerRole;
				session.user.address = token.address as typeof session.user.address;
				session.user.profileImage = token.profileImage as string | undefined;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
};
