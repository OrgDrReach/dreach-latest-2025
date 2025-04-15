"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	ChevronFirst,
	ChevronLast,
	MoreVertical,
	Gauge,
	BarChart3,
	Users,
	Package,
	Receipt,
	Boxes,
	ActivitySquare,
	LifeBuoy,
	Settings,
	Calendar,
	FileText,
	MessageSquare,
	Bell,
	User,
	Building2,
	Stethoscope,
	Users2,
	Box,
	Pill,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboardStore } from "@/lib/stores/dashboard-store";
import type { SideNavProps, NavItem } from "@/types/dashboard";

const navConfigs: Record<string, NavItem[]> = {
	admin: [
		{
			name: "Dashboard",
			path: "/dashboard/admin",
			icon: <Gauge size={20} />,
		},
		{
			name: "Analytics",
			path: "/dashboard/admin/analytics",
			icon: <BarChart3 size={20} />,
		},
		{
			name: "Site Management",
			path: "/dashboard/admin/sitemanager",
			icon: <Users size={20} />,
		},
		{
			name: "Employee Management",
			path: "/dashboard/admin/employees",
			icon: <Package size={20} />,
		},
		{
			name: "Users",
			path: "/dashboard/admin/users",
			icon: <Receipt size={20} />,
		},
		{
			name: "Doctors",
			path: "/dashboard/admin/doctors",
			icon: <Boxes size={20} />,
		},
		{
			name: "Hospitals",
			path: "/dashboard/admin/hospitals",
			icon: <ActivitySquare size={20} />,
		},
		{
			name: "Alerts & Notifications",
			path: "/dashboard/admin/alerts",
			icon: <LifeBuoy size={20} />,
		},
		{
			name: "Settings",
			path: "/dashboard/admin/settings",
			icon: <Settings size={20} />,
		},
	],
	doctor: [
		{
			name: "Dashboard",
			path: "/dashboard/doctors",
			icon: <Gauge size={20} />,
		},
		{
			name: "Analytics",
			path: "/dashboard/doctors/analytics",
			icon: <BarChart3 size={20} />,
		},
		{
			name: "Patients",
			path: "/dashboard/doctors/patients",
			icon: <Users size={20} />,
		},
		{
			name: "Appointments",
			path: "/dashboard/doctors/appointments",
			icon: <Calendar size={20} />,
		},
		{
			name: "Prescriptions",
			path: "/dashboard/doctors/prescriptions",
			icon: <FileText size={20} />,
		},
		{
			name: "Messaging",
			path: "/dashboard/doctors/messaging",
			icon: <MessageSquare size={20} />,
		},
		{
			name: "Alerts",
			path: "/dashboard/doctors/alerts",
			icon: <Bell size={20} />,
		},
		{
			name: "Profile",
			path: "/dashboard/doctors/profile",
			icon: <User size={20} />,
		},
		{
			name: "Settings",
			path: "/dashboard/doctors/settings",
			icon: <Settings size={20} />,
		},
	],
	hospital: [
		{
			name: "Dashboard",
			path: "/dashboard/hospitals",
			icon: <Gauge size={20} />,
		},
		{
			name: "Analytics",
			path: "/dashboard/hospitals/analytics",
			icon: <BarChart3 size={20} />,
		},
		{
			name: "Doctors",
			path: "/dashboard/hospitals/doctors",
			icon: <Stethoscope size={20} />,
		},
		{
			name: "Patients",
			path: "/dashboard/hospitals/patients",
			icon: <Users size={20} />,
		},
		{
			name: "Departments",
			path: "/dashboard/hospitals/departments",
			icon: <Building2 size={20} />,
		},
		{
			name: "Inventory",
			path: "/dashboard/hospitals/inventory",
			icon: <Box size={20} />,
		},
		{
			name: "Staff",
			path: "/dashboard/hospitals/staff",
			icon: <Users2 size={20} />,
		},
		{
			name: "Settings",
			path: "/dashboard/hospitals/settings",
			icon: <Settings size={20} />,
		},
	],
	patient: [
		{
			name: "Dashboard",
			path: "/dashboard/patients",
			icon: <Gauge size={20} />,
		},
		{
			name: "Appointments",
			path: "/dashboard/patients/appointments",
			icon: <Calendar size={20} />,
		},
		{
			name: "Medical Records",
			path: "/dashboard/patients/records",
			icon: <FileText size={20} />,
		},
		{
			name: "Prescriptions",
			path: "/dashboard/patients/prescriptions",
			icon: <Pill size={20} />,
		},
		{
			name: "Messages",
			path: "/dashboard/patients/messages",
			icon: <MessageSquare size={20} />,
		},
		{
			name: "Profile",
			path: "/dashboard/patients/profile",
			icon: <User size={20} />,
		},
		{
			name: "Settings",
			path: "/dashboard/patients/settings",
			icon: <Settings size={20} />,
		},
	],
};

