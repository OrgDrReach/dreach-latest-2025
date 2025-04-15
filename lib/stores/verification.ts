import { create } from "zustand";
import { providerApi } from "@/lib/api";
import { handleAPIError } from "@/lib/errors";
import { VerificationStatus } from "@/types/provider.d.types";

interface VerificationDocument {
	id: string;
	type: string;
	url: string;
	status: VerificationStatus;
	comments?: string;
}

interface VerificationStore {
	documents: VerificationDocument[];
	verificationStatus: VerificationStatus;
	loading: boolean;
	error: string | null;
	uploadDocument: (documentData: FormData) => Promise<void>;
	removeDocument: (documentId: string) => Promise<void>;
	submitVerification: (providerId: string) => Promise<void>;
	checkVerificationStatus: (providerId: string) => Promise<void>;
}

export const useVerificationStore = create<VerificationStore>((set) => ({
	documents: [],
	verificationStatus: "pending",
	loading: false,
	error: null,

	uploadDocument: async (documentData: FormData) => {
		set({ loading: true, error: null });
		try {
			const response = await providerApi.uploadProviderProfile(documentData);
			set((state) => ({
				documents: [...state.documents, response],
				loading: false,
			}));
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},

	removeDocument: async (documentId: string) => {
		set({ loading: true, error: null });
		try {
			await providerApi.removeDocument({ documentId });
			set((state) => ({
				documents: state.documents.filter((doc) => doc.id !== documentId),
				loading: false,
			}));
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},

	submitVerification: async (providerId: string) => {
		set({ loading: true, error: null });
		try {
			await providerApi.updateServiceProvider({
				providerId,
				status: "pending_verification",
			});
			set({ verificationStatus: "pending_verification", loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},

	checkVerificationStatus: async (providerId: string) => {
		set({ loading: true, error: null });
		try {
			const provider = await providerApi.getProviderById(providerId);
			set({
				verificationStatus: provider.verificationStatus,
				loading: false,
			});
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},
}));
