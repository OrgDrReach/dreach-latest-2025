import { createContext, useContext, useState, ReactNode } from "react";
import {
	Provider,
	ServiceCategory,
	ProviderType,
} from "@/types/provider.types";
import { AppointmentDetails } from "@/types/appointment.types";

interface AppointmentContextType {
	loading: boolean;
	selectedProvider: Provider | null;
	setSelectedProvider: (provider: Provider | null) => void;
	bookAppointment: (details: AppointmentDetails) => Promise<void>;
}

export const AppointmentContext = createContext<AppointmentContextType>({
	loading: false,
	selectedProvider: null,
	setSelectedProvider: () => {},
	bookAppointment: async () => {},
});

export function AppointmentProvider({ children }: { children: ReactNode }) {
	const [loading, setLoading] = useState(false);
	const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
		null
	);

	const bookAppointment = async (details: AppointmentDetails) => {
		try {
			setLoading(true);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			// Add your actual API call here

			return Promise.resolve();
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AppointmentContext.Provider
			value={{
				loading,
				// setLoading,
				selectedProvider,
				setSelectedProvider,
				bookAppointment,
			}}>
			{children}
		</AppointmentContext.Provider>
	);
}

export const useAppointment = () => {
	const context = useContext(AppointmentContext);
	if (context === undefined) {
		throw new Error(
			"useAppointment must be used within an AppointmentProvider"
		);
	}
	return context;
};

export type { AppointmentDetails };