const SideBarItem: React.FC<{
	icon: React.ReactNode;
	text: string;
	href: string;
	expanded: boolean;
}> = ({ icon, text, href, expanded }) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link href={href}>
			<li
				className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
					isActive ?
						"bg-[#ffffffe9] text-[#000] font-semibold"
					:	"hover:bg-white text-[#fff] hover:text-[#3d6b84]"
				}`}>
				{icon}
				<span
					className={`overflow-hidden transition-all ${
						expanded ? "w-52 ml-3" : "w-0"
					}`}>
					{text}
				</span>
				{!expanded && (
					<div
						className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-[#3d6b84] text-[#acedff] text-sm
              invisible opacity-20 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}>
						{text}
					</div>
				)}
			</li>
		</Link>
	);
};

const DashboardSideNav: React.FC<SideNavProps> = ({ role }) => {
	const { expanded, setExpanded, currentUser } = useDashboardStore();
	const navItems = navConfigs[role];

	return (
		<aside className="h-screen">
			<nav className="h-full flex flex-col bg-[#000] border-r shadow-sm">
				<div className="p-4 pb-2 border-[#fff] dark:border-slate-600 border-b mb-2 flex justify-between items-center">
					<Image
						src="/assets/icons/drreach-logo-full.svg"
						height={1000}
						width={1000}
						alt="logo"
						className={`overflow-hidden transition-all ${
							expanded ? "w-fit h-20 p-2 rounded-md" : "w-0 h-0"
						}`}
					/>
					<button
						onClick={() => setExpanded(!expanded)}
						className={`bg-gray-50 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 ${
							expanded ? "p-1 rounded-lg" : "mx-auto rounded-lg p-1"
						}`}>
						{expanded ?
							<ChevronFirst />
						:	<ChevronLast />}
					</button>
				</div>

				<ul className="flex-1 px-3">
					{navItems.map((item) => (
						<SideBarItem
							key={item.path}
							icon={item.icon}
							text={item.name}
							href={item.path}
							expanded={expanded}
						/>
					))}
				</ul>

				<div className="border-t flex p-3">
					<Avatar>
						<AvatarImage
							src={currentUser?.imageUrl || "https://github.com/shadcn.png"}
							alt={currentUser?.name || "User"}
						/>
						<AvatarFallback>
							{currentUser?.name
								?.split(" ")
								.map((n) => n[0])
								.join("") || "U"}
						</AvatarFallback>
					</Avatar>
					<div
						className={`flex justify-between items-center overflow-hidden transition-all ${
							expanded ? "w-52 ml-3" : "w-0"
						}`}>
						<div className="leading-4">
							<h4 className="font-semibold italic text-[#bae7ff]">
								{currentUser?.name || "Guest"}
							</h4>
							<span className="text-xs text-gray-200">
								{currentUser?.email || "guest@example.com"}
							</span>
						</div>
						<MoreVertical size={20} className="text-gray-200" />
					</div>
				</div>
			</nav>
		</aside>
	);
};

export default DashboardSideNav;
