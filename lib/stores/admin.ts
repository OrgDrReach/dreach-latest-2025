import { create } from "zustand";
import { adminApi } from "@/lib/api";
import { handleAPIError } from "@/lib/errors";
import { DashboardStats } from "@/types/dashboard";
import { IUser } from "@/types/user.d.types";
import {
	DashboardProvider,
	VerificationStatus,
} from "@/types/provider.d.types";
import { AppointmentType } from "@/types/appointment.d.types";

interface AdminStore {
	users: IUser[];
	unverifiedProviders: DashboardProvider[];
	appointments: AppointmentType[];
	stats: DashboardStats | null;
	loading: boolean;
	error: string | null;
	fetchUsers: () => Promise<void>;
	fetchUnverifiedProviders: () => Promise<void>;
	fetchAppointments: () => Promise<void>;
	verifyProvider: (
		providerId: string,
		action: "approve" | "reject",
		reason?: string
	) => Promise<void>;
	fetchStats: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
	users: [],
	unverifiedProviders: [],
	appointments: [],
	stats: null,
	loading: false,
	error: null,

	fetchUsers: async () => {
		set({ loading: true, error: null });
		try {
			const response = await adminApi.getAllUsers();
			set({ users: response as IUser[], loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	fetchUnverifiedProviders: async () => {
		set({ loading: true, error: null });
		try {
			const response = await adminApi.getUnverifiedProviders();
			set({
				unverifiedProviders: response as DashboardProvider[],
				loading: false,
			});
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	fetchAppointments: async () => {
		set({ loading: true, error: null });
		try {
			const response = await adminApi.getAppointments();
			set({ appointments: response as AppointmentType[], loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	verifyProvider: async (providerId, action, reason) => {
		set({ loading: true, error: null });
		try {
			await adminApi.actionOnProvider({
				providerId,
				action,
				reason,
			});
			set((state) => ({
				unverifiedProviders: state.unverifiedProviders.filter(
					(provider) => provider.id !== providerId
				),
				loading: false,
			}));
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},

	fetchStats: async () => {
		set({ loading: true, error: null });
		try {
			const response = await adminApi.getAppointments();
			const appointments = response as AppointmentType[];
			const stats: DashboardStats = {
				totalAppointments: appointments.length,
				upcomingAppointments: appointments.filter(
					(a: AppointmentType) => a.status === "confirmed"
				).length,
				completedAppointments: appointments.filter(
					(a: AppointmentType) => a.status === "completed"
				).length,
				cancelledAppointments: appointments.filter(
					(a: AppointmentType) => a.status === "cancelled"
				).length,
			};
			set({ stats, loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},
}));
