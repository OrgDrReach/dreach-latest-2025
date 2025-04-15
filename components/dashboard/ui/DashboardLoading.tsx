"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardLoading = () => {
	return (
		<div className="w-full h-screen space-y-6 p-6">
			{/* Header Loading State */}
			<div className="flex justify-between items-center">
				<div className="space-y-2">
					<Skeleton className="h-8 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
				<div className="flex items-center space-x-4">
					<Skeleton className="h-10 w-10 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-[150px]" />
						<Skeleton className="h-3 w-[100px]" />
					</div>
				</div>
			</div>

			{/* Content Loading State */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="p-6 bg-card rounded-lg space-y-4">
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-20 w-full" />
						<div className="space-y-2">
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-3 w-4/5" />
						</div>
					</div>
				))}
			</div>

			{/* Navigation Loading State */}
			<div className="fixed left-0 top-0 h-screen w-[250px] bg-background border-r p-4 space-y-4">
				<Skeleton className="h-12 w-full" />
				{[...Array(8)].map((_, i) => (
					<Skeleton key={i} className="h-10 w-full" />
				))}
			</div>
		</div>
	);
};

export default DashboardLoading;
