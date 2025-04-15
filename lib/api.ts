import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
	requireAuth?: boolean;
}

export async function fetchApi<T>(
	endpoint: string,
	options: FetchOptions = {}
): Promise<T> {
	const { requireAuth = true, ...fetchOptions } = options;
	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...fetchOptions.headers,
	};

	if (requireAuth) {
		const session = await getSession();
		if (session?.accessToken) {
			headers["Authorization"] = `Bearer ${session.accessToken}`;
		}
	}

	const response = await fetch(`${API_URL}${endpoint}`, {
		...fetchOptions,
		headers,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "API request failed");
	}

	return data;
}

// User API endpoints
export const userApi = {
	signup: (data: any) =>
		fetchApi("/user/signup", {
			method: "POST",
			body: JSON.stringify(data),
			requireAuth: false,
		}),
	updateUser: (data: any) =>
		fetchApi("/user/updateUser", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	getDoctors: () => fetchApi("/user/doctors", { method: "GET" }),
	getApprovedProviders: () =>
		fetchApi("/user/getApprovedServiceProviders", { method: "GET" }),
	addReview: (data: any) =>
		fetchApi("/user/addReview", {
			method: "POST",
			body: JSON.stringify(data),
		}),
};

// Provider API endpoints
export const providerApi = {
	updateProfile: (data: any) =>
		fetchApi("/provider/updateServiceProvider", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	updateSchedule: (data: any) =>
		fetchApi("/provider/updateSchedule", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	checkAvailability: (data: any) =>
		fetchApi("/provider/checkProviderAvailability", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	bookAppointment: (data: any) =>
		fetchApi("/provider/bookAppointment", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	getSchedule: (userId: string) =>
		fetchApi(`/provider/getSchedule/${userId}`, {
			method: "GET",
		}),
	getPatients: (providerId: string) =>
		fetchApi(`/provider/getPatients/${providerId}`, {
			method: "GET",
		}),
};

// Admin API endpoints
export const adminApi = {
	getAllUsers: () => fetchApi("/admin/getAllUsers", { method: "GET" }),
	getUnverifiedProviders: () =>
		fetchApi("/admin/getUnverifiedProvider", { method: "GET" }),
	getAppointments: () => fetchApi("/admin/getAppointments", { method: "GET" }),
	actionOnProvider: (data: any) =>
		fetchApi("/admin/actionOnProvider", {
			method: "POST",
			body: JSON.stringify(data),
		}),
};
