"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface DashboardErrorProps {
	error: Error;
	reset: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ error, reset }) => {
	const router = useRouter();
	const pathname = usePathname();

	const handleGoHome = () => {
		const basePath = pathname.split("/")[1];
		router.push(`/${basePath}`);
	};

	return (
		<div className="min-h-[400px] flex flex-col items-center justify-center p-6">
			<div className="flex items-center gap-2 text-destructive mb-4">
				<AlertCircle className="h-6 w-6" />
				<h2 className="text-2xl font-semibold">Something went wrong!</h2>
			</div>

			<p className="text-muted-foreground mb-6 text-center max-w-md">
				{error.message ||
					"An error occurred while loading the dashboard. Please try again."}
			</p>

			<div className="flex gap-4">
				<Button
					variant="outline"
					onClick={reset}
					className="flex items-center gap-2">
					<RefreshCw className="h-4 w-4" />
					Try again
				</Button>
				<Button
					variant="default"
					onClick={handleGoHome}
					className="flex items-center gap-2">
					<Home className="h-4 w-4" />
					Go to Dashboard
				</Button>
			</div>
		</div>
	);
};

export default DashboardError;
