"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LabsDashboardPage: React.FC = () => {
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
				<h1 className="text-2xl font-bold mb-6">Labs Dashboard</h1>
				{/* Add your labs dashboard content here */}
			</div>
		</main>
	);
};

export default LabsDashboardPage;
