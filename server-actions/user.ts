"use server";

import { userApi } from "@/lib/api";
import { EUserRole } from "@/types/user.d.types";

export async function loginUser(email: string, password: string) {
	try {
		const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Login failed");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function registerUser(userData: {
	name: string;
	email: string;
	password: string;
	phone: string;
	role: EUserRole;
}) {
	try {
		return await userApi.signup(userData);
	} catch (error) {
		throw error;
	}
}

export async function updateUserProfile(userId: string, profileData: any) {
	try {
		return await userApi.updateUser({
			userId,
			...profileData,
		});
	} catch (error) {
		throw error;
	}
}

export async function applyForServiceProvider(providerData: any) {
	try {
		const response = await fetch(
			`${process.env.BACKEND_URL}/user/applyForServiceProvider`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(providerData),
			}
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to apply as service provider");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function getDoctors(filters?: any) {
	try {
		return await userApi.getDoctors();
	} catch (error) {
		throw error;
	}
}

export async function getApprovedProviders(type?: string) {
	try {
		return await userApi.getApprovedProviders();
	} catch (error) {
		throw error;
	}
}

export async function addReview(reviewData: {
	providerId: string;
	rating: number;
	comment: string;
}) {
	try {
		return await userApi.addReview(reviewData);
	} catch (error) {
		throw error;
	}
}

export async function updateOAuthUser(userId: string, data: any) {
	try {
		const response = await fetch(
			`${process.env.BACKEND_URL}/auth/oauth/complete-profile`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, ...data }),
			}
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to update OAuth user profile");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function verifyUser(phone: string, otp: string) {
	try {
		const response = await fetch(`${process.env.BACKEND_URL}/auth/verify`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ phone, otp }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Verification failed");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function resendOTP(phone: string) {
	try {
		const response = await fetch(`${process.env.BACKEND_URL}/auth/resend-otp`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ phone }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to resend OTP");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}
