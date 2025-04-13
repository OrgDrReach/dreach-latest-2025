"use server";

import { SignUpSchema, SignUpSchemaType } from "@/Zod/zod";
import { EUserRole } from "@/types/user.d.types";

export const registerUser = async (formdata: SignUpSchemaType) => {
	try {
		const result = SignUpSchema.safeParse(formdata);

		if (!result.success) {
			return {
				status: 400,
				message: "Invalid form data",
			};
		}

		const res = await fetch(`${process.env["SERVER_URL"]}/user/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				phone: formdata.phone,
				password: formdata.password,
				firstName: formdata.firstName,
				lastName: formdata.lastName,
				email: formdata.email,
				userType: formdata.userType,
				providerRole: formdata.providerRole,
			}),
		});

		const data = await res.json();
		return {
			status: res.status,
			message: data.message,
			userId: data.userId,
		};
	} catch (error) {
		console.error("Registration error:", error);
		return {
			status: 500,
			message: "Internal server error",
		};
	}
};

export const verifyUser = async (phone: string, otp: number) => {
	try {
		const res = await fetch(
			`${process.env["SERVER_URL"]}/user/verifyUserRegistration`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					phone: phone,
					otp: otp,
				}),
			}
		);

		const data = await res.json();
		return {
			status: res.status,
			message: data.message,
		};
	} catch (error) {
		return {
			status: 500,
			message: "Internal Server Error",
		};
	}
};

export const loginUser = async (phone: string, password: string) => {
	try {
		const res = await fetch(`${process.env["SERVER_URL"]}/user/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				phone: phone,
				password: password,
			}),
		});

		const data = await res.json();

		return {
			status: res.status,
			message: data.message,
			user:
				data.user ?
					{
						id: data.user.id,
						email: data.user.email,
						phone: data.user.phone,
						firstName: data.user.firstName,
						lastName: data.user.lastName,
						role: data.user.role,
						isVerified: data.user.isVerified,
						providerRole: data.user.providerRole,
						address: data.user.address,
						profileImage: data.user.profileImage,
					}
				:	undefined,
		};
	} catch (error) {
		console.error("Login error:", error);
		return {
			status: 500,
			message: "Internal Server Error",
		};
	}
};

export const updateOAuthUser = async (
	userId: string,
	data: {
		phone?: string;
		userType?: "patient" | "provider";
		providerRole?:
			| "doctor"
			| "hospital"
			| "lab"
			| "pharmaceutical"
			| "ambulance";
	}
) => {
	try {
		const res = await fetch(
			`${process.env["SERVER_URL"]}/user/update/${userId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);

		const responseData = await res.json();
		return {
			status: res.status,
			message: responseData.message,
			user: responseData.user,
		};
	} catch (error) {
		console.error("OAuth user update error:", error);
		return {
			status: 500,
			message: "Internal Server Error",
		};
	}
};
