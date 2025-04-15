import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DashboardUser } from "@/types/dashboard";

interface DashboardState {
	expanded: boolean;
	currentUser: DashboardUser | null;
	setExpanded: (expanded: boolean) => void;
	setCurrentUser: (user: DashboardUser | null) => void;
}

export const useDashboardStore = create<DashboardState>()(
	persist(
		(set) => ({
			expanded: true,
			currentUser: null,
			setExpanded: (expanded) => set({ expanded }),
			setCurrentUser: (user) => set({ currentUser: user }),
		}),
		{
			name: "dashboard-storage",
		}
	)
);
