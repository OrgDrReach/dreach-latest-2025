"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DarkModeToggle } from "@/components/themes/dark-mode-toggle";
import type { DashboardRole } from "@/types/dashboard";
import { useAuth } from "@/components/contexts/AuthContext";

interface IUser {
	name: string | null;
	email: string | null;
	role: DashboardRole;
	imageUrl?: string;
}

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

const Greeting: React.FC<{ user: IUser }> = ({ user }) => {
	const [greeting, setGreeting] = useState("");
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const updateGreeting = () => {
			const hours = currentTime.getHours();
			if (hours < 12) {
				setGreeting("Good Morning!");
			} else if (hours < 18) {
				setGreeting("Good Afternoon!");
			} else {
				setGreeting("Good Evening!");
			}
		};
		updateGreeting();
		const intervalId = setInterval(() => {
			setCurrentTime(new Date());
			updateGreeting();
		}, 1000 * 60);
		return () => clearInterval(intervalId);
	}, [currentTime]);

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

const Header: React.FC = () => {
	const { user } = useAuth();
	const currentUser: IUser = {
		name: user?.name || "Guest User",
		email: user?.email || "guest@example.com",
		role: user?.role || "patient",
		imageUrl: user?.imageUrl,
	};

	return (
		<main className="w-full">
			<Greeting user={currentUser} />
		</main>
	);
};

export default Header;
