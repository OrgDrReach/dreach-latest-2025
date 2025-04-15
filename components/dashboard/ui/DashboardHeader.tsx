"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { DarkModeToggle } from "@/components/themes/dark-mode-toggle";
import type {
	DashboardUser,
	DashboardRole,
	HeaderProps,
} from "@/types/dashboard";

const getRoleDisplay = (role: DashboardRole) => {
	switch (role) {
		case "admin":
			return "Admin";
		case "doctor":
			return "Dr.";
		case "hospital":
			return "Hospital Admin";
		case "patient":
			return "";
		default:
			return "";
	}
};

const Greeting: React.FC<{ user: DashboardUser }> = ({ user }) => {
	const [greeting, setGreeting] = useState("");

	useEffect(() => {
		const updateGreeting = () => {
			const hours = new Date().getHours();
			if (hours < 12) {
				setGreeting("Good Morning!");
			} else if (hours < 18) {
				setGreeting("Good Afternoon!");
			} else {
				setGreeting("Good Evening!");
			}
		};

		updateGreeting();
		const intervalId = setInterval(updateGreeting, 1000 * 60);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-sm">
			<div className="flex items-center space-x-4">
				<div>
					<h1 className="text-xl font-semibold text-gray-800 dark:text-white">
						{greeting}{" "}
						<span>
							{user.role && (
								<span className="text-[#30ACDA]">
									{getRoleDisplay(user.role)}
								</span>
							)}{" "}
							{user.name}
						</span>
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Welcome to your dashboard
					</p>
				</div>
			</div>

			<div className="flex items-center space-x-4">
				<DarkModeToggle />
				<div className="flex items-center space-x-2">
					<Avatar>
						<AvatarImage
							src={user.imageUrl || "https://github.com/shadcn.png"}
							alt={user.name || "User avatar"}
						/>
						<AvatarFallback>
							{user.name
								?.split(" ")
								.map((n) => n[0])
								.join("") || "U"}
						</AvatarFallback>
					</Avatar>
					<div className="hidden md:block">
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{user.name}
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{user.email}
						</p>
					</div>
				</div>
			</div>
		</header>
	);
};

const DashboardHeader: React.FC<HeaderProps> = ({ role, user }) => {
	const { data: session } = useSession();

	const userData: DashboardUser = {
		name: user?.name || session?.user?.name || "Guest User",
		email: user?.email || session?.user?.email || "guest@example.com",
		role: role,
		imageUrl: user?.imageUrl ?? session?.user?.image ?? undefined,
	};

	return <Greeting user={userData} />;
};

export default DashboardHeader;
