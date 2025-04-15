import { EUserRole } from "./user.d.types";

export interface AuthResponse {
	accessToken: string;
	user: {
		id: string;
		name: string;
		email: string;
		phone: string;
		role: EUserRole;
		image?: string;
		createdAt: string;
		updatedAt: string;
	};
}

export interface LoginCredentials {
	phone: string;
	password: string;
}

export interface RegisterCredentials {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: EUserRole;
}

export interface VerifyOTPCredentials {
	phone: string;
	otp: string;
}

export interface ResetPasswordCredentials {
	phone: string;
	newPassword: string;
	otp: string;
}
