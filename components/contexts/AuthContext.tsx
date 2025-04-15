"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { DashboardRole, DashboardUser } from "@/types/dashboard";
import { useDashboardStore } from "@/lib/stores/dashboard-store";

interface AuthContextType {
	user: DashboardUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isLoading: true,
	isAuthenticated: false,
});

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { data: session, status } = useSession();
	const { currentUser, setCurrentUser } = useDashboardStore();

	useEffect(() => {
		if (session?.user) {
			// Determine role from URL or session data
			const role: DashboardRole =
				(session.user.role as DashboardRole) || "patient";

			const user: DashboardUser = {
				name: session.user.name || null,
				email: session.user.email || null,
				role: role,
				imageUrl: session.user.image || undefined,
			};
			setCurrentUser(user);
		} else {
			setCurrentUser(null);
		}
	}, [session, setCurrentUser]);

	const value = {
		user: currentUser,
		isLoading: status === "loading",
		isAuthenticated: status === "authenticated",
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
