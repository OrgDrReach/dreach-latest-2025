"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const HospitalsPage: React.FC = () => {
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
				<h1 className="text-2xl font-bold mb-6">Hospital Dashboard</h1>
				{/* Add your hospital dashboard content here */}
			</div>
		</main>
	);
};

export default HospitalsPage;
