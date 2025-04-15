import { create } from "zustand";
import { providerApi } from "@/lib/api";
import { handleAPIError } from "@/lib/errors";

interface MedicalRecordStore {
	records: any[];
	currentRecord: any | null;
	loading: boolean;
	error: string | null;
	fetchRecordsByProvider: (
		providerId: string,
		patientId: string
	) => Promise<void>;
	fetchRecordsBySelf: (patientId: string) => Promise<void>;
	addMedicalRecord: (recordData: any) => Promise<void>;
	addDocument: (documentData: FormData) => Promise<void>;
	removeDocument: (documentId: string) => Promise<void>;
}

export const useMedicalRecordStore = create<MedicalRecordStore>((set) => ({
	records: [],
	currentRecord: null,
	loading: false,
	error: null,

	fetchRecordsByProvider: async (providerId: string, patientId: string) => {
		set({ loading: true, error: null });
		try {
			const response = await providerApi.getPatientMedicalByProvider({
				providerId,
				patientId,
			});
			set({ records: response, loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	fetchRecordsBySelf: async (patientId: string) => {
		set({ loading: true, error: null });
		try {
			const response = await providerApi.getPatientsMedicalBySelf({
				patientId,
			});
			set({ records: response, loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	addMedicalRecord: async (recordData) => {
		set({ loading: true, error: null });
		try {
			const response = await providerApi.addMedicalRecord(recordData);
			set((state) => ({
				records: [...state.records, response],
				loading: false,
			}));
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},

	addDocument: async (documentData) => {
		set({ loading: true, error: null });
		try {
			const response = await providerApi.addDocument(documentData);
			set((state) => ({
				currentRecord:
					state.currentRecord ?
						{
							...state.currentRecord,
							documents: [...state.currentRecord.documents, response],
						}
					:	null,
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
				currentRecord:
					state.currentRecord ?
						{
							...state.currentRecord,
							documents: state.currentRecord.documents.filter(
								(doc: any) => doc.id !== documentId
							),
						}
					:	null,
				loading: false,
			}));
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},
}));
