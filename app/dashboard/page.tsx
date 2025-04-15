"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardPage: React.FC = () => {
	const { data: session } = useSession();
	const router = useRouter();

	React.useEffect(() => {
		if (!session) {
			router.push("/auth/login");
		}
	}, [session, router]);

	if (!session) {
		return null;
	}

	return (
		<main>
			<div>
				<h1 className="text-2xl font-bold mb-6">Dashboard</h1>
				{/* Add your main dashboard content here */}
				<p className="text-gray-600">
					Welcome to your dashboard. Select a section from the sidebar to get
					started.
				</p>
			</div>
		</main>
	);
};

export default DashboardPage;
