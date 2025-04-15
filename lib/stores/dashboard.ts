import { create } from "zustand";
import { adminApi, providerApi, userApi } from "@/lib/api";
import { AppointmentType } from "@/types/appointment.d.types";
import { DashboardStats } from "@/types/dashboard";

interface DashboardStore {
	stats: DashboardStats | null;
	appointments: AppointmentType[];
	loading: boolean;
	error: string | null;
	fetchStats: () => Promise<void>;
	fetchAppointments: (userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
	stats: null,
	appointments: [],
	loading: false,
	error: null,

	fetchStats: async () => {
		set({ loading: true, error: null });
		try {
			const response = await adminApi.getAppointments();
			const stats = {
				totalAppointments: response.length,
				upcomingAppointments: response.filter((a) => a.status === "confirmed")
					.length,
				completedAppointments: response.filter((a) => a.status === "completed")
					.length,
				cancelledAppointments: response.filter((a) => a.status === "cancelled")
					.length,
			};
			set({ stats, loading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Failed to fetch stats",
				loading: false,
			});
		}
	},

	fetchAppointments: async (userId: string) => {
		set({ loading: true, error: null });
		try {
			const response = await providerApi.getSchedule(userId);
			set({ appointments: response, loading: false });
		} catch (error) {
			set({
				error:
					error instanceof Error ?
						error.message
					:	"Failed to fetch appointments",
				loading: false,
			});
		}
	},
}));
