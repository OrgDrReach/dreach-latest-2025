export type DashboardRole = "admin" | "doctor" | "hospital" | "patient";

export interface DashboardUser {
	id?: string;
	name: string | null;
	email: string | null;
	role: DashboardRole;
	imageUrl?: string;
	specialization?: string[];
	hospitalName?: string;
	department?: string;
}

export interface NavItem {
	name: string;
	path: string;
	icon: React.ReactNode;
	menu?: NavItem[];
}

export interface SideNavProps {
	role: DashboardRole;
	user?: DashboardUser;
}

export interface HeaderProps {
	role: DashboardRole;
	user?: DashboardUser;
}
