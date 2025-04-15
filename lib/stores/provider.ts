import { create } from "zustand";
import { providerApi } from "@/lib/api";
import { DashboardProvider } from "@/types/provider.d.types";
import { handleAPIError } from "@/lib/errors";

interface ProviderStore {
	provider: DashboardProvider | null;
	schedule: any[];
	patients: any[];
	loading: boolean;
	error: string | null;
	fetchProvider: (providerId: string) => Promise<void>;
	updateProfile: (data: Partial<DashboardProvider>) => Promise<void>;
	updateSchedule: (scheduleData: any) => Promise<void>;
	fetchPatients: (providerId: string) => Promise<void>;
	addMedicalRecord: (recordData: any) => Promise<void>;
}

export const useProviderStore = create<ProviderStore>((set) => ({
	provider: null,
	schedule: [],
	patients: [],
	loading: false,
	error: null,

	fetchProvider: async (providerId: string) => {
		set({ loading: true, error: null });
		try {
			const response = await providerApi.getProviderById(providerId);
			set({ provider: response, loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	updateProfile: async (data) => {
		set({ loading: true, error: null });
		try {
			const response = await providerApi.updateProfile(data);
			set((state) => ({
				provider: { ...state.provider, ...response },
				loading: false,
			}));
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},

	updateSchedule: async (scheduleData) => {
		set({ loading: true, error: null });
		try {
			await providerApi.updateSchedule(scheduleData);
			set({ loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},

	fetchPatients: async (providerId: string) => {
		set({ loading: true, error: null });
		try {
			const response = await providerApi.getPatients(providerId);
			set({ patients: response, loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	addMedicalRecord: async (recordData) => {
		set({ loading: true, error: null });
		try {
			await providerApi.addMedicalRecord(recordData);
			set({ loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},
}));
