"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import { RNChildProp } from "@/@types/interface/Interface";
import React, { useEffect, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/dashboard/ui/DashboardHeader";
import DashboardSideNav from "@/components/dashboard/ui/DashboardSideNav";
import DashboardError from "@/components/dashboard/ui/DashboardError";
import DashboardLoading from "@/components/dashboard/ui/DashboardLoading";
import { useDashboardStore } from "@/lib/stores/dashboard-store";
import type { DashboardRole, DashboardUser } from "@/types/dashboard";

const getRoleFromPath = (path: string): DashboardRole => {
	if (path.includes("/dashboard/admin")) return "admin";
	if (path.includes("/dashboard/doctors")) return "doctor";
	if (path.includes("/dashboard/hospitals")) return "hospital";
	return "patient";
};

export default function DashboardLayout({ children }: RNChildProp) {
	const pathname = usePathname();
	const { data: session, status } = useSession();
	const { expanded, setCurrentUser } = useDashboardStore();
	const router = useRouter();
	const role = getRoleFromPath(pathname);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.replace("/auth/login");
			return;
		}

		if (session?.user) {
			const user: DashboardUser = {
				name: session.user.name || null,
				email: session.user.email || null,
				role: role,
				imageUrl: session.user.image || undefined,
			};
			setCurrentUser(user);
		}
	}, [session, role, setCurrentUser, status, router]);

	// Handle initial loading state
	if (status === "loading") {
		return <DashboardLoading />;
	}

	// Show nothing while redirecting
	if (status === "unauthenticated") {
		return null;
	}

	return (
		<main className="min-h-screen">
			<div className="flex h-screen overflow-hidden">
				<DashboardSideNav role={role} />
				<div
					className={`flex-1 overflow-y-auto transition-all duration-300 ${expanded ? "ml-64" : "ml-20"}`}>
					<DashboardHeader role={role} />
					<div className="p-6">
						<Suspense fallback={<DashboardLoading />}>
							<ErrorBoundary>{children}</ErrorBoundary>
						</Suspense>
					</div>
				</div>
			</div>
		</main>
	);
}

class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean; error: Error | null }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Dashboard error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<DashboardError
					error={this.state.error || new Error("An unknown error occurred")}
					reset={() => this.setState({ hasError: false, error: null })}
				/>
			);
		}

		return this.props.children;
	}
}
