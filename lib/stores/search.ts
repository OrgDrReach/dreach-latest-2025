import { create } from "zustand";
import { userApi } from "@/lib/api";
import { handleAPIError } from "@/lib/errors";
import {
	ProviderSearchFilters,
	DashboardProvider,
} from "@/types/provider.d.types";

interface SearchStore {
	searchResults: DashboardProvider[];
	popularDoctors: DashboardProvider[];
	filters: ProviderSearchFilters;
	loading: boolean;
	error: string | null;
	searchProviders: (filters: ProviderSearchFilters) => Promise<void>;
	findDoctorsByHomeVisit: () => Promise<void>;
	findDoctorsByVideoConsult: () => Promise<void>;
	getPopularDoctors: () => Promise<void>;
	updateFilters: (newFilters: Partial<ProviderSearchFilters>) => void;
	resetFilters: () => void;
}

const defaultFilters: ProviderSearchFilters = {
	type: undefined,
	specialization: undefined,
	location: undefined,
	availability: undefined,
	services: {
		homeVisit: false,
		videoConsult: false,
	},
	verificationStatus: "verified",
	rating: undefined,
	priceRange: undefined,
};

export const useSearchStore = create<SearchStore>((set, get) => ({
	searchResults: [],
	popularDoctors: [],
	filters: defaultFilters,
	loading: false,
	error: null,

	searchProviders: async (filters: ProviderSearchFilters) => {
		set({ loading: true, error: null });
		try {
			let response;
			if (filters.services?.homeVisit) {
				response = await userApi.findServiceProvidersByHomeVisit();
			} else if (filters.services?.videoConsult) {
				response = await userApi.findDoctorbyVideoConsultation();
			} else {
				response = await userApi.findServiceProvidersList();
			}

			// Apply additional filters client-side
			const filteredResults = response.filter((provider: DashboardProvider) => {
				if (filters.type && provider.type !== filters.type) return false;
				if (
					filters.specialization &&
					provider.specialization !== filters.specialization
				)
					return false;
				if (filters.rating && provider.rating < filters.rating) return false;
				if (filters.priceRange) {
					const { min, max } = filters.priceRange;
					if (min && provider.consultationFee < min) return false;
					if (max && provider.consultationFee > max) return false;
				}
				return true;
			});

			set({ searchResults: filteredResults, loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	findDoctorsByHomeVisit: async () => {
		set({ loading: true, error: null });
		try {
			const response = await userApi.findServiceProvidersByHomeVisit();
			set({ searchResults: response, loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	findDoctorsByVideoConsult: async () => {
		set({ loading: true, error: null });
		try {
			const response = await userApi.findDoctorbyVideoConsultation();
			set({ searchResults: response, loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	getPopularDoctors: async () => {
		set({ loading: true, error: null });
		try {
			const response = await userApi.getPopularDoctors();
			set({ popularDoctors: response, loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	updateFilters: (newFilters: Partial<ProviderSearchFilters>) => {
		const currentFilters = get().filters;
		const updatedFilters = {
			...currentFilters,
			...newFilters,
		};
		set({ filters: updatedFilters });
		get().searchProviders(updatedFilters);
	},

	resetFilters: () => {
		set({ filters: defaultFilters });
		get().searchProviders(defaultFilters);
	},
}));
