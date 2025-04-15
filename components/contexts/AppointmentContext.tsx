"use client";

import React, { createContext, useContext, useState } from "react";
import { providerApi } from "@/lib/api";
import { AppointmentType } from "@/types/appointment.d.types";

interface AppointmentContextType {
	checkAvailability: (providerId: string, date: Date) => Promise<boolean>;
	bookAppointment: (appointmentData: AppointmentType) => Promise<void>;
	loading: boolean;
	error: string | null;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
	undefined
);

export function AppointmentProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const checkAvailability = async (providerId: string, date: Date) => {
		setLoading(true);
		setError(null);
		try {
			const response = await providerApi.checkAvailability({
				providerId,
				date: date.toISOString(),
			});
			return response.available;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to check availability"
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const bookAppointment = async (appointmentData: AppointmentType) => {
		setLoading(true);
		setError(null);
		try {
			await providerApi.bookAppointment(appointmentData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to book appointment"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return (
		<AppointmentContext.Provider
			value={{
				checkAvailability,
				bookAppointment,
				loading,
				error,
			}}>
			{children}
		</AppointmentContext.Provider>
	);
}

export function useAppointment() {
	const context = useContext(AppointmentContext);
	if (context === undefined) {
		throw new Error(
			"useAppointment must be used within an AppointmentProvider"
		);
	}
	return context;
}
